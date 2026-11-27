import { clearAdminCookie } from '@/lib/assessment/admin';
import { handler, json } from '@/lib/assessment/server';

export const runtime = 'nodejs';

export const POST = handler(
  async () => {
    const response = json({ ok: true });
    clearAdminCookie(response);
    return response;
  },
  { mutating: true },
);
