# Candidate Assessment (careers subdomain)

Candidate flow on `https://careers.oyuns.mn`:

1. **Welcome screen**: rules (120-minute open-question task, one attempt per email, how to submit).
2. **Email OTP**: a 6-digit code sent via Resend from `info@oyuns.mn`.
3. **Start screen**: the candidate confirms the rules, clicks **Start**, and the server records `started_at` / `deadline_at`.
4. **Task screen**: a countdown timer (server time), the task text, a `.zip` upload (≤ 50 MB) and an optional portfolio (links + free text).
5. **Complete screen**: shows the submission time and file name. If no portfolio was sent with the task, a **Портфолио илгээх** button opens the form (one time only).

If the candidate logs in again later, they land on the right screen: the timer keeps running, or they see the complete page or the time-expired page.

## 1. Database + storage

Run [`supabase/migrations/20261123000000_candidate_assessment.sql`](../supabase/migrations/20261123000000_candidate_assessment.sql) in the Supabase SQL editor. It creates:

| Object | Purpose |
| --- | --- |
| `assessment_tasks` | Task text and duration. Exactly **one** row may have `is_active = true`. |
| `assessment_candidates` | One row per email (unique). Holds start, deadline, submission and portfolio data. |
| `assessment_otps` | Hashed login codes used for rate limiting. |
| `assessment_results` (view) | A readable overview for HR. |
| bucket `assessment-submissions` | Private storage, zip only, 50 MB limit. |

After running it, edit the example task:

```sql
update assessment_tasks
set title = '...', body = '...', duration_minutes = 120
where slug = 'open-task-v1';
```

**To swap tasks:** set the old task's `is_active = false`, then insert the new task with `is_active = true`. Candidates who already started keep the task they were given.

**To let a candidate retake:** `delete from assessment_candidates where email = '...';`. Updates to started or submitted rows are blocked by a trigger.

**To download submissions:** use the admin dashboard (below). You can also go to Storage → `assessment-submissions` → `<candidate id>/…zip`.

### Admin dashboard (`/admin`)

Open `https://careers.oyuns.mn/admin` (locally: `http://careers.localhost:3000/admin`) and log in with `ASSESSMENT_ADMIN_EMAIL` / `ASSESSMENT_ADMIN_PASSWORD`. There is no OTP.

- The table lists every candidate with their status (submitted / in progress / expired / not started), timings, file and portfolio. You can search and filter by status.
- **Дэлгэрэнгүй** opens the full candidate info and portfolio (links + text).
- Each row can download the project `.zip` directly, or a bundle with the project plus `portfolio.md`.
- **Bulk download:** select rows (or use "download all submitted") to get one zip containing `summary.csv` and a folder per candidate with their project zip and `portfolio.md`. Each export holds at most 60 candidates; the UI splits larger sets into several downloads.
- Security: an HMAC-signed `httpOnly`, `SameSite=Strict` cookie that lasts 8 h, separate from the candidate cookie. POSTs are checked for same origin. Failed logins are throttled to 8 per 15 min per IP and 50 per 15 min overall (in memory, per server process).

## 2. Environment variables (Dokploy → Environment)

| Variable | Value |
| --- | --- |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` (server only, never `NEXT_PUBLIC_`). |
| `RESEND_API_KEY` | A Resend API key with sending access for the `oyuns.mn` domain. |
| `ASSESSMENT_SESSION_SECRET` | A random string of at least 32 characters, e.g. `openssl rand -base64 48`. |
| `ASSESSMENT_HOST` | `careers.oyuns.mn` (comma-separate if you need more than one host). |
| `ASSESSMENT_INVITE_ONLY` | `false` = anyone with an email can take it. `true` = only pre-registered emails (see below). |
| `ASSESSMENT_EMAIL_FROM` | Optional. Defaults to `OYUNS ALL-IN-ONE <info@oyuns.mn>`. |
| `ASSESSMENT_ADMIN_EMAIL` | Login email for the admin dashboard at `https://careers.oyuns.mn/admin`. |
| `ASSESSMENT_ADMIN_PASSWORD` | Admin password, at least 12 characters (e.g. `openssl rand -base64 18`). Changing it logs out existing admin sessions. |

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are already configured for the main site.

### Invite-only mode (recommended for real hiring rounds)

```sql
insert into assessment_candidates (email, full_name, invited)
values ('candidate@example.com', 'Name', true);
```

When `ASSESSMENT_INVITE_ONLY=true`, any email not in this list gets "not registered" and no code is sent.

## 3. DNS + routing

1. Add DNS record `careers.oyuns.mn` → the same server (A/CNAME) as the website.
2. In Dokploy, add the domain `careers.oyuns.mn` to the **website** service (port 3000, HTTPS).
3. The middleware detects the host and serves the assessment app at `/`. Every other path redirects to `/`. Non-assessment APIs return 404, and all responses are `noindex`.

For local development, run `npm run dev` and open `http://careers.localhost:3000`.

## Abuse protections

- **OTP**: 6 digits from a crypto RNG, valid for 10 minutes, at most 5 guesses (counted atomically). Only the newest code works. One email per 60 s, at most 5 per hour per email and 20 per hour per IP. Only a hash is stored in the DB.
- **Session**: HMAC-signed, `httpOnly`, `Secure`, `SameSite=Strict` cookie (12 h). Every POST also checks `Origin`.
- **No duplicates**: email is `UNIQUE`. Start, submit and portfolio use conditional updates (`… where submitted_at is null`), and a DB trigger makes those fields write-once.
- **Timer is server-side**: the deadline is stored in the DB, so refreshing, closing the tab or changing the device clock doesn't help. New uploads are refused after the deadline. There is a 5-minute grace window only to finalise an upload that was already in progress.
- **Uploads**: the path is generated by the server inside the candidate's folder, using a short-lived signed upload URL. The bucket rejects non-zip files and anything over 50 MB. On submit, the server checks the object exists, its size and its ZIP signature (`PK\x03\x04`). At most 20 upload attempts per candidate, and abandoned uploads are cleaned up.
- **Locked tables**: all tables have RLS on with no policies, and the anon key has no access. Only the server (service role) reads and writes them.
