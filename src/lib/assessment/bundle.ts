// Server-only: builds the admin export zip (project zip + portfolio.md per
// candidate, plus a summary.csv), streamed so large exports don't sit in memory.

import { Zip, ZipPassThrough } from 'fflate';
import { ASSESSMENT_BUCKET } from './config';
import type { AdminCandidateWithPath } from './admin';
import { db } from './server';

// The zip format without zip64 caps archives at 4 GB; stay comfortably below.
export const MAX_EXPORT_BYTES = 3.5 * 1024 * 1024 * 1024;

function safeSegment(value: string, max = 80): string {
  const cleaned = value
    .normalize('NFKD')
    .replace(/[^\w.@+-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^[._]+|[._]+$/g, '')
    .slice(0, max);
  return cleaned || 'file';
}

export function candidateFolder(c: AdminCandidateWithPath): string {
  return `${safeSegment(c.email)}_${c.id.slice(0, 8)}`;
}

export function projectFileName(c: AdminCandidateWithPath): string {
  const original = (c.submission?.fileName ?? 'project.zip').replace(/\.zip$/i, '');
  return `${safeSegment(c.email, 60)}__${safeSegment(original, 60)}.zip`;
}

function fmt(value: string | null): string {
  return value ? new Date(value).toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC') : '—';
}

export function portfolioMarkdown(c: AdminCandidateWithPath): string {
  const lines = [
    `# ${c.fullName ? `${c.fullName} <${c.email}>` : c.email}`,
    '',
    `- Status: ${c.status}`,
    `- Task: ${c.taskTitle ?? '—'}`,
    `- Started: ${fmt(c.startedAt)}`,
    `- Deadline: ${fmt(c.deadlineAt)}`,
    `- Submitted: ${fmt(c.submittedAt)}`,
    `- Minutes used: ${c.minutesUsed ?? '—'}`,
    `- Project file: ${c.submission?.fileName ?? '—'}${c.submission?.size ? ` (${c.submission.size} bytes)` : ''}`,
    '',
    '## Portfolio',
    '',
  ];
  if (!c.portfolio.links.length && !c.portfolio.text) {
    lines.push('_No portfolio submitted._');
  } else {
    lines.push(`Submitted: ${fmt(c.portfolio.submittedAt)}`, '');
    if (c.portfolio.links.length) {
      lines.push('### Links', '', ...c.portfolio.links.map((l) => `- <${l}>`), '');
    }
    if (c.portfolio.text) {
      lines.push('### Notes', '', c.portfolio.text);
    }
  }
  return lines.join('\n') + '\n';
}

function csvCell(value: unknown): string {
  let s = value === null || value === undefined ? '' : String(value);
  // Neutralise spreadsheet formula injection.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function summaryCsv(candidates: AdminCandidateWithPath[]): string {
  const header = [
    'email', 'full_name', 'status', 'task', 'started_at', 'submitted_at', 'minutes_used',
    'project_file', 'project_bytes', 'portfolio_links', 'portfolio_text', 'folder',
  ];
  const rows = candidates.map((c) => [
    c.email, c.fullName, c.status, c.taskTitle, c.startedAt, c.submittedAt, c.minutesUsed,
    c.submission?.fileName, c.submission?.size, c.portfolio.links.join(' '), c.portfolio.text, candidateFolder(c),
  ]);
  // BOM so Excel opens UTF-8 (Cyrillic) correctly.
  return '﻿' + [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

const encoder = new TextEncoder();

/** Returns a stream of a zip archive with every candidate's files. */
export function exportStream(candidates: AdminCandidateWithPath[]): ReadableStream<Uint8Array> {
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>(
    undefined,
    new ByteLengthQueuingStrategy({ highWaterMark: 4 * 1024 * 1024 }),
    new ByteLengthQueuingStrategy({ highWaterMark: 4 * 1024 * 1024 }),
  );
  const writer = writable.getWriter();
  const abort = new AbortController();
  let failed = false;

  const zip = new Zip((err, chunk, final) => {
    if (err) {
      failed = true;
      writer.abort(err).catch(() => {});
      return;
    }
    writer.write(chunk).catch(() => {
      failed = true;
      abort.abort();
    });
    if (final) writer.close().catch(() => {});
  });

  const addText = (name: string, text: string, mtime = new Date()) => {
    const file = new ZipPassThrough(name);
    file.mtime = mtime;
    zip.add(file);
    file.push(encoder.encode(text), true);
  };

  (async () => {
    addText('summary.csv', summaryCsv(candidates));

    for (const c of candidates) {
      if (failed) return;
      const folder = candidateFolder(c);
      addText(`${folder}/portfolio.md`, portfolioMarkdown(c), new Date(c.portfolio.submittedAt ?? c.createdAt));

      if (!c.submissionPath) continue;
      const signed = await db().storage.from(ASSESSMENT_BUCKET).createSignedUrl(c.submissionPath, 300);
      const res = signed.data?.signedUrl
        ? await fetch(signed.data.signedUrl, { cache: 'no-store', signal: abort.signal }).catch(() => null)
        : null;
      if (!res?.ok || !res.body) {
        console.error('[assessment-admin] export: could not fetch', c.submissionPath, signed.error ?? res?.status);
        addText(`${folder}/PROJECT_DOWNLOAD_FAILED.txt`, `Could not fetch ${c.submission?.fileName ?? 'project zip'} from storage.\n`);
        continue;
      }

      const file = new ZipPassThrough(`${folder}/${projectFileName(c)}`);
      if (c.submittedAt) file.mtime = new Date(c.submittedAt);
      zip.add(file);
      const reader = res.body.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          file.push(new Uint8Array(0), true);
          break;
        }
        file.push(value);
        await writer.ready; // backpressure: wait for the client to read
        if (failed) {
          await reader.cancel().catch(() => {});
          return;
        }
      }
    }
    zip.end();
  })().catch((error) => {
    console.error('[assessment-admin] export failed:', error);
    failed = true;
    abort.abort();
    writer.abort(error).catch(() => {});
  });

  return readable;
}
