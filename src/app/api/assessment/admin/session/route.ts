import { readAdminSession } from '@/lib/assessment/admin';
import { handler, json } from '@/lib/assessment/server';

export const runtime = 'nodejs';

export const GET = handler(
  async (request) => {
    const session = readAdminSession(request);
    return json(session ? { authenticated: true, email: session.email } : { authenticated: false });
  },
  { mutating: false },
);
