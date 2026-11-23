-- ============================================================================
-- Candidate assessment (careers subdomain)
--
-- Run once in the Supabase SQL editor (or `supabase db push`).
-- All tables have RLS enabled with NO policies, so only the server
-- (service_role key) can read or write them. The browser never talks to these
-- tables directly.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Tasks: the open-question task text. Exactly one row may be active.
-- ---------------------------------------------------------------------------
create table if not exists public.assessment_tasks (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  body             text not null,                -- shown as plain text (line breaks kept)
  duration_minutes integer not null default 120 check (duration_minutes between 1 and 1440),
  is_active        boolean not null default false,
  created_at       timestamptz not null default now()
);

create unique index if not exists assessment_tasks_one_active
  on public.assessment_tasks (is_active) where is_active;

-- ---------------------------------------------------------------------------
-- Candidates: one row per email = one attempt per email (no duplicates).
-- ---------------------------------------------------------------------------
create table if not exists public.assessment_candidates (
  id                     uuid primary key default gen_random_uuid(),
  email                  text not null unique
                           check (email = lower(btrim(email)) and length(email) between 3 and 254),
  full_name              text,                    -- optional, for your own notes
  invited                boolean not null default false, -- used when ASSESSMENT_INVITE_ONLY=true
  task_id                uuid references public.assessment_tasks (id),

  started_at             timestamptz,
  deadline_at            timestamptz,
  submitted_at           timestamptz,

  submission_path        text,                    -- object path in storage bucket
  submission_filename    text,                    -- original file name (sanitised)
  submission_size        bigint,

  portfolio_links        text[] not null default '{}',
  portfolio_text         text,
  portfolio_submitted_at timestamptz,

  upload_url_count       integer not null default 0,
  start_ip               text,
  submit_ip              text,
  user_agent             text,
  last_login_at          timestamptz,
  created_at             timestamptz not null default now(),

  constraint assessment_deadline_needs_start  check (deadline_at  is null or started_at is not null),
  constraint assessment_submit_needs_start    check (submitted_at is null or started_at is not null),
  constraint assessment_submit_needs_file     check (submitted_at is null or submission_path is not null),
  constraint assessment_portfolio_text_len    check (portfolio_text is null or length(portfolio_text) <= 4000),
  constraint assessment_portfolio_links_count check (cardinality(portfolio_links) <= 10)
);

create index if not exists assessment_candidates_submitted_idx
  on public.assessment_candidates (submitted_at desc nulls last);

-- Write-once guard: once started / submitted / portfolio sent, those fields can
-- never be changed by an UPDATE (even by a buggy server). To let a candidate
-- retake, an admin deletes the row.
create or replace function public.assessment_candidates_guard()
returns trigger
language plpgsql
as $$
begin
  if old.started_at is not null and (
       new.started_at  is distinct from old.started_at or
       new.deadline_at is distinct from old.deadline_at or
       new.task_id     is distinct from old.task_id) then
    raise exception 'assessment already started' using errcode = 'P0001';
  end if;

  if old.submitted_at is not null and (
       new.submitted_at        is distinct from old.submitted_at or
       new.submission_path     is distinct from old.submission_path or
       new.submission_filename is distinct from old.submission_filename or
       new.submission_size     is distinct from old.submission_size) then
    raise exception 'assessment already submitted' using errcode = 'P0001';
  end if;

  if old.portfolio_submitted_at is not null and (
       new.portfolio_submitted_at is distinct from old.portfolio_submitted_at or
       new.portfolio_links        is distinct from old.portfolio_links or
       new.portfolio_text         is distinct from old.portfolio_text) then
    raise exception 'portfolio already submitted' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists assessment_candidates_guard on public.assessment_candidates;
create trigger assessment_candidates_guard
  before update on public.assessment_candidates
  for each row execute function public.assessment_candidates_guard();

-- ---------------------------------------------------------------------------
-- One-time login codes (only a hash is stored).
-- ---------------------------------------------------------------------------
create table if not exists public.assessment_otps (
  id          bigint generated always as identity primary key,
  email       text not null,
  code_hash   text not null,
  ip          text,
  attempts    integer not null default 0,
  expires_at  timestamptz not null,
  consumed_at timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists assessment_otps_email_idx on public.assessment_otps (email, created_at desc);
create index if not exists assessment_otps_ip_idx    on public.assessment_otps (ip, created_at desc);

-- ---------------------------------------------------------------------------
-- Lock everything down: server-only access via service_role.
-- ---------------------------------------------------------------------------
alter table public.assessment_tasks      enable row level security;
alter table public.assessment_candidates enable row level security;
alter table public.assessment_otps       enable row level security;

revoke all on public.assessment_tasks      from anon, authenticated;
revoke all on public.assessment_candidates from anon, authenticated;
revoke all on public.assessment_otps       from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Private storage bucket for ZIP submissions (50 MB max, zip only).
-- Uploads happen through short-lived signed upload URLs issued by the server,
-- so no storage policies for anon/authenticated are needed (or wanted).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'assessment-submissions',
  'assessment-submissions',
  false,
  52428800,
  array['application/zip', 'application/x-zip-compressed']
)
on conflict (id) do update
  set public             = false,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Handy admin view (query it in the dashboard; not exposed to the API roles).
-- ---------------------------------------------------------------------------
create or replace view public.assessment_results
with (security_invoker = true) as
select
  c.email,
  c.full_name,
  t.title as task,
  c.started_at,
  c.deadline_at,
  c.submitted_at,
  round(extract(epoch from (c.submitted_at - c.started_at)) / 60.0, 1) as minutes_used,
  case
    when c.submitted_at is not null then 'submitted'
    when c.started_at  is null      then 'not_started'
    when now() > c.deadline_at      then 'expired'
    else 'in_progress'
  end as status,
  c.submission_path,
  c.submission_filename,
  c.submission_size,
  c.portfolio_links,
  c.portfolio_text,
  c.portfolio_submitted_at,
  c.created_at
from public.assessment_candidates c
left join public.assessment_tasks t on t.id = c.task_id;

revoke all on public.assessment_results from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Example task — edit the text, then keep exactly one row active.
-- ---------------------------------------------------------------------------
insert into public.assessment_tasks (slug, title, body, duration_minutes, is_active)
values (
  'open-task-v1',
  'Нээлттэй даалгавар',
  E'Энд даалгаврын текстээ оруулна уу.\n\nШаардлага:\n1. ...\n2. ...\n\nҮр дүнгээ нэг .zip файл болгон илгээнэ үү.',
  120,
  true
)
on conflict (slug) do nothing;
