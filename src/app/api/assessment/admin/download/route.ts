import { NextResponse } from 'next/server';
import { ASSESSMENT_BUCKET } from '@/lib/assessment/config';
import { getAdminCandidates, isUuid, readAdminSession } from '@/lib/assessment/admin';
import { db, fail, handler } from '@/lib/assessment/server';
import { projectFileName } from '@/lib/assessment/bundle';

export const runtime = 'nodejs';

/** Redirects to a short-lived signed URL for one candidate's project zip. */
export const GET = handler(
  async (request) => {
    if (!readAdminSession(request)) return fail('unauthorized', 401);
    const id = request.nextUrl.searchParams.get('id');
    if (!isUuid(id)) return fail('invalid_id', 400);

    const [candidate] = await getAdminCandidates([id]);
    if (!candidate?.submissionPath) return fail('not_found', 404);

    const signed = await db()
      .storage.from(ASSESSMENT_BUCKET)
      .createSignedUrl(candidate.submissionPath, 60, { download: projectFileName(candidate) });
    if (signed.error || !signed.data?.signedUrl) throw signed.error ?? new Error('could not sign download url');

    const response = NextResponse.redirect(signed.data.signedUrl, 302);
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Referrer-Policy', 'no-referrer');
    return response;
  },
  { mutating: false },
);
