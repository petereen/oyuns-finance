// Server-only helpers for the candidate assessment. Never import this from a
// client component: it reads secrets (service role key, session secret).

import { createHmac, randomInt, timingSafeEqual } from 'crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import {
  MAX_PORTFOLIO_LINK_LENGTH,
  MAX_PORTFOLIO_LINKS,
  MAX_PORTFOLIO_TEXT_LENGTH,
  OTP_LENGTH,
  type AssessmentState,
} from './config';

// ---------------------------------------------------------------------------
// Tunables
// ---------------------------------------------------------------------------
export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
export const OTP_MAX_PER_EMAIL_PER_HOUR = 5;
export const OTP_MAX_PER_IP_PER_HOUR = 20;
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
export const MAX_UPLOAD_URLS_PER_CANDIDATE = 20;
// Extra time after the deadline in which an upload that was already in flight
// may still be finalised. New uploads cannot be started after the deadline.
export const SUBMIT_GRACE_MS = 5 * 60 * 1000;

const SESSION_COOKIE = 'oyuns_assessment';

// ---------------------------------------------------------------------------
// Env
// ---------------------------------------------------------------------------
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new ConfigError(`${name} is not configured`);
  return value;
}

export class ConfigError extends Error {}

function sessionSecret(): string {
  const secret = requireEnv('ASSESSMENT_SESSION_SECRET');
  if (secret.length < 32) throw new ConfigError('ASSESSMENT_SESSION_SECRET must be at least 32 characters');
  return secret;
}

export function inviteOnly(): boolean {
  return process.env.ASSESSMENT_INVITE_ONLY === 'true';
}

let adminClient: SupabaseClient | null = null;
export function db(): SupabaseClient {
  if (!adminClient) {
    adminClient = createClient(requireEnv('NEXT_PUBLIC_SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------
export function json(body: unknown, status = 200, init?: { headers?: Record<string, string> }) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', ...(init?.headers ?? {}) },
  });
}

export function fail(code: string, status: number, extra?: Record<string, unknown>) {
  return json({ error: code, ...(extra ?? {}) }, status);
}

export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim().slice(0, 64);
  return (request.headers.get('x-real-ip') || 'unknown').slice(0, 64);
}

function requestHost(request: NextRequest): string | null {
  return request.headers.get('x-forwarded-host') || request.headers.get('host');
}

/** Rejects cross-site POSTs (defence in depth on top of SameSite=Strict). */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return request.headers.get('sec-fetch-site') !== 'cross-site';
  try {
    return new URL(origin).host === requestHost(request);
  } catch {
    return false;
  }
}

export async function readJson<T>(request: NextRequest): Promise<Partial<T> | null> {
  try {
    const body = await request.json();
    return body && typeof body === 'object' ? (body as Partial<T>) : null;
  } catch {
    return null;
  }
}

/** Wraps a route handler with origin check + uniform error handling. */
export function handler(fn: (request: NextRequest) => Promise<NextResponse>, opts: { mutating: boolean }) {
  return async (request: NextRequest) => {
    if (opts.mutating && !isSameOrigin(request)) return fail('forbidden', 403);
    try {
      return await fn(request);
    } catch (error) {
      if (error instanceof ConfigError) {
        console.error('[assessment] config error:', error.message);
        return fail('not_configured', 503);
      }
      console.error('[assessment] unexpected error:', error);
      return fail('server_error', 500);
    }
  };
}

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const email = raw.trim().toLowerCase();
  if (email.length < 3 || email.length > 254 || !EMAIL_RE.test(email)) return null;
  return email;
}

