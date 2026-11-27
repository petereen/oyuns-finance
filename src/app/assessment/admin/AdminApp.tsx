'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MAX_EXPORT_CANDIDATES,
  type AdminCandidate,
  type CandidateStatus,
} from '@/lib/assessment/config';

// ---------------------------------------------------------------------------
// Messages (Mongolian)
// ---------------------------------------------------------------------------
const ERRORS: Record<string, string> = {
  invalid_credentials: 'Имэйл эсвэл нууц үг буруу байна.',
  not_configured: 'Систем тохируулагдаагүй байна.',
  forbidden: 'Хүсэлт хориглогдлоо. Хуудсаа дахин ачаална уу.',
  unauthorized: 'Нэвтрэлтийн хугацаа дууссан. Дахин нэвтэрнэ үү.',
  network: 'Сүлжээний алдаа. Интернэт холболтоо шалгана уу.',
  server_error: 'Алдаа гарлаа. Дахин оролдоно уу.',
};

const errorText = (code: string) => ERRORS[code] ?? ERRORS.server_error;

const STATUS_LABEL: Record<CandidateStatus, string> = {
  submitted: 'Илгээсэн',
  in_progress: 'Хийж байна',
  expired: 'Хугацаа дууссан',
  not_started: 'Эхлээгүй',
};

const STATUS_STYLE: Record<CandidateStatus, string> = {
  submitted: 'bg-emerald-100 text-emerald-700',
  in_progress: 'bg-[#e7f0ff] text-[#2455D8]',
  expired: 'bg-orange-100 text-orange-700',
  not_started: 'bg-gray-100 text-gray-600',
};

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------
class ApiError extends Error {
  constructor(
    public code: string,
    public data: Record<string, unknown>,
  ) {
    super(code);
  }
}

async function api<T>(path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/assessment/admin/${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'same-origin',
      cache: 'no-store',
      signal: AbortSignal.timeout(60000),
    });
  } catch {
    throw new ApiError('network', {});
  }
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new ApiError(typeof data.error === 'string' ? data.error : 'server_error', data);
  return data as T;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const pad = (n: number) => String(n).padStart(2, '0');

function formatDate(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatBytes(bytes: number | null) {
  if (bytes === null || bytes === undefined) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const hasPortfolio = (c: AdminCandidate) => c.portfolio.links.length > 0 || !!c.portfolio.text?.trim();
const isSelectable = (c: AdminCandidate) => !!c.submission || hasPortfolio(c);

const downloadUrl = (id: string) => `/api/assessment/admin/download?id=${encodeURIComponent(id)}`;
const exportUrl = (ids: string[]) => `/api/assessment/admin/export?ids=${ids.map(encodeURIComponent).join(',')}`;

function triggerDownload(url: string) {
  const a = document.createElement('a');
  a.href = url;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Exports in chunks of MAX_EXPORT_CANDIDATES, started one after another.
function exportIds(ids: string[]) {
  for (let i = 0; i < ids.length; i += MAX_EXPORT_CANDIDATES) {
    const chunk = ids.slice(i, i + MAX_EXPORT_CANDIDATES);
    setTimeout(() => triggerDownload(exportUrl(chunk)), (i / MAX_EXPORT_CANDIDATES) * 2000);
  }
}

// ---------------------------------------------------------------------------
// Small UI pieces
// ---------------------------------------------------------------------------
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_24px_70px_rgba(45,98,236,0.12)] backdrop-blur sm:p-8 ${className}`}>
      {children}
    </div>
  );
}

function Button({
  children,
  variant = 'primary',
  loading,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'outline'; loading?: boolean }) {
  const styles = {
    primary: 'bg-[#2455D8] text-white hover:bg-[#1b40a8] shadow-lg shadow-blue-900/20 disabled:bg-[#9fb4ea] disabled:shadow-none',
    outline: 'border border-[#cbdcf7] bg-white text-[#1b40a8] hover:bg-[#eef5ff] disabled:opacity-50',
    ghost: 'text-[#52627a] hover:text-[#1b40a8] disabled:opacity-50',
  }[variant];
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${styles} ${className}`}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}

