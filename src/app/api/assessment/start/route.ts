import {
  buildState,
  clientIp,
  db,
  fail,
  getActiveTask,
  getCandidate,
  handler,
  json,
  sessionCandidate,
} from '@/lib/assessment/server';

export const runtime = 'nodejs';

export const POST = handler(
  async (request) => {
    const candidate = await sessionCandidate(request);
    if (!candidate) return fail('unauthorized', 401);

    // Idempotent: starting twice (double click, two tabs) never resets the timer.
    if (candidate.started_at) return json({ state: await buildState(candidate) });

    const task = await getActiveTask();
    if (!task) return fail('no_task', 409);

    const now = new Date();
    const deadline = new Date(now.getTime() + task.duration_minutes * 60 * 1000);

    const updated = await db()
      .from('assessment_candidates')
      .update({
        task_id: task.id,
        started_at: now.toISOString(),
        deadline_at: deadline.toISOString(),
        start_ip: clientIp(request),
        user_agent: (request.headers.get('user-agent') || '').slice(0, 400),
      })
      .eq('id', candidate.id)
      .is('started_at', null)
      .select('id');
    if (updated.error) throw updated.error;

    const fresh = await getCandidate(candidate.id);
    return json({ state: await buildState(fresh) });
  },
  { mutating: true },
);
