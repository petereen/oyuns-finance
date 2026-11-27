import { MAX_EXPORT_CANDIDATES } from '@/lib/assessment/config';
import { getAdminCandidates, isUuid, readAdminSession } from '@/lib/assessment/admin';
import { MAX_EXPORT_BYTES, candidateFolder, exportStream } from '@/lib/assessment/bundle';
import { fail, handler } from '@/lib/assessment/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 900;

/** GET ?ids=a,b,c → zip with each candidate's project zip + portfolio.md. */
export const GET = handler(
  async (request) => {
    if (!readAdminSession(request)) return fail('unauthorized', 401);

    const raw = request.nextUrl.searchParams.get('ids') ?? '';
    const ids = [...new Set(raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean))];
    if (!ids.length || !ids.every(isUuid)) return fail('invalid_ids', 400);
    if (ids.length > MAX_EXPORT_CANDIDATES) return fail('too_many', 400, { max: MAX_EXPORT_CANDIDATES });

    const candidates = await getAdminCandidates(ids);
    if (!candidates.length) return fail('not_found', 404);
    const totalBytes = candidates.reduce((sum, c) => sum + (c.submission?.size ?? 0), 0);
    if (totalBytes > MAX_EXPORT_BYTES) return fail('export_too_large', 413);

    const stamp = new Date().toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '-');
    const filename =
      candidates.length === 1 ? `${candidateFolder(candidates[0])}.zip` : `assessment-export-${stamp}-${candidates.length}.zip`;

    return new NextResponse(exportStream(candidates), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  },
  { mutating: false },
);
