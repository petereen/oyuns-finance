'use client';

import { useState, useEffect } from 'react';
import { getLatestBotRate, type BotRate } from '@/lib/supabase';

/* ── Telegram icon (paper-plane style, proven SVG) ───────────────────── */
const TelegramIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

type Direction = 'rub-to-mnt' | 'mnt-to-rub';

interface ExchangeCalculatorProps {
  /** Pre-fetched rate to avoid duplicate fetches. If omitted, component fetches its own. */
  initialRate?: BotRate | null;
  /** Compact layout for sidebar usage */
  compact?: boolean;
  lang?: 'mn' | 'ru';
}

export default function ExchangeCalculator({ initialRate, compact = false, lang = 'mn' }: ExchangeCalculatorProps) {
  const [rate, setRate] = useState<BotRate | null>(initialRate ?? null);
  const [loading, setLoading] = useState(!initialRate);
  
  const t = {
    mn: {
      title: 'Валют тооцоолуур',
      send: 'Илгээх',
      receive: 'Хүлээн авах',
      contact: 'Бидэнтэй холбогдох',
      switch: 'Чиглэл солих'
    },
    ru: {
      title: 'Калькулятор обмена',
      send: 'Отправить',
      receive: 'Получить',
      contact: 'Связаться с нами',
      switch: 'Переключить направление'
    }
  };
  
  const content = t[lang] || t.mn;
  const [direction, setDirection] = useState<Direction>('rub-to-mnt');
  const [amount, setAmount] = useState('100000');

  useEffect(() => {
    if (initialRate) {
      setRate(initialRate);
      setLoading(false);
      return;
    }
    let mounted = true;
    getLatestBotRate().then((r) => {
      if (mounted) { setRate(r); setLoading(false); }
    });
    return () => { mounted = false; };
  }, [initialRate]);

  const numAmount = parseFloat(amount) || 0;

  let result = '—';
  let rateUsed = '—';
  let fromLabel = '';
  let toLabel = '';

  if (rate && numAmount > 0) {
    if (direction === 'rub-to-mnt') {
      // RUB → MNT: 1 RUB = buy_rate MNT → multiply
      result = (numAmount * rate.buy_rate).toLocaleString('en-US', { maximumFractionDigits: 2 });
      rateUsed = `1 RUB = ${rate.buy_rate.toFixed(2)} MNT`;
      fromLabel = 'RUB';
      toLabel = 'MNT';
    } else {
      // MNT → RUB: 1 RUB = sell_rate MNT → divide by sell_rate
      result = (numAmount / rate.sell_rate).toLocaleString('en-US', { maximumFractionDigits: 2 });
      rateUsed = `1 RUB = ${rate.sell_rate.toFixed(2)} MNT`;
      fromLabel = 'MNT';
      toLabel = 'RUB';
    }
  } else {
    fromLabel = direction === 'rub-to-mnt' ? 'RUB' : 'MNT';
    toLabel = direction === 'rub-to-mnt' ? 'MNT' : 'RUB';
  }

  const toggleDirection = () => {
    setDirection((d) => (d === 'rub-to-mnt' ? 'mnt-to-rub' : 'rub-to-mnt'));
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 ${compact ? 'p-5' : 'p-7'} card-hover`}>
      <h3 className={`${compact ? 'text-base' : 'text-lg'} font-bold text-[#1a1a1a] mb-4`}>
        {content.title}
      </h3>

      {/* Direction toggle */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setDirection('rub-to-mnt')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
            direction === 'rub-to-mnt'
              ? 'bg-[#2455D8] text-white shadow-md shadow-blue-900/25'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          RUB → MNT
        </button>

        <button
          onClick={toggleDirection}
          className="w-9 h-9 flex-shrink-0 rounded-full bg-slate-100 hover:bg-blue-50 flex items-center justify-center transition-colors group"
          aria-label={content.switch}
        >
          <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
        </button>

        <button
          onClick={() => setDirection('mnt-to-rub')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
            direction === 'mnt-to-rub'
              ? 'bg-[#2455D8] text-white shadow-md shadow-blue-900/25'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          MNT → RUB
        </button>
      </div>

      {/* From input */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-slate-500 mb-1.5">
          {content.send} ({fromLabel})
        </label>
        <div className="relative">
          <input
            type="number"
            placeholder="100000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 font-semibold pr-16"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{fromLabel}</span>
        </div>
      </div>

      {/* Result */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-slate-500 mb-1.5">
          {content.receive} ({toLabel})
        </label>
        <div className="relative w-full px-4 py-3 border border-gray-200 rounded-xl bg-slate-50 text-slate-900 font-semibold">
          {loading ? (
            <span className="inline-block w-20 h-5 shimmer rounded" />
          ) : (
            result
          )}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{toLabel}</span>
        </div>
      </div>

      {/* Rate info */}
      {!loading && rate && (
        <p className="text-xs text-slate-400 mb-4 text-center">
          {rateUsed} • Шинэчлэгдсэн: {new Date(rate.updated_at || Date.now()).toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}

      {/* CTA */}
      <a
        href="https://t.me/oyuns_alo"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-full bg-gradient-to-r from-[#2455D8] to-[#3d6de5] text-white px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-900/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-semibold text-sm"
      >
        <TelegramIcon className="w-4 h-4 mr-2" />
        {content.contact}
      </a>
    </div>
  );
}

export { TelegramIcon };
