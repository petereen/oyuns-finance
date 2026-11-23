import {
  buildState,
  db,
  fail,
  getCandidate,
  handler,
  json,
  parsePortfolio,
  readJson,
  sessionCandidate,
} from '@/lib/assessment/server';

export const runtime = 'nodejs';

export const POST = handler(
  async (request) => {
    const candidate = await sessionCandidate(request);
    if (!candidate) return fail('unauthorized', 401);
    if (!candidate.submitted_at) return fail('not_submitted', 409);
    if (candidate.portfolio_submitted_at) {
      return fail('portfolio_already_submitted', 409, { state: await buildState(candidate) });
    }

    const body = await readJson<{ links: string[]; text: string }>(request);
    const portfolio = parsePortfolio(body?.links, body?.text);
    if (!portfolio.ok) return fail(portfolio.error, 400);
    if (portfolio.links.length === 0 && !portfolio.text) return fail('empty_portfolio', 400);

    // Atomic: portfolio can be sent exactly once.
    const updated = await db()
      .from('assessment_candidates')
      .update({
        portfolio_links: portfolio.links,
        portfolio_text: portfolio.text,
        portfolio_submitted_at: new Date().toISOString(),
      })
      .eq('id', candidate.id)
      .is('portfolio_submitted_at', null)
      .select('id');
    if (updated.error) throw updated.error;

    const fresh = await getCandidate(candidate.id);
    if (!updated.data?.length) return fail('portfolio_already_submitted', 409, { state: await buildState(fresh) });
    return json({ state: await buildState(fresh) });
  },
  { mutating: true },
);
