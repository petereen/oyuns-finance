import { ASSESSMENT_BUCKET, MAX_ZIP_BYTES } from '@/lib/assessment/config';
import {
  SUBMIT_GRACE_MS,
  buildState,
  clientIp,
  db,
  fail,
  getCandidate,
  handler,
  isPastDeadline,
  json,
  parsePortfolio,
  readJson,
  sanitizeFilename,
  sessionCandidate,
} from '@/lib/assessment/server';

export const runtime = 'nodejs';

type SubmitBody = {
  path: string;
  filename: string;
  portfolioLinks: string[];
  portfolioText: string;
};

/** Reads the first bytes of the stored object and checks the ZIP signature. */
async function looksLikeZip(path: string): Promise<boolean> {
  const signed = await db().storage.from(ASSESSMENT_BUCKET).createSignedUrl(path, 60);
  if (signed.error || !signed.data?.signedUrl) throw signed.error ?? new Error('could not sign download url');

  const res = await fetch(signed.data.signedUrl, { headers: { Range: 'bytes=0-3' }, cache: 'no-store' });
  if (!res.ok || !res.body) return false;

  const reader = res.body.getReader();
  const header = new Uint8Array(4);
  let filled = 0;
  try {
    while (filled < 4) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      const take = Math.min(4 - filled, value.length);
      header.set(value.subarray(0, take), filled);
      filled += take;
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  // "PK\x03\x04" — local file header (a non-empty zip archive).
  return filled === 4 && header[0] === 0x50 && header[1] === 0x4b && header[2] === 0x03 && header[3] === 0x04;
}

export const POST = handler(
  async (request) => {
    const candidate = await sessionCandidate(request);
    if (!candidate) return fail('unauthorized', 401);
    if (candidate.submitted_at) return fail('already_submitted', 409, { state: await buildState(candidate) });
    if (!candidate.started_at) return fail('not_started', 409);
    if (isPastDeadline(candidate, SUBMIT_GRACE_MS)) return fail('time_up', 409);

    const body = await readJson<SubmitBody>(request);
    const path = typeof body?.path === 'string' ? body.path : '';
    const pathRe = new RegExp(`^${candidate.id}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.zip$`);
    if (!pathRe.test(path)) return fail('file_missing', 400);

    const portfolio = parsePortfolio(body?.portfolioLinks, body?.portfolioText);
    if (!portfolio.ok) return fail(portfolio.error, 400);

    // Verify the object really exists in the candidate's folder and its size.
    const [folder, objectName] = path.split('/');
    const listed = await db().storage.from(ASSESSMENT_BUCKET).list(folder, { search: objectName, limit: 10 });
    if (listed.error) throw listed.error;
    const object = listed.data?.find((item) => item.name === objectName);
    if (!object) return fail('file_missing', 400);
    const size = Number((object.metadata as { size?: number } | null)?.size ?? 0);
    if (!size) return fail('invalid_zip', 400);
    if (size > MAX_ZIP_BYTES) {
      await db().storage.from(ASSESSMENT_BUCKET).remove([path]);
      return fail('file_too_large', 400);
    }
    if (!(await looksLikeZip(path))) {
      await db().storage.from(ASSESSMENT_BUCKET).remove([path]);
      return fail('invalid_zip', 400);
    }

    const now = new Date().toISOString();
    const hasPortfolio = portfolio.links.length > 0 || !!portfolio.text;

    // Atomic: only succeeds if not yet submitted -> no duplicate submissions.
    const updated = await db()
      .from('assessment_candidates')
      .update({
        submitted_at: now,
        submission_path: path,
        submission_filename: sanitizeFilename(body?.filename),
        submission_size: size,
        submit_ip: clientIp(request),
        ...(hasPortfolio
          ? { portfolio_links: portfolio.links, portfolio_text: portfolio.text, portfolio_submitted_at: now }
          : {}),
      })
      .eq('id', candidate.id)
      .is('submitted_at', null)
      .select('id');
    if (updated.error) throw updated.error;

    const fresh = await getCandidate(candidate.id);
    if (!updated.data?.length) return fail('already_submitted', 409, { state: await buildState(fresh) });

    // Best effort: remove abandoned uploads (earlier attempts) from the folder.
    try {
      const all = await db().storage.from(ASSESSMENT_BUCKET).list(folder, { limit: 100 });
      const stale = (all.data ?? []).map((item) => `${folder}/${item.name}`).filter((p) => p !== path);
      if (stale.length) await db().storage.from(ASSESSMENT_BUCKET).remove(stale);
    } catch (error) {
      console.warn('[assessment] cleanup of stale uploads failed:', error);
    }

    return json({ state: await buildState(fresh) });
  },
  { mutating: true },
);