export async function sendOtpEmail(to: string, code: string) {
  const apiKey = requireEnv('RESEND_API_KEY');
  const from = process.env.ASSESSMENT_EMAIL_FROM || 'OYUNS ALL-IN-ONE <info@oyuns.mn>';
  const minutes = Math.round(OTP_TTL_MS / 60000);

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#eef5ff;font-family:Arial,Helvetica,sans-serif;color:#231f20">
<table role="presentation" width="100%" style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px">
<tr><td>
<p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#2d62ec;letter-spacing:.04em">OYUNS ALL-IN-ONE</p>
<h1 style="margin:0 0 16px;font-size:20px">Даалгаврын нэвтрэх код</h1>
<p style="margin:0 0 24px;font-size:15px;line-height:1.5">Таны нэг удаагийн нэвтрэх код:</p>
<p style="margin:0 0 24px;font-size:34px;font-weight:bold;letter-spacing:8px;color:#1b40a8">${code}</p>
<p style="margin:0;font-size:13px;line-height:1.5;color:#52627a">Код ${minutes} минутын дараа хүчингүй болно.</p>
</td></tr></table></body></html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Нэвтрэх код: ${code}`,
      html,
      text: `Таны нэвтрэх код: ${code}\nКод ${minutes} минутын дараа хүчингүй болно.`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend error ${res.status}: ${detail.slice(0, 300)}`);
  }
}

// ---------------------------------------------------------------------------
// OTP
// ---------------------------------------------------------------------------
export function generateOtp(): string {
  return randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, '0');
}

export function hashOtp(email: string, code: string): string {
  return createHmac('sha256', sessionSecret()).update(`otp:${email}:${code}`).digest('hex');
}

export function safeEqualHex(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'hex');
  const bb = Buffer.from(b, 'hex');
  return ab.length === bb.length && ab.length > 0 && timingSafeEqual(ab, bb);
}

// ---------------------------------------------------------------------------
// Session cookie: base64url(payload).hmac — httpOnly, SameSite=Strict
// ---------------------------------------------------------------------------
type SessionPayload = { cid: string; email: string; exp: number };

function sign(data: string): string {
  return createHmac('sha256', sessionSecret()).update(`session:${data}`).digest('base64url');
}

