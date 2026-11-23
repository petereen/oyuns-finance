import { clearSessionCookie, handler, json } from '@/lib/assessment/server';

export const runtime = 'nodejs';

export const POST = handler(
  async () => {
    const response = json({ ok: true });
    clearSessionCookie(response);
    return response;
  },
  { mutating: true },
);
