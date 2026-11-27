import { listAdminCandidates, readAdminSession, stripPath } from '@/lib/assessment/admin';
import { fail, handler, json } from '@/lib/assessment/server';

export const runtime = 'nodejs';

export const GET = handler(
  async (request) => {
    if (!readAdminSession(request)) return fail('unauthorized', 401);
    const candidates = await listAdminCandidates();
    return json({ candidates: candidates.map(stripPath) });
  },
  { mutating: false },
);
