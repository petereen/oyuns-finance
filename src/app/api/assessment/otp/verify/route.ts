import {
  OTP_MAX_ATTEMPTS,
  buildState,
  db,
  fail,
  getCandidateByEmail,
  handler,
  hashOtp,
  inviteOnly,
  json,
  normalizeEmail,
  readJson,
  safeEqualHex,
  setSessionCookie,
  type CandidateRow,
} from '@/lib/assessment/server';
import { OTP_LENGTH } from '@/lib/assessment/config';

export const runtime = 'nodejs';

const CODE_RE = new RegExp(`^\\d{${OTP_LENGTH}}$`);

export const POST = handler(
  async (request) => {
    const body = await readJson<{ email: string; code: string }>(request);
    const email = normalizeEmail(body?.email);
    const code = typeof body?.code === 'string' ? body.code.replace(/\s/g, '') : '';
    if (!email) return fail('invalid_email', 400);
    if (!CODE_RE.test(code)) return fail('invalid_code', 400);

    const latest = await db()
      .from('assessment_otps')
      .select('id,code_hash,attempts,expires_at')
      .eq('email', email)
      .is('consumed_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (latest.error) throw latest.error;

    const otp = latest.data as { id: number; code_hash: string; attempts: number; expires_at: string } | null;
    if (!otp || new Date(otp.expires_at).getTime() < Date.now()) return fail('code_expired', 400);
    if (otp.attempts >= OTP_MAX_ATTEMPTS) return fail('too_many_attempts', 429);

    // Claim one attempt atomically (optimistic lock on the attempts counter) so
    // parallel guesses cannot exceed the limit.
    const bumped = await db()
      .from('assessment_otps')
      .update({ attempts: otp.attempts + 1 })
      .eq('id', otp.id)
      .eq('attempts', otp.attempts)
      .is('consumed_at', null)
      .select('id');
    if (bumped.error) throw bumped.error;
    if (!bumped.data?.length) return fail('try_again', 409);

    if (!safeEqualHex(hashOtp(email, code), otp.code_hash)) {
      const attemptsLeft = Math.max(0, OTP_MAX_ATTEMPTS - otp.attempts - 1);
      return fail(attemptsLeft === 0 ? 'too_many_attempts' : 'invalid_code', 400, { attemptsLeft });
    }

    const consumed = await db()
      .from('assessment_otps')
      .update({ consumed_at: new Date().toISOString() })
      .eq('id', otp.id)
      .is('consumed_at', null)
      .select('id');
    if (consumed.error) throw consumed.error;
    if (!consumed.data?.length) return fail('code_expired', 400);

    let candidate: CandidateRow | null = await getCandidateByEmail(email);
    if (!candidate) {
      if (inviteOnly()) return fail('not_invited', 403);
      const created = await db().from('assessment_candidates').insert({ email }).select('id');
      // 23505 = unique_violation: a parallel request created it first; fine.
      if (created.error && created.error.code !== '23505') throw created.error;
      candidate = await getCandidateByEmail(email);
      if (!candidate) throw new Error('candidate row missing after insert');
    } else if (inviteOnly() && !candidate.invited) {
      return fail('not_invited', 403);
    }

    await db()
      .from('assessment_candidates')
      .update({
        last_login_at: new Date().toISOString(),
        user_agent: (request.headers.get('user-agent') || '').slice(0, 400),
      })
      .eq('id', candidate.id);

    const response = json({ ok: true, state: await buildState(candidate) });
    setSessionCookie(response, candidate.id, candidate.email);
    return response;
  },
  { mutating: true },
);
