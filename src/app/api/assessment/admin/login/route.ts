import {
  checkAdminCredentials,
  clearLoginFailures,
  loginRetryAfter,
  recordLoginFailure,
  setAdminCookie,
} from '@/lib/assessment/admin';
import { clientIp, fail, handler, json, readJson } from '@/lib/assessment/server';

export const runtime = 'nodejs';

export const POST = handler(
  async (request) => {
    const ip = clientIp(request);
    const wait = loginRetryAfter(ip);
    if (wait) return fail('rate_limited', 429, { retryAfterSeconds: wait });

    const body = await readJson<{ email: string; password: string }>(request);
    const email = checkAdminCredentials(body?.email, body?.password);
    if (!email) {
      recordLoginFailure(ip);
      console.warn('[assessment-admin] failed login from', ip);
      return fail('invalid_credentials', 401);
    }

    clearLoginFailures(ip);
    const response = json({ ok: true, email });
    setAdminCookie(response, email);
    return response;
  },
  { mutating: true },
);
