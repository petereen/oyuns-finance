import {
  OTP_MAX_PER_EMAIL_PER_HOUR,
  OTP_MAX_PER_IP_PER_HOUR,
  OTP_RESEND_COOLDOWN_MS,
  OTP_TTL_MS,
  clientIp,
  db,
  fail,
  generateOtp,
  getCandidateByEmail,
  handler,
  hashOtp,
  inviteOnly,
  json,
  normalizeEmail,
  readJson,
  sendOtpEmail,
} from '@/lib/assessment/server';

export const runtime = 'nodejs';

export const POST = handler(
  async (request) => {
    const body = await readJson<{ email: string }>(request);
    const email = normalizeEmail(body?.email);
    if (!email) return fail('invalid_email', 400);

    if (inviteOnly()) {
      const candidate = await getCandidateByEmail(email);
      if (!candidate?.invited) return fail('not_invited', 403);
    }

    const ip = clientIp(request);
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const [byEmail, byIp] = await Promise.all([
      db()
        .from('assessment_otps')
        .select('created_at')
        .eq('email', email)
        .gte('created_at', hourAgo)
        .order('created_at', { ascending: false }),
      db().from('assessment_otps').select('id', { count: 'exact', head: true }).eq('ip', ip).gte('created_at', hourAgo),
    ]);
    if (byEmail.error) throw byEmail.error;
    if (byIp.error) throw byIp.error;

    const recent = byEmail.data ?? [];
    if (recent.length > 0) {
      const elapsed = Date.now() - new Date(recent[0].created_at).getTime();
      if (elapsed < OTP_RESEND_COOLDOWN_MS) {
        return fail('cooldown', 429, { retryAfter: Math.ceil((OTP_RESEND_COOLDOWN_MS - elapsed) / 1000) });
      }
    }
    if (recent.length >= OTP_MAX_PER_EMAIL_PER_HOUR || (byIp.count ?? 0) >= OTP_MAX_PER_IP_PER_HOUR) {
      return fail('too_many_requests', 429);
    }

    // Only the newest code is ever valid.
    const nowIso = new Date().toISOString();
    const invalidate = await db()
      .from('assessment_otps')
      .update({ consumed_at: nowIso })
      .eq('email', email)
      .is('consumed_at', null);
    if (invalidate.error) throw invalidate.error;

    const code = generateOtp();
    const inserted = await db()
      .from('assessment_otps')
      .insert({
        email,
        code_hash: hashOtp(email, code),
        ip,
        expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(),
      })
      .select('id')
      .single();
    if (inserted.error) throw inserted.error;

    try {
      await sendOtpEmail(email, code);
    } catch (error) {
      console.error('[assessment] failed to send OTP email:', error);
      // Keep the row (it still counts towards rate limits) but make it unusable.
      await db().from('assessment_otps').update({ consumed_at: new Date().toISOString() }).eq('id', inserted.data.id);
      return fail('email_failed', 502);
    }

    return json({ ok: true, cooldownSeconds: Math.round(OTP_RESEND_COOLDOWN_MS / 1000) });
  },
  { mutating: true },
);
