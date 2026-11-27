// Server-only helpers for the assessment admin dashboard. Never import this
// from a client component: it reads the admin credentials from env.
//
// Auth model: a single admin account configured via env
// (ASSESSMENT_ADMIN_EMAIL / ASSESSMENT_ADMIN_PASSWORD), no OTP. A successful
// login sets an HMAC-signed, httpOnly, SameSite=Strict cookie that is separate
// from the candidate session cookie.

import { createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest, NextResponse } from 'next/server';
import type { AdminCandidate, CandidateStatus } from './config';
import { ConfigError, db } from './server';

export const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const ADMIN_COOKIE = 'oyuns_assessment_admin';

// Failed-login throttling (in memory, per server process).
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAILS_PER_IP = 8;
const LOGIN_MAX_FAILS_GLOBAL = 50;

// ---------------------------------------------------------------------------
// Env
// ---------------------------------------------------------------------------
function secret(): string {
  const value = process.env.ASSESSMENT_SESSION_SECRET;
  if (!value || value.length < 32) throw new ConfigError('ASSESSMENT_SESSION_SECRET must be at least 32 characters');
  return value;
}

function adminCredentials(): { email: string; password: string } {
  const email = process.env.ASSESSMENT_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ASSESSMENT_ADMIN_PASSWORD;
  if (!email || !password) throw new ConfigError('ASSESSMENT_ADMIN_EMAIL / ASSESSMENT_ADMIN_PASSWORD are not configured');
  if (password.length < 12) throw new ConfigError('ASSESSMENT_ADMIN_PASSWORD must be at least 12 characters');
  return { email, password };
}

function mac(label: string, value: string): Buffer {
  return createHmac('sha256', secret()).update(`${label}:${value}`).digest();
}

/** Constant-time string comparison (both sides hashed to equal length first). */
function safeEqual(a: string, b: string, label: string): boolean {
  return timingSafeEqual(mac(label, a), mac(label, b));
}

/** Changing the admin email or password in env invalidates existing sessions. */
function credentialVersion(): string {
  const { email, password } = adminCredentials();
  return mac('admin-cred', `${email}\n${password}`).toString('base64url').slice(0, 22);
}

export function checkAdminCredentials(rawEmail: unknown, rawPassword: unknown): string | null {
  const { email, password } = adminCredentials();
  const givenEmail = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
  const givenPassword = typeof rawPassword === 'string' ? rawPassword : '';
  // Evaluate both comparisons so timing doesn't reveal which one failed.
  const emailOk = safeEqual(givenEmail, email, 'admin-email');
  const passwordOk = safeEqual(givenPassword, password, 'admin-password');
  return emailOk && passwordOk ? email : null;
}

// ---------------------------------------------------------------------------
// Login throttling
// ---------------------------------------------------------------------------
const failsByIp = new Map<string, number[]>();
let globalFails: number[] = [];

function prune(list: number[], now: number) {
  return list.filter((t) => now - t < LOGIN_WINDOW_MS);
}

/** Returns seconds to wait if this IP (or everyone) is locked out, else 0. */
export function loginRetryAfter(ip: string): number {
  const now = Date.now();
  globalFails = prune(globalFails, now);
  const ipFails = prune(failsByIp.get(ip) ?? [], now);
  if (ipFails.length) failsByIp.set(ip, ipFails);
  else failsByIp.delete(ip);

  const blockers: number[] = [];
  if (ipFails.length >= LOGIN_MAX_FAILS_PER_IP) blockers.push(ipFails[ipFails.length - LOGIN_MAX_FAILS_PER_IP]);
  if (globalFails.length >= LOGIN_MAX_FAILS_GLOBAL) blockers.push(globalFails[globalFails.length - LOGIN_MAX_FAILS_GLOBAL]);
  if (!blockers.length) return 0;
  return Math.max(1, Math.ceil((Math.max(...blockers) + LOGIN_WINDOW_MS - now) / 1000));
}

export function recordLoginFailure(ip: string) {
  const now = Date.now();
  failsByIp.set(ip, [...prune(failsByIp.get(ip) ?? [], now), now]);
  globalFails = [...prune(globalFails, now), now];
  // Keep the map bounded.
  if (failsByIp.size > 5000) {
    for (const key of failsByIp.keys()) {
      failsByIp.delete(key);
      if (failsByIp.size <= 4000) break;
    }
  }
}

export function clearLoginFailures(ip: string) {
  failsByIp.delete(ip);
}

// ---------------------------------------------------------------------------
// Session cookie
// ---------------------------------------------------------------------------
type AdminSession = { role: 'admin'; email: string; cv: string; exp: number };