export function setSessionCookie(response: NextResponse, candidateId: string, email: string) {
  const payload: SessionPayload = { cid: candidateId, email, exp: Date.now() + SESSION_TTL_MS };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  response.cookies.set(SESSION_COOKIE, `${data}.${sign(data)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 0 });
}

export function readSession(request: NextRequest): SessionPayload | null {
  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const [data, sig] = raw.split('.');
  if (!data || !sig) return null;
  const expected = sign(data);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as SessionPayload;
    if (typeof payload.cid !== 'string' || typeof payload.email !== 'string' || typeof payload.exp !== 'number') return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Candidate + state
// ---------------------------------------------------------------------------
export type CandidateRow = {
  id: string;
  email: string;
  invited: boolean;
  task_id: string | null;
  started_at: string | null;
  deadline_at: string | null;
  submitted_at: string | null;
  submission_path: string | null;
  submission_filename: string | null;
  submission_size: number | null;
  portfolio_links: string[];
  portfolio_text: string | null;
  portfolio_submitted_at: string | null;
  upload_url_count: number;
};

export type TaskRow = {
  id: string;
  title: string;
  body: string;
  duration_minutes: number;
};

const CANDIDATE_COLUMNS =
  'id,email,invited,task_id,started_at,deadline_at,submitted_at,submission_path,submission_filename,submission_size,portfolio_links,portfolio_text,portfolio_submitted_at,upload_url_count';

export async function getCandidate(id: string): Promise<CandidateRow | null> {
  const { data, error } = await db().from('assessment_candidates').select(CANDIDATE_COLUMNS).eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as CandidateRow | null) ?? null;
}

export async function getCandidateByEmail(email: string): Promise<CandidateRow | null> {
  const { data, error } = await db().from('assessment_candidates').select(CANDIDATE_COLUMNS).eq('email', email).maybeSingle();
  if (error) throw error;
  return (data as CandidateRow | null) ?? null;
}

/** Loads the session's candidate; null if not logged in or row was deleted. */
export async function sessionCandidate(request: NextRequest): Promise<CandidateRow | null> {
  const session = readSession(request);
  if (!session) return null;
  const candidate = await getCandidate(session.cid);
  if (!candidate || candidate.email !== session.email) return null;
  return candidate;
}

export async function getActiveTask(): Promise<TaskRow | null> {
  const { data, error } = await db()
    .from('assessment_tasks')
    .select('id,title,body,duration_minutes')
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  return (data as TaskRow | null) ?? null;
}

export async function getTask(id: string): Promise<TaskRow | null> {
  const { data, error } = await db().from('assessment_tasks').select('id,title,body,duration_minutes').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as TaskRow | null) ?? null;
}

export function isPastDeadline(candidate: CandidateRow, graceMs = 0): boolean {
  return !!candidate.deadline_at && Date.now() > new Date(candidate.deadline_at).getTime() + graceMs;
}

export async function buildState(candidate: CandidateRow | null): Promise<AssessmentState> {
  if (!candidate) {
    const task = await getActiveTask();
    return { status: 'anonymous', durationMinutes: task?.duration_minutes ?? 120 };
  }

  if (candidate.submitted_at) {
    return {
      status: 'submitted',
      email: candidate.email,
      submittedAt: candidate.submitted_at,
      fileName: candidate.submission_filename,
      portfolio: {
        links: candidate.portfolio_links ?? [],
        text: candidate.portfolio_text,
        submittedAt: candidate.portfolio_submitted_at,
      },
    };
  }

  if (!candidate.started_at || !candidate.deadline_at || !candidate.task_id) {
    const task = await getActiveTask();
    return {
      status: 'not_started',
      email: candidate.email,
      durationMinutes: task?.duration_minutes ?? 120,
      taskTitle: task?.title ?? null,
      taskAvailable: !!task,
    };
  }

  if (isPastDeadline(candidate)) {
    return { status: 'expired', email: candidate.email, deadlineAt: candidate.deadline_at };
  }

  const task = await getTask(candidate.task_id);
  return {
    status: 'in_progress',
    email: candidate.email,
    serverNow: new Date().toISOString(),
    startedAt: candidate.started_at,
    deadlineAt: candidate.deadline_at,
    task: { title: task?.title ?? '', body: task?.body ?? '' },
  };
}

// ---------------------------------------------------------------------------
// Portfolio validation
// ---------------------------------------------------------------------------
export function parsePortfolio(
  rawLinks: unknown,
  rawText: unknown,
): { ok: true; links: string[]; text: string | null } | { ok: false; error: string } {
  const links: string[] = [];
  if (rawLinks !== undefined && rawLinks !== null) {
    if (!Array.isArray(rawLinks)) return { ok: false, error: 'invalid_links' };
    for (const item of rawLinks) {
      if (typeof item !== 'string') return { ok: false, error: 'invalid_links' };
      const value = item.trim();
      if (!value) continue;
      if (value.length > MAX_PORTFOLIO_LINK_LENGTH) return { ok: false, error: 'invalid_links' };
      let url: URL;
      try {
        url = new URL(value);
      } catch {
        return { ok: false, error: 'invalid_links' };
      }
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return { ok: false, error: 'invalid_links' };
      const normalized = url.toString();
      if (!links.includes(normalized)) links.push(normalized);
    }
  }
  if (links.length > MAX_PORTFOLIO_LINKS) return { ok: false, error: 'too_many_links' };

  let text: string | null = null;
  if (rawText !== undefined && rawText !== null) {
    if (typeof rawText !== 'string') return { ok: false, error: 'invalid_text' };
    // Strip control chars except newline/tab.
    const cleaned = rawText.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
    if (cleaned.length > MAX_PORTFOLIO_TEXT_LENGTH) return { ok: false, error: 'text_too_long' };
    text = cleaned || null;
  }

  return { ok: true, links, text };
}

export function sanitizeFilename(raw: unknown): string {
  const name = typeof raw === 'string' ? raw : '';
  const cleaned = name
    .replace(/[\u0000-\u001F\u007F/\\]/g, '')
    .trim()
    .slice(-150);
  return cleaned || 'submission.zip';
}
