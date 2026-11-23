import { buildState, clearSessionCookie, handler, json, sessionCandidate } from '@/lib/assessment/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = handler(
  async (request) => {
    const candidate = await sessionCandidate(request);
    const response = json({ state: await buildState(candidate) });
    // Drop any stale/invalid cookie (e.g. row deleted by an admin to allow a retake).
    if (!candidate) clearSessionCookie(response);
    return response;
  },
  { mutating: false },
);