function ErrorBox({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </p>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-24">
      <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#2455D8] border-t-transparent" />
    </div>
  );
}

function StatusBadge({ status }: { status: CandidateStatus }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function DownloadIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------
export default function AdminApp() {
  const [auth, setAuth] = useState<{ email: string } | null | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sessionNote, setSessionNote] = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    try {
      const data = await api<{ authenticated: boolean; email?: string }>('session');
      setLoadError(null);
      setAuth(data.authenticated ? { email: data.email ?? '' } : null);
    } catch (error) {
      setLoadError(errorText(error instanceof ApiError ? error.code : 'server_error'));
    }
  }, []);

  useEffect(() => {
    // State is only set after the awaited fetch resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void checkSession();
  }, [checkSession]);

  const logout = async () => {
    await api('logout', {}).catch(() => {});
    setSessionNote(null);
    setAuth(null);
  };

  const sessionExpired = useCallback(() => {
    setSessionNote(errorText('unauthorized'));
    setAuth(null);
  }, []);

  return (
    <div className="min-h-screen px-4 pb-16 sm:px-6">
      <header className="mx-auto flex max-w-7xl items-center justify-between py-6">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-main.svg" alt="OYUNS ALL-IN-ONE" className="h-9 w-auto" />
          <span className="rounded-full bg-[#e7f0ff] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#2455D8]">Admin</span>
        </div>
        {auth && (
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden max-w-[260px] truncate text-[#52627a] sm:inline">{auth.email}</span>
            <Button variant="ghost" className="px-3 py-2" onClick={logout}>
              Гарах
            </Button>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl">
        {auth === undefined && !loadError && <Spinner />}
        {auth === undefined && loadError && (
          <Card className="mx-auto max-w-md space-y-4 text-center">
            <ErrorBox message={loadError} />
            <Button onClick={checkSession}>Дахин ачаалах</Button>
          </Card>
        )}
        {auth === null && (
          <LoginForm
            note={sessionNote}
            onLoggedIn={(email) => {
              setSessionNote(null);
              setAuth({ email });
            }}
          />
        )}
        {auth && <Dashboard onSessionExpired={sessionExpired} />}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
function LoginForm({ note, onLoggedIn }: { note: string | null; onLoggedIn: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const data = await api<{ ok: true; email: string }>('login', { email: email.trim(), password });
      onLoggedIn(data.email ?? email.trim());
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'rate_limited') {
          const secs = typeof err.data.retryAfterSeconds === 'number' ? err.data.retryAfterSeconds : 60;
          const mins = Math.max(1, Math.ceil(secs / 60));
          setError(`Хэт олон оролдлого хийлээ. ${mins} минутын дараа дахин оролдоно уу.`);
        } else setError(errorText(err.code));
      } else setError(errorText('server_error'));
      setBusy(false);
    }
  };

  return (
    <Card className="mx-auto max-w-md">
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <div>
          <h1 className="mb-2 text-xl font-bold text-[#1a1a1a]">Админ нэвтрэх</h1>
          <p className="text-sm text-[#52627a]">Имэйл болон нууц үгээ оруулна уу.</p>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#1a1a1a]">Имэйл хаяг</span>
          <input
            type="email"
            required
            autoFocus
            autoComplete="username"
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[#cbdcf7] bg-white px-4 py-3 text-[#1a1a1a] outline-none focus:border-[#2455D8] focus:ring-2 focus:ring-[#2455D8]/20"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#1a1a1a]">Нууц үг</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            maxLength={200}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[#cbdcf7] bg-white px-4 py-3 text-[#1a1a1a] outline-none focus:border-[#2455D8] focus:ring-2 focus:ring-[#2455D8]/20"
          />
        </label>
        <ErrorBox message={error ?? note} />
        <Button type="submit" className="w-full" loading={busy} disabled={!email.trim() || !password}>
          Нэвтрэх
        </Button>
      </form>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
function Dashboard({ onSessionExpired }: { onSessionExpired: () => void }) {
  const [candidates, setCandidates] = useState<AdminCandidate[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CandidateStatus>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailId, setDetailId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api<{ candidates: AdminCandidate[] }>('candidates');
      setError(null);
      setCandidates(data.candidates);
    } catch (err) {
      if (err instanceof ApiError && err.code === 'unauthorized') {
        onSessionExpired();
        return;
      }
      setError(errorText(err instanceof ApiError ? err.code : 'server_error'));
    }
  }, [onSessionExpired]);

  useEffect(() => {
    // State is only set after the awaited fetch resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const refresh = async () => {
    setLoading(true);
    await load();
    setLoading(false);
  };

  const counts = useMemo(() => {
    const c = { total: 0, submitted: 0, in_progress: 0, expired: 0, not_started: 0 };
    for (const cand of candidates ?? []) {
      c.total++;
      c[cand.status]++;
    }
    return c;
  }, [candidates]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (candidates ?? []).filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (!q) return true;
      return c.email.toLowerCase().includes(q) || (c.fullName ?? '').toLowerCase().includes(q);
    });
  }, [candidates, search, statusFilter]);

  const selectableVisible = useMemo(() => filtered.filter(isSelectable), [filtered]);
  // Selection only counts candidates that still exist after a refresh.
  const selectedIds = useMemo(
    () => (candidates ?? []).filter((c) => selected.has(c.id) && isSelectable(c)).map((c) => c.id),
    [candidates, selected],
  );
  const allVisibleSelected = selectableVisible.length > 0 && selectableVisible.every((c) => selected.has(c.id));
  const submittedFiltered = useMemo(() => filtered.filter((c) => c.status === 'submitted' && c.submission), [filtered]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAllVisible = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) selectableVisible.forEach((c) => next.delete(c.id));
      else selectableVisible.forEach((c) => next.add(c.id));
      return next;
    });

  const detail = candidates?.find((c) => c.id === detailId) ?? null;

  if (!candidates && !error) return <Spinner />;
  if (!candidates && error) {
    return (
      <Card className="mx-auto max-w-md space-y-4 text-center">
        <ErrorBox message={error} />
        <Button onClick={refresh} loading={loading}>
          Дахин ачаалах
        </Button>
      </Card>
    );
  }

  const stats: { label: string; value: number; style: string }[] = [
    { label: 'Нийт', value: counts.total, style: 'bg-white text-[#1a1a1a]' },
    { label: STATUS_LABEL.submitted, value: counts.submitted, style: 'bg-emerald-50 text-emerald-700' },
    { label: STATUS_LABEL.in_progress, value: counts.in_progress, style: 'bg-[#e7f0ff] text-[#2455D8]' },
    { label: STATUS_LABEL.expired, value: counts.expired, style: 'bg-orange-50 text-orange-700' },
    { label: STATUS_LABEL.not_started, value: counts.not_started, style: 'bg-gray-100 text-gray-600' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`flex items-baseline gap-2 rounded-2xl border border-[#e2eafa] px-4 py-2.5 ${s.style}`}>
            <span className="text-2xl font-bold tabular-nums">{s.value}</span>
            <span className="text-sm font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      <Card className="space-y-4 !p-4 sm:!p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Имэйл эсвэл нэрээр хайх"
            aria-label="Хайх"
            className="min-w-0 flex-1 rounded-xl border border-[#cbdcf7] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#2455D8] focus:ring-2 focus:ring-[#2455D8]/20"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | CandidateStatus)}
            aria-label="Төлөв"
            className="rounded-xl border border-[#cbdcf7] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#2455D8] focus:ring-2 focus:ring-[#2455D8]/20"
          >
            <option value="all">Бүх төлөв</option>
            {(Object.keys(STATUS_LABEL) as CandidateStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="px-4 py-2.5" loading={loading} onClick={refresh}>
              Шинэчлэх
            </Button>
            <Button
              variant="outline"
              className="px-4 py-2.5"
              disabled={submittedFiltered.length === 0}
              onClick={() => exportIds(submittedFiltered.map((c) => c.id))}
            >
              <DownloadIcon /> Илгээсэн бүгдийг татах ({submittedFiltered.length})
            </Button>
            <Button className="px-4 py-2.5" disabled={selectedIds.length === 0} onClick={() => exportIds(selectedIds)}>
              <DownloadIcon /> Сонгосныг татах ({selectedIds.length})
            </Button>
          </div>
        </div>
        <ErrorBox message={error} />
        {(selectedIds.length > MAX_EXPORT_CANDIDATES || submittedFiltered.length > MAX_EXPORT_CANDIDATES) && (
          <p className="text-xs text-[#52627a]">
            Нэг таталтад хамгийн ихдээ {MAX_EXPORT_CANDIDATES} хүн багтана. Илүү олныг хэд хэдэн хэсэг болгон татна.
          </p>
        )}
      </Card>

      <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-[0_24px_70px_rgba(45,98,236,0.12)] backdrop-blur">
        {filtered.length === 0 ? (
          <p className="px-6 py-16 text-center text-[#52627a]">Тохирох үр дүн олдсонгүй.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="border-b border-[#e2eafa] bg-[#f6f9ff] text-xs font-semibold uppercase tracking-wider text-[#52627a]">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label="Харагдаж буйг бүгдийг сонгох"
                      checked={allVisibleSelected}
                      disabled={selectableVisible.length === 0}
                      onChange={toggleAllVisible}
                      className="h-4 w-4 accent-[#2455D8]"
                    />
                  </th>
                  <th className="px-3 py-3">Имэйл</th>
                  <th className="px-3 py-3">Төлөв</th>
                  <th className="px-3 py-3">Эхэлсэн</th>
                  <th className="px-3 py-3">Илгээсэн</th>
                  <th className="px-3 py-3">Минут</th>
                  <th className="px-3 py-3">Файл</th>
                  <th className="px-3 py-3">Портфолио</th>
                  <th className="px-3 py-3 text-right">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2fb]">
                {filtered.map((c) => {
                  const selectable = isSelectable(c);
                  const links = c.portfolio.links.length;
                  return (
                    <tr key={c.id} className="hover:bg-[#f6f9ff]">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          aria-label={`${c.email} сонгох`}
                          checked={selected.has(c.id) && selectable}
                          disabled={!selectable}
                          onChange={() => toggle(c.id)}
                          className="h-4 w-4 accent-[#2455D8]"
                        />
                      </td>
                      <td className="max-w-[260px] px-3 py-3">
                        <p className="truncate font-medium text-[#1a1a1a]">{c.email}</p>
                        {c.fullName && <p className="truncate text-xs text-[#52627a]">{c.fullName}</p>}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-[#334155]">{formatDate(c.startedAt)}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-[#334155]">{formatDate(c.submittedAt)}</td>
                      <td className="px-3 py-3 tabular-nums text-[#334155]">{c.minutesUsed ?? '—'}</td>
                      <td className="max-w-[220px] px-3 py-3">
                        {c.submission ? (
                          <>
                            <p className="truncate text-[#1a1a1a]" title={c.submission.fileName ?? undefined}>
                              {c.submission.fileName ?? 'project.zip'}
                            </p>
                            <p className="text-xs text-[#52627a]">{formatBytes(c.submission.size)}</p>
                          </>
                        ) : (
                          <span className="text-[#9aa8bd]">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-[#334155]">
                        {links > 0 || c.portfolio.text ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            {links > 0 && `${links} холбоос`}
                            {links > 0 && c.portfolio.text && ' + '}
                            {c.portfolio.text && 'текст'}
                          </span>
                        ) : (
                          <span className="text-[#9aa8bd]">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" className="px-3 py-1.5 text-xs" onClick={() => setDetailId(c.id)}>
                            Дэлгэрэнгүй
                          </Button>
                          <button
                            type="button"
                            disabled={!c.submission}
                            aria-label="Төсөл татах (.zip)"
                            title="Төсөл татах (.zip)"
                            onClick={() => triggerDownload(downloadUrl(c.id))}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#cbdcf7] bg-white text-[#1b40a8] transition-colors hover:bg-[#eef5ff] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <DownloadIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detail && <DetailModal candidate={detail} onClose={() => setDetailId(null)} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail modal
// ---------------------------------------------------------------------------
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-wider text-[#52627a]">{label}</dt>
      <dd className="mt-0.5 break-words text-sm text-[#1a1a1a]">{children}</dd>
    </div>
  );
}

function DetailModal({ candidate: c, onClose }: { candidate: AdminCandidate; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const dash = (v: string | null) => v || '—';
  const portfolioEmpty = !hasPortfolio(c);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1b33]/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={c.email}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_70px_rgba(15,27,51,0.35)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#e2eafa] px-6 py-4">
          <div className="min-w-0">
            <h2 className="break-all text-lg font-bold text-[#1a1a1a]">{c.email}</h2>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge status={c.status} />
              {c.fullName && <span className="text-sm text-[#52627a]">{c.fullName}</span>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Хаах"
            className="shrink-0 rounded-full p-2 text-[#52627a] hover:bg-[#eef5ff] hover:text-[#1b40a8]"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto px-6 py-5">
          <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <Field label="Имэйл">{c.email}</Field>
            <Field label="Нэр">{dash(c.fullName)}</Field>
            <Field label="Урьсан">{c.invited ? 'Тийм' : 'Үгүй'}</Field>
            <Field label="Даалгавар">{dash(c.taskTitle)}</Field>
            <Field label="Төлөв">{STATUS_LABEL[c.status]}</Field>
            <Field label="Ашигласан минут">{c.minutesUsed ?? '—'}</Field>
            <Field label="Бүртгэгдсэн">{formatDate(c.createdAt)}</Field>
            <Field label="Сүүлд нэвтэрсэн">{formatDate(c.lastLoginAt)}</Field>
            <Field label="Эхэлсэн">{formatDate(c.startedAt)}</Field>
            <Field label="Дуусах хугацаа">{formatDate(c.deadlineAt)}</Field>
            <Field label="Илгээсэн">{formatDate(c.submittedAt)}</Field>
            <Field label="Файл">
              {c.submission ? (
                <>
                  {c.submission.fileName ?? 'project.zip'}
                  {c.submission.size !== null && <span className="text-[#52627a]"> ({formatBytes(c.submission.size)})</span>}
                </>
              ) : (
                '—'
              )}
            </Field>
            <Field label="Эхэлсэн IP">{dash(c.startIp)}</Field>
            <Field label="Илгээсэн IP">{dash(c.submitIp)}</Field>
            <div className="sm:col-span-2">
              <Field label="Хөтөч (User agent)">{dash(c.userAgent)}</Field>
            </div>
          </dl>

          <section className="space-y-3 border-t border-[#e2eafa] pt-5">
            <h3 className="font-semibold text-[#1a1a1a]">Портфолио</h3>
            {portfolioEmpty ? (
              <p className="text-sm text-[#52627a]">Портфолио илгээгээгүй</p>
            ) : (
              <div className="space-y-3 rounded-2xl bg-[#f6f9ff] p-4 text-sm">
                {c.portfolio.links.length > 0 && (
                  <ul className="space-y-1">
                    {c.portfolio.links.map((link, i) => (
                      <li key={`${i}-${link}`}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-[#2455D8] hover:underline"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                {c.portfolio.text && <p className="whitespace-pre-wrap break-words text-[#334155]">{c.portfolio.text}</p>}
              </div>
            )}
            {c.portfolio.submittedAt && (
              <p className="text-xs text-[#52627a]">Портфолио илгээсэн: {formatDate(c.portfolio.submittedAt)}</p>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#e2eafa] bg-[#f6f9ff] px-6 py-4 sm:flex-row sm:justify-end">
          <Button variant="outline" disabled={!c.submission} onClick={() => triggerDownload(downloadUrl(c.id))}>
            <DownloadIcon /> Төсөл татах (.zip)
          </Button>
          <Button onClick={() => triggerDownload(exportUrl([c.id]))}>
            <DownloadIcon /> Бүгдийг татах (төсөл + портфолио)
          </Button>
        </div>
      </div>
    </div>
  );
}
