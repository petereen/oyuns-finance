import { randomUUID } from 'crypto';
import { ASSESSMENT_BUCKET, MAX_ZIP_BYTES } from '@/lib/assessment/config';
import {
  MAX_UPLOAD_URLS_PER_CANDIDATE,
  db,
  fail,
  handler,
  isPastDeadline,
  json,
  readJson,
  sessionCandidate,
} from '@/lib/assessment/server';

export const runtime = 'nodejs';

export const POST = handler(
  async (request) => {
    const candidate = await sessionCandidate(request);
    if (!candidate) return fail('unauthorized', 401);
    if (candidate.submitted_at) return fail('already_submitted', 409);
    if (!candidate.started_at) return fail('not_started', 409);
    if (isPastDeadline(candidate)) return fail('time_up', 409);

    const body = await readJson<{ size: number; filename: string }>(request);
    const size = Number(body?.size);
    const filename = typeof body?.filename === 'string' ? body.filename : '';
    if (!/\.zip$/i.test(filename)) return fail('invalid_zip', 400);
    if (!Number.isFinite(size) || size <= 0) return fail('invalid_zip', 400);
    if (size > MAX_ZIP_BYTES) return fail('file_too_large', 400);

    if (candidate.upload_url_count >= MAX_UPLOAD_URLS_PER_CANDIDATE) return fail('too_many_uploads', 429);
    const bumped = await db()
      .from('assessment_candidates')
      .update({ upload_url_count: candidate.upload_url_count + 1 })
      .eq('id', candidate.id)
      .eq('upload_url_count', candidate.upload_url_count)
      .select('id');
    if (bumped.error) throw bumped.error;
    if (!bumped.data?.length) return fail('try_again', 409);

    // Path is generated server-side and scoped to the candidate's own folder.
    const path = `${candidate.id}/${randomUUID()}.zip`;
    const signed = await db().storage.from(ASSESSMENT_BUCKET).createSignedUploadUrl(path);
    if (signed.error || !signed.data) throw signed.error ?? new Error('could not create signed upload url');

    return json({ path, signedUrl: signed.data.signedUrl });
  },
  { mutating: true },
);
