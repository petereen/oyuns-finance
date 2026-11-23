'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MAX_PORTFOLIO_LINKS,
  MAX_PORTFOLIO_TEXT_LENGTH,
  MAX_ZIP_BYTES,
  OTP_LENGTH,
  type AssessmentState,
} from '@/lib/assessment/config';

// ---------------------------------------------------------------------------
// Messages (Mongolian). Edit wording here.
// ---------------------------------------------------------------------------
const ERRORS: Record<string, string> = {
  invalid_email: 'Имэйл хаяг буруу байна.',
  not_invited: 'Энэ имэйл хаяг даалгаварт бүртгэгдээгүй байна. HR-тай холбогдоно уу.',
  cooldown: 'Түр хүлээгээд дахин оролдоно уу.',
  too_many_requests: 'Хэт олон хүсэлт илгээлээ. 1 цагийн дараа дахин оролдоно уу.',
  email_failed: 'Имэйл илгээхэд алдаа гарлаа. Дахин оролдоно уу.',
  invalid_code: 'Код буруу байна.',
  code_expired: 'Кодын хугацаа дууссан байна. Шинэ код авна уу.',
  too_many_attempts: 'Буруу оролдлого хэт олон боллоо. Шинэ код авна уу.',
  try_again: 'Дахин оролдоно уу.',
  unauthorized: 'Нэвтрэлтийн хугацаа дууссан. Дахин нэвтэрнэ үү.',
  no_task: 'Одоогоор идэвхтэй даалгавар байхгүй байна. HR-тай холбогдоно уу.',
  already_submitted: 'Та даалгавраа аль хэдийн илгээсэн байна.',
  not_started: 'Даалгавар эхлээгүй байна.',
  time_up: 'Хугацаа дууссан тул илгээх боломжгүй.',
  invalid_zip: 'Зөвхөн хоосон биш .zip файл илгээнэ үү.',
  file_too_large: `Файлын хэмжээ ${Math.round(MAX_ZIP_BYTES / 1024 / 1024)}MB-аас хэтэрсэн байна.`,
  too_many_uploads: 'Файл хуулах оролдлого хэт олон боллоо. HR-тай холбогдоно уу.',
  file_missing: 'Файл олдсонгүй. Дахин хуулна уу.',
  upload_failed: 'Файл хуулахад алдаа гарлаа. Интернэт холболтоо шалгаад дахин оролдоно уу.',
  invalid_links: 'Холбоос буруу байна. https://... хэлбэрээр оруулна уу.',
  too_many_links: `Хамгийн ихдээ ${MAX_PORTFOLIO_LINKS} холбоос оруулна.`,
  text_too_long: 'Текст хэт урт байна.',
  empty_portfolio: 'Дор хаяж нэг холбоос эсвэл тайлбар оруулна уу.',
  portfolio_already_submitted: 'Портфолио аль хэдийн илгээгдсэн байна.',
  not_configured: 'Систем тохируулагдаагүй байна. HR-тай холбогдоно уу.',
  forbidden: 'Хүсэлт хориглогдлоо. Хуудсаа дахин ачаална уу.',
  network: 'Сүлжээний алдаа. Интернэт холболтоо шалгана уу.',
  server_error: 'Алдаа гарлаа. Дахин оролдоно уу.',
};

const errorText = (code: string) => ERRORS[code] ?? ERRORS.server_error;

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

async function api<T = { state: AssessmentState }>(path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/assessment/${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'same-origin',
      cache: 'no-store',
    });
  } catch {
    throw new ApiError('network', {});
  }
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new ApiError(typeof data.error === 'string' ? data.error : 'server_error', data);
  return data as T;
}

function uploadZip(url: string, file: File, onProgress: (fraction: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', 'application/zip');
    xhr.setRequestHeader('x-upsert', 'false');
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (anonKey) xhr.setRequestHeader('apikey', anonKey);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new ApiError('upload_failed', {})));
    xhr.onerror = () => reject(new ApiError('upload_failed', {}));
    xhr.ontimeout = () => reject(new ApiError('upload_failed', {}));
    xhr.send(file);
  });
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

function formatDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('mn-MN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------
export default function AssessmentApp() {
  const [state, setState] = useState<AssessmentState | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  // Offset between server and client clocks: serverTime ≈ Date.now() + offset.
  const [clockOffset, setClockOffset] = useState(0);

  const applyState = useCallback((next: AssessmentState) => {
    if (next.status === 'in_progress') setClockOffset(new Date(next.serverNow).getTime() - Date.now());
    setState(next);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const data = await api('state');
      setLoadError(null);
      applyState(data.state);
    } catch (error) {
      setLoadError(errorText(error instanceof ApiError ? error.code : 'server_error'));
    }
  }, [applyState]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Handles errors from any action: session lost -> back to login; server says
  // already submitted -> show completion page.
  const handleActionError = useCallback(
    (error: unknown): string => {
      if (error instanceof ApiError) {
        if (error.code === 'unauthorized') {
          refresh();
        } else if (error.data.state && typeof error.data.state === 'object') {
          applyState(error.data.state as AssessmentState);
        } else if (error.code === 'time_up' || error.code === 'already_submitted') {
          refresh();
        }
        return errorText(error.code);
      }
      return errorText('server_error');
    },
    [applyState, refresh],
  );

  const logout = async () => {
    await api('logout', {}).catch(() => {});
    refresh();
  };

  const headerEmail =
    state && state.status !== 'anonymous' && state.status !== 'in_progress' ? state.email : null;

  return (
    <div className="min-h-screen px-4 pb-16 sm:px-6">
      <header className="mx-auto flex max-w-3xl items-center justify-between py-6">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-main.svg" alt="OYUNS ALL-IN-ONE" className="h-9 w-auto" />
          <span className="hidden text-sm font-semibold text-[#52627a] sm:inline">Ажлын байрны даалгавар</span>
        </div>
        {headerEmail && (
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden max-w-[220px] truncate text-[#52627a] sm:inline">{headerEmail}</span>
            <Button variant="ghost" className="px-3 py-2" onClick={logout}>
              Гарах
            </Button>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-3xl">
        {!state && !loadError && <Spinner />}
        {!state && loadError && (
          <Card className="space-y-4 text-center">
            <ErrorBox message={loadError} />
            <Button onClick={refresh}>Дахин ачаалах</Button>
          </Card>
        )}
        {state?.status === 'anonymous' && <AuthFlow durationMinutes={state.durationMinutes} onAuthed={applyState} />}
        {state?.status === 'not_started' && <StartView state={state} onStarted={applyState} onError={handleActionError} />}
        {state?.status === 'in_progress' && (
          <TaskView
            key={state.deadlineAt}
            state={state}
            clockOffset={clockOffset}
            onSubmitted={applyState}
            onError={handleActionError}
            onTimeUp={refresh}
          />
        )}
        {state?.status === 'expired' && <ExpiredView deadlineAt={state.deadlineAt} />}
        {state?.status === 'submitted' && <CompleteView state={state} onUpdated={applyState} onError={handleActionError} />}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Welcome + email OTP
// ---------------------------------------------------------------------------
function AuthFlow({ durationMinutes, onAuthed }: { durationMinutes: number; onAuthed: (s: AssessmentState) => void }) {
  const [step, setStep] = useState<'info' | 'email' | 'code'>('info');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const requestCode = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const data = await api<{ cooldownSeconds: number }>('otp/request', { email });
      setCooldown(data.cooldownSeconds ?? 60);
      setCode('');
      setStep('code');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'cooldown' && typeof err.data.retryAfter === 'number') {
          setCooldown(err.data.retryAfter);
          setStep('code');
        }
        setError(errorText(err.code));
      } else setError(errorText('server_error'));
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    if (busy || code.length !== OTP_LENGTH) return;
    setBusy(true);
    setError(null);
    try {
      const data = await api('otp/verify', { email, code });
      onAuthed(data.state);
    } catch (err) {
      if (err instanceof ApiError) {
        const left = typeof err.data.attemptsLeft === 'number' ? err.data.attemptsLeft : null;
        setError(errorText(err.code) + (err.code === 'invalid_code' && left !== null ? ` Үлдсэн оролдлого: ${left}.` : ''));
        if (err.code !== 'invalid_code') setCode('');
      } else setError(errorText('server_error'));
    } finally {
      setBusy(false);
    }
  };

  if (step === 'info') {
    const items = [
      {
        title: `${durationMinutes} минутын хугацаатай`,
        text: `Нэвтэрсний дараа "Эхлэх" товч дарахад ${durationMinutes} минутын хугацаа эхэлнэ. Хугацааг түр зогсоох, сунгах боломжгүй.`,
      },
      {
        title: 'Нээлттэй асуулттай даалгавар',
        text: `Эхэлсний дараа даалгаврын текст харагдана. Гүйцэтгэлээ нэг .zip файл (${Math.round(MAX_ZIP_BYTES / 1024 / 1024)}MB хүртэл) болгон илгээнэ.`,
      },
      {
        title: 'Имэйлээр нэвтрэх',
        text: 'Имэйл хаягтаа ирсэн нэг удаагийн кодоор нэвтэрнэ. Нэг имэйл хаягаар зөвхөн нэг удаа оролцох боломжтой.',
      },
      {
        title: 'Портфолио',
        text: 'Портфолио, ажлын холбоосоо даалгавартай хамт эсвэл даалгавраа илгээсний дараа илгээж болно.',
      },
      {
        title: 'Бэлтгэлээ хангана уу',
        text: 'Тогтвортой интернэт холболттой компьютер, чимээгүй орчин бэлдээрэй. Хуудсаа хаасан ч хугацаа үргэлжлэн тоологдоно — дахин нэвтэрч үргэлжлүүлж болно.',
      },
    ];
    return (
      <Card>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#2455D8]">Тавтай морил</p>
        <h1 className="mb-3 text-2xl font-bold text-[#1a1a1a] sm:text-3xl">Ажил горилогчийн даалгавар</h1>
        <p className="mb-8 text-[#52627a]">
          OYUNS ALL-IN-ONE-д сонирхол илэрхийлсэнд баярлалаа. Эхлэхээс өмнө доорх мэдээлэлтэй сайтар танилцана уу.
        </p>
        <ol className="mb-8 space-y-4">
          {items.map((item, i) => (
            <li key={item.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e7f0ff] text-sm font-bold text-[#2455D8]">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-[#1a1a1a]">{item.title}</p>
                <p className="text-sm leading-relaxed text-[#52627a]">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <Button className="w-full sm:w-auto" onClick={() => setStep('email')}>
          Бэлэн байна — нэвтрэх
        </Button>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md">
      {step === 'email' ? (
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            requestCode();
          }}
        >
          <div>
            <h1 className="mb-2 text-xl font-bold text-[#1a1a1a]">Имэйлээр нэвтрэх</h1>
            <p className="text-sm text-[#52627a]">Таны имэйл хаяг руу 6 оронтой нэвтрэх код илгээнэ.</p>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#1a1a1a]">Имэйл хаяг</span>
            <input
              type="email"
              required
              autoFocus
              autoComplete="email"
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-[#cbdcf7] bg-white px-4 py-3 text-[#1a1a1a] outline-none focus:border-[#2455D8] focus:ring-2 focus:ring-[#2455D8]/20"
            />
          </label>
          <ErrorBox message={error} />
          <div className="flex items-center justify-between gap-3">
            <Button type="button" variant="ghost" className="px-0" onClick={() => setStep('info')}>
              ← Буцах
            </Button>
            <Button type="submit" loading={busy} disabled={!email.trim()}>
              Код авах
            </Button>
          </div>
        </form>
      ) : (
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            verify();
          }}
        >
          <div>
            <h1 className="mb-2 text-xl font-bold text-[#1a1a1a]">Кодоо оруулна уу</h1>
            <p className="text-sm text-[#52627a]">
              <span className="font-semibold text-[#1a1a1a]">{email}</span> хаяг руу код илгээлээ. Spam хавтсаа ч шалгаарай.
            </p>
          </div>
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            maxLength={OTP_LENGTH}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))}
            placeholder={'•'.repeat(OTP_LENGTH)}
            aria-label="Нэвтрэх код"
            className="w-full rounded-xl border border-[#cbdcf7] bg-white px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] text-[#1a1a1a] outline-none focus:border-[#2455D8] focus:ring-2 focus:ring-[#2455D8]/20"
          />
          <ErrorBox message={error} />
          <Button type="submit" className="w-full" loading={busy} disabled={code.length !== OTP_LENGTH}>
            Баталгаажуулах
          </Button>
          <div className="flex items-center justify-between text-sm">
            <Button
              type="button"
              variant="ghost"
              className="px-0 py-1"
              onClick={() => {
                setStep('email');
                setError(null);
              }}
            >
              Имэйл солих
            </Button>
            <Button type="button" variant="ghost" className="px-0 py-1" disabled={cooldown > 0 || busy} onClick={requestCode}>
              {cooldown > 0 ? `Дахин илгээх (${cooldown}с)` : 'Код дахин илгээх'}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Authenticated, not started
// ---------------------------------------------------------------------------
function StartView({
  state,
  onStarted,
  onError,
}: {
  state: Extract<AssessmentState, { status: 'not_started' }>;
  onStarted: (s: AssessmentState) => void;
  onError: (e: unknown) => string;
}) {
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const data = await api('start', {});
      onStarted(data.state);
    } catch (err) {
      setError(onError(err));
      setBusy(false);
    }
  };

  return (
    <Card className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">Амжилттай нэвтэрлээ</p>
        <h1 className="mb-2 text-2xl font-bold text-[#1a1a1a]">Эхлэхэд бэлэн үү?</h1>
        <p className="text-[#52627a]">
          <span className="font-semibold text-[#1a1a1a]">{state.email}</span>
        </p>
      </div>

      {!state.taskAvailable ? (
        <ErrorBox message={errorText('no_task')} />
      ) : (
        <>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
            <p className="mb-2 font-semibold">Анхааруулга</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                &quot;Эхлэх&quot; товч дармагц <b>{state.durationMinutes} минутын</b> хугацаа эхэлж, зогсоох боломжгүй.
              </li>
              <li>Хуудсаа хаасан, интернэт тасарсан ч хугацаа үргэлжлэн тоологдоно.</li>
              <li>Хугацаа дуусахаас өмнө .zip файлаа илгээх шаардлагатай. Хугацаа дууссаны дараа илгээх боломжгүй.</li>
              <li>Даалгаврыг зөвхөн нэг удаа илгээнэ.</li>
            </ul>
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-[#1a1a1a]">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#2455D8]"
            />
            Би дээрх нөхцөлтэй танилцсан бөгөөд одоо эхлэхэд бэлэн байна.
          </label>
          <ErrorBox message={error} />
          <Button className="w-full sm:w-auto" disabled={!agreed} loading={busy} onClick={start}>
            Эхлэх — {state.durationMinutes} минут
          </Button>
        </>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Portfolio fields (used in task submit and on the completion page)
// ---------------------------------------------------------------------------
type PortfolioDraft = { links: string[]; text: string };

function PortfolioFields({ value, onChange, disabled }: { value: PortfolioDraft; onChange: (v: PortfolioDraft) => void; disabled?: boolean }) {
  const setLink = (i: number, v: string) => onChange({ ...value, links: value.links.map((l, j) => (j === i ? v : l)) });
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className="block text-sm font-medium text-[#1a1a1a]">Холбоосууд (GitHub, Behance, вэбсайт г.м.)</span>
        {value.links.map((link, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="url"
              inputMode="url"
              disabled={disabled}
              value={link}
              maxLength={500}
              onChange={(e) => setLink(i, e.target.value)}
              placeholder="https://"
              className="min-w-0 flex-1 rounded-xl border border-[#cbdcf7] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#2455D8] focus:ring-2 focus:ring-[#2455D8]/20 disabled:bg-gray-50"
            />
            {value.links.length > 1 && (
              <button
                type="button"
                disabled={disabled}
                aria-label="Устгах"
                onClick={() => onChange({ ...value, links: value.links.filter((_, j) => j !== i) })}
                className="shrink-0 rounded-xl border border-[#cbdcf7] px-3 text-[#52627a] hover:bg-red-50 hover:text-red-600"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {value.links.length < MAX_PORTFOLIO_LINKS && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange({ ...value, links: [...value.links, ''] })}
            className="text-sm font-semibold text-[#2455D8] hover:underline"
          >
            + Холбоос нэмэх
          </button>
        )}
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-[#1a1a1a]">Бусад (текст)</span>
        <textarea
          rows={4}
          disabled={disabled}
          maxLength={MAX_PORTFOLIO_TEXT_LENGTH}
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
          placeholder="Холбоосоор илгээх боломжгүй ажлынхаа тайлбар, туршлага г.м."
          className="w-full resize-y rounded-xl border border-[#cbdcf7] bg-white px-4 py-3 text-sm outline-none focus:border-[#2455D8] focus:ring-2 focus:ring-[#2455D8]/20 disabled:bg-gray-50"
        />
        <span className="mt-1 block text-right text-xs text-[#52627a]">
          {value.text.length}/{MAX_PORTFOLIO_TEXT_LENGTH}
        </span>
      </label>
    </div>
  );
}

function portfolioPayload(draft: PortfolioDraft) {
  return {
    links: draft.links.map((l) => l.trim()).filter(Boolean),
    text: draft.text.trim(),
  };
}

function invalidLink(links: string[]): boolean {
  return links.some((l) => {
    try {
      const u = new URL(l);
      return u.protocol !== 'https:' && u.protocol !== 'http:';
    } catch {
      return true;
    }
  });
}

// ---------------------------------------------------------------------------
// In progress: timer + task + submission
// ---------------------------------------------------------------------------
function TaskView({
  state,
  clockOffset,
  onSubmitted,
  onError,
  onTimeUp,
}: {
  state: Extract<AssessmentState, { status: 'in_progress' }>;
  clockOffset: number;
  onSubmitted: (s: AssessmentState) => void;
  onError: (e: unknown) => string;
  onTimeUp: () => void;
}) {
  const deadline = useMemo(() => new Date(state.deadlineAt).getTime(), [state.deadlineAt]);
  const [remaining, setRemaining] = useState(() => deadline - (Date.now() + clockOffset));
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioDraft>({ links: [''], text: '' });
  const [confirming, setConfirming] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'uploading' | 'finalizing'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const busy = phase !== 'idle';
  const timeUp = remaining <= 0;

  useEffect(() => {
    const id = setInterval(() => setRemaining(deadline - (Date.now() + clockOffset)), 1000);
    return () => clearInterval(id);
  }, [deadline, clockOffset]);

  // When time runs out and nothing is in flight, ask the server for the truth
  // (retry periodically in case the server clock is a few seconds behind).
  useEffect(() => {
    if (!timeUp || busy) return;
    onTimeUp();
    const id = setInterval(onTimeUp, 5000);
    return () => clearInterval(id);
  }, [timeUp, busy, onTimeUp]);

  // Warn before leaving the page while there is unsaved work.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const pickFile = (f: File | null | undefined) => {
    setFileError(null);
    setConfirming(false);
    if (!f) return;
    if (!/\.zip$/i.test(f.name)) return setFileError(errorText('invalid_zip'));
    if (f.size === 0) return setFileError(errorText('invalid_zip'));
    if (f.size > MAX_ZIP_BYTES) return setFileError(errorText('file_too_large'));
    setFile(f);
  };

  const payload = portfolioPayload(portfolio);
  const portfolioInvalid = invalidLink(payload.links);

  const submit = async () => {
    if (!file || busy || timeUp) return;
    setError(null);
    setPhase('uploading');
    setProgress(0);
    try {
      const { path, signedUrl } = await api<{ path: string; signedUrl: string }>('upload-url', {
        filename: file.name,
        size: file.size,
      });
      await uploadZip(signedUrl, file, setProgress);
      setPhase('finalizing');
      const data = await api('submit', {
        path,
        filename: file.name,
        portfolioLinks: payload.links,
        portfolioText: payload.text,
      });
      onSubmitted(data.state);
    } catch (err) {
      setError(onError(err));
      setPhase('idle');
      setConfirming(false);
    }
  };

  const minutesLeft = remaining / 60000;
  const timerColor = minutesLeft <= 5 ? 'bg-red-600' : minutesLeft <= 15 ? 'bg-amber-500' : 'bg-[#2455D8]';

  return (
    <div className="space-y-6">
      <div className="sticky top-3 z-10">
        <div className={`flex items-center justify-between rounded-2xl px-5 py-3 text-white shadow-lg transition-colors ${timerColor}`}>
          <span className="text-sm font-medium">Үлдсэн хугацаа</span>
          <span className="font-mono text-2xl font-bold tabular-nums" aria-live="off">
            {formatDuration(remaining)}
          </span>
        </div>
        {timeUp && busy && (
          <p className="mt-2 rounded-xl bg-amber-50 px-4 py-2 text-center text-sm text-amber-800">
            Хугацаа дууслаа — хуулж буй файлыг дуусгаж байна…
          </p>
        )}
      </div>

      <Card>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#2455D8]">Даалгавар</p>
        {state.task.title && <h1 className="mb-4 text-2xl font-bold text-[#1a1a1a]">{state.task.title}</h1>}
        <div className="whitespace-pre-wrap break-words leading-relaxed text-[#334155]">{state.task.body}</div>
      </Card>

      <Card className="space-y-6">
        <div>
          <h2 className="mb-1 text-xl font-bold text-[#1a1a1a]">Даалгавар илгээх</h2>
          <p className="text-sm text-[#52627a]">
            Гүйцэтгэлээ нэг .zip файл болгон оруулна уу ({Math.round(MAX_ZIP_BYTES / 1024 / 1024)}MB хүртэл).
          </p>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!busy) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (!busy) pickFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => !busy && inputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
            dragOver ? 'border-[#2455D8] bg-[#e7f0ff]' : 'border-[#cbdcf7] bg-[#f6f9ff] hover:border-[#5d89f4]'
          } ${busy ? 'cursor-not-allowed opacity-70' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".zip,application/zip,application/x-zip-compressed"
            className="hidden"
            onChange={(e) => {
              pickFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          {file ? (
            <div>
              <p className="break-all font-semibold text-[#1a1a1a]">{file.name}</p>
              <p className="text-sm text-[#52627a]">{formatBytes(file.size)} · солихын тулд дарна уу</p>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-[#1a1a1a]">.zip файлаа энд чирж оруулах эсвэл дарж сонгох</p>
              <p className="text-sm text-[#52627a]">Зөвхөн .zip</p>
            </div>
          )}
        </div>
        <ErrorBox message={fileError} />

        <div className="space-y-3 border-t border-[#e2eafa] pt-6">
          <div>
            <h3 className="font-semibold text-[#1a1a1a]">
              Портфолио <span className="font-normal text-[#52627a]">(заавал биш)</span>
            </h3>
            <p className="text-sm text-[#52627a]">
              Портфолиогоо даалгавраа илгээсний дараа ч илгээх боломжтой.
            </p>
          </div>
          <PortfolioFields value={portfolio} onChange={setPortfolio} disabled={busy} />
          {portfolioInvalid && <ErrorBox message={errorText('invalid_links')} />}
        </div>

        <ErrorBox message={error} />

        {phase === 'uploading' && (
          <div className="space-y-1">
            <div className="h-2 overflow-hidden rounded-full bg-[#e7f0ff]">
              <div className="h-full bg-[#2455D8] transition-[width]" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
            <p className="text-right text-xs text-[#52627a]">Хуулж байна… {Math.round(progress * 100)}%</p>
          </div>
        )}

        {!confirming ? (
          <Button
            className="w-full"
            disabled={!file || portfolioInvalid || timeUp || busy}
            onClick={() => setConfirming(true)}
          >
            Илгээх
          </Button>
        ) : (
          <div className="space-y-3 rounded-2xl border border-[#cbdcf7] bg-[#f6f9ff] p-4">
            <p className="text-sm text-[#1a1a1a]">
              Даалгаврыг зөвхөн <b>нэг удаа</b> илгээнэ. Илгээсний дараа өөрчлөх боломжгүй. Илгээх үү?
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" disabled={busy} onClick={() => setConfirming(false)}>
                Болих
              </Button>
              <Button loading={busy} disabled={timeUp && !busy} onClick={submit}>
                {phase === 'finalizing' ? 'Шалгаж байна…' : 'Тийм, илгээх'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Expired
// ---------------------------------------------------------------------------
function ExpiredView({ deadlineAt }: { deadlineAt: string }) {
  return (
    <Card className="space-y-3 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">⏱</div>
      <h1 className="text-2xl font-bold text-[#1a1a1a]">Хугацаа дууссан</h1>
      <p className="text-[#52627a]">
        Даалгаврын хугацаа {formatDate(deadlineAt)}-д дууссан тул илгээх боломжгүй болсон. Асуух зүйл байвал HR-тай холбогдоно уу.
      </p>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Completed
// ---------------------------------------------------------------------------
function CompleteView({
  state,
  onUpdated,
  onError,
}: {
  state: Extract<AssessmentState, { status: 'submitted' }>;
  onUpdated: (s: AssessmentState) => void;
  onError: (e: unknown) => string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<PortfolioDraft>({ links: [''], text: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sent = !!state.portfolio.submittedAt;
  const payload = portfolioPayload(draft);
  const invalid = invalidLink(payload.links);
  const empty = payload.links.length === 0 && !payload.text;

  const send = async () => {
    if (busy || invalid || empty) return;
    setBusy(true);
    setError(null);
    try {
      const data = await api('portfolio', payload);
      onUpdated(data.state);
      setOpen(false);
    } catch (err) {
      setError(onError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-3 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">✓</div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Даалгавар амжилттай илгээгдлээ</h1>
        <p className="text-[#52627a]">
          Оролцсонд баярлалаа! Таны гүйцэтгэлийг хянаж үзээд <span className="font-semibold">{state.email}</span> хаягаар холбогдох болно.
        </p>
        <div className="mx-auto inline-block rounded-2xl bg-[#f6f9ff] px-5 py-3 text-left text-sm text-[#52627a]">
          <p>
            Илгээсэн: <span className="font-semibold text-[#1a1a1a]">{formatDate(state.submittedAt)}</span>
          </p>
          {state.fileName && (
            <p className="break-all">
              Файл: <span className="font-semibold text-[#1a1a1a]">{state.fileName}</span>
            </p>
          )}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1a1a1a]">Портфолио</h2>
            <p className="text-sm text-[#52627a]">
              {sent ? 'Таны портфолио хүлээн авагдсан.' : 'Портфолио, ажлын холбоосоо нэмж илгээх боломжтой (нэг удаа).'}
            </p>
          </div>
          {!sent && !open && (
            <Button variant="outline" onClick={() => setOpen(true)}>
              Портфолио илгээх
            </Button>
          )}
        </div>

        {sent && (
          <div className="space-y-2 rounded-2xl bg-[#f6f9ff] p-4 text-sm">
            {state.portfolio.links.map((link) => (
              <a key={link} href={link} target="_blank" rel="noopener noreferrer nofollow" className="block break-all text-[#2455D8] hover:underline">
                {link}
              </a>
            ))}
            {state.portfolio.text && <p className="whitespace-pre-wrap break-words text-[#334155]">{state.portfolio.text}</p>}
          </div>
        )}

        {!sent && open && (
          <form
            className="space-y-4 border-t border-[#e2eafa] pt-4"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <PortfolioFields value={draft} onChange={setDraft} disabled={busy} />
            {invalid && <ErrorBox message={errorText('invalid_links')} />}
            <ErrorBox message={error} />
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" disabled={busy} onClick={() => setOpen(false)}>
                Болих
              </Button>
              <Button type="submit" loading={busy} disabled={invalid || empty}>
                Илгээх
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