function sign(data: string): string {
  return mac('admin-session', data).toString('base64url');
}

export function setAdminCookie(response: NextResponse, email: string) {
  const payload: AdminSession = { role: 'admin', email, cv: credentialVersion(), exp: Date.now() + ADMIN_SESSION_TTL_MS };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  response.cookies.set(ADMIN_COOKIE, `${data}.${sign(data)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: Math.floor(ADMIN_SESSION_TTL_MS / 1000),
  });
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 0 });
}

export function readAdminSession(request: NextRequest): { email: string } | null {
  const raw = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!raw) return null;
  const [data, sig] = raw.split('.');
  if (!data || !sig) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(data));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as AdminSession;
    if (payload.role !== 'admin' || typeof payload.email !== 'string' || typeof payload.exp !== 'number') return null;
    if (payload.exp < Date.now()) return null;
    if (payload.cv !== credentialVersion() || payload.email !== adminCredentials().email) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Candidates
// ---------------------------------------------------------------------------
type AdminCandidateRow = {
  id: string;
  email: string;
  full_name: string | null;
  invited: boolean;
  started_at: string | null;
  deadline_at: string | null;
  submitted_at: string | null;
  submission_path: string | null;
  submission_filename: string | null;
  submission_size: number | null;
  portfolio_links: string[] | null;
  portfolio_text: string | null;
  portfolio_submitted_at: string | null;
  start_ip: string | null;
  submit_ip: string | null;
  user_agent: string | null;
  last_login_at: string | null;
  created_at: string;
  task: { title: string } | { title: string }[] | null;
};

export type AdminCandidateWithPath = AdminCandidate & { submissionPath: string | null };

const ADMIN_COLUMNS =
  'id,email,full_name,invited,started_at,deadline_at,submitted_at,submission_path,submission_filename,submission_size,' +
  'portfolio_links,portfolio_text,portfolio_submitted_at,start_ip,submit_ip,user_agent,last_login_at,created_at,' +
  'task:assessment_tasks(title)';

function statusOf(row: AdminCandidateRow): CandidateStatus {
  if (row.submitted_at) return 'submitted';
  if (!row.started_at) return 'not_started';
  if (row.deadline_at && Date.now() > new Date(row.deadline_at).getTime()) return 'expired';
  return 'in_progress';
}

function toAdminCandidate(row: AdminCandidateRow): AdminCandidateWithPath {
  const task = Array.isArray(row.task) ? row.task[0] : row.task;
  const minutesUsed =
    row.submitted_at && row.started_at
      ? Math.round(((new Date(row.submitted_at).getTime() - new Date(row.started_at).getTime()) / 60000) * 10) / 10
      : null;
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    invited: row.invited,
    taskTitle: task?.title ?? null,
    status: statusOf(row),
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
    startedAt: row.started_at,
    deadlineAt: row.deadline_at,
    submittedAt: row.submitted_at,
    minutesUsed,
    submission: row.submission_path ? { fileName: row.submission_filename, size: row.submission_size } : null,
    portfolio: {
      links: row.portfolio_links ?? [],
      text: row.portfolio_text,
      submittedAt: row.portfolio_submitted_at,
    },
    startIp: row.start_ip,
    submitIp: row.submit_ip,
    userAgent: row.user_agent,
    submissionPath: row.submission_path,
  };
}

/** All candidates, newest first (paged past PostgREST's row limit). */
export async function listAdminCandidates(): Promise<AdminCandidateWithPath[]> {
  const pageSize = 1000;
  const out: AdminCandidateWithPath[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await db()
      .from('assessment_candidates')
      .select(ADMIN_COLUMNS)
      .order('created_at', { ascending: false })
      .order('id', { ascending: true })
      .range(from, from + pageSize - 1);
    if (error) throw error;
    const rows = (data ?? []) as unknown as AdminCandidateRow[];
    out.push(...rows.map(toAdminCandidate));
    if (rows.length < pageSize) return out;
  }
}

export async function getAdminCandidates(ids: string[]): Promise<AdminCandidateWithPath[]> {
  if (!ids.length) return [];
  const { data, error } = await db().from('assessment_candidates').select(ADMIN_COLUMNS).in('id', ids);
  if (error) throw error;
  const rows = ((data ?? []) as unknown as AdminCandidateRow[]).map(toAdminCandidate);
  const order = new Map(ids.map((id, i) => [id, i]));
  return rows.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}

export function stripPath({ submissionPath: _omit, ...rest }: AdminCandidateWithPath): AdminCandidate {
  void _omit;
  return rest;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value);
}
