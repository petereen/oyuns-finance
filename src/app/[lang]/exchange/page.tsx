'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import ExchangeRateChart from '@/components/ExchangeRateChart';
import ExchangeCalculator from '@/components/ExchangeCalculator';
import {
  getLatestBotRate,
  getLatestBusinessRate,
  getBotRateHistory,
  type BotRate,
  type BusinessRate,
} from '@/lib/supabase';

export default function ExchangePage() {
  const params = useParams();
  const lang = params.lang as 'mn' | 'ru';
  const [loading, setLoading] = useState(true);
  const [botRate, setBotRate] = useState<BotRate | null>(null);
  const [businessRate, setBusinessRate] = useState<BusinessRate | null>(null);
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);
  const [historyData, setHistoryData] = useState<Array<{ date: string; buy_rate: number; sell_rate: number }>>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchRates = async () => {
      setLoading(true);
      const [latestBotRate, latestBusinessRate, history] = await Promise.all([
        getLatestBotRate(),
        getLatestBusinessRate(),
        getBotRateHistory(timeRange),
      ]);

      if (!isMounted) return;
      setBotRate(latestBotRate);
      setBusinessRate(latestBusinessRate);

      const chartData = history.map((rate) => ({
        date: rate.updated_at || '',
        buy_rate: rate.buy_rate,
        sell_rate: rate.sell_rate,
      }));
      setHistoryData(chartData);
      setLoading(false);
    };

    fetchRates();

    return () => {
      isMounted = false;
    };
  }, [timeRange]);

  const t = {
    mn: {
      header_sub: 'Ханш',
      header_title: 'Валютын ханш',
      header_desc: 'OYUNS ALL-IN-ONE өдөр тутмын ханш болон түүхэн мэдээлэл',
      personal_title: 'Хувь хэрэглэгчийн ханш',
      personal_desc: 'Авах / Зарах',
      buy: 'Худалдан авах',
      sell: 'Зарах',
      business_title: 'BusinessPay ханш',
      business_desc: 'Гүйлгээний ханш',
      b2c: 'Хувь хүнээс байгууллага руу шилжүүлэх ханш',
      b2b: 'Байгууллагаас байгууллага руу шилжүүлэх ханш',
      days: 'хоног',
      loading: 'Ханш ачааллаж байна...',
      no_data: 'Түүхэн мэдээлэл олдсонгүй'
    },
    ru: {
      header_sub: 'Курс валют',
      header_title: 'Курсы валют',
      header_desc: 'Ежедневные курсы и исторические данные OYUNS ALL-IN-ONE',
      personal_title: 'Для физических лиц',
      personal_desc: 'Покупка / Продажа',
      buy: 'Покупка',
      sell: 'Продажа',
      business_title: 'Курс BusinessPay',
      business_desc: 'Курс транзакций',
      b2c: 'Перевод от физ. лица юридическому',
      b2b: 'Перевод между юридическими лицами',
      days: 'дней',
      loading: 'Загрузка курсов...',
      no_data: 'Исторические данные не найдены'
    }
  };

  const content = t[lang] || t.mn;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#eaeaea]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="mb-10">
            <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">{content.header_sub}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-2">
              {content.header_title}
            </h1>
            <p className="text-[#555]">
              {content.header_desc}
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              Section 1: Хувь хүний ханш (Individual buy/sell rates)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1a1a1a]">{content.personal_title}</h2>
                  <p className="text-sm text-[#555]">{content.personal_desc}</p>
                </div>
              </div>
              <a
                href="https://t.me/oyunsaio_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex bg-[#2455D8] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                OYUNS MINI APP
              </a>
              <a
                href="https://t.me/oyunsaio_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden bg-[#2455D8] text-white p-2 rounded-xl hover:bg-blue-700 transition-colors"
                title="oyunsaio_bot"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative bg-gradient-to-br from-[#2455D8] to-[#3d6de5] rounded-2xl p-7 text-white overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-blue-200">{content.buy}</p>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-1">
                    {loading ? <span className="inline-block w-32 h-12 shimmer rounded-lg" /> : botRate ? botRate.buy_rate.toFixed(2) : '—'}
                  </div>
                  <p className="text-blue-200 text-sm">MNT / RUB</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-7 text-white overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-emerald-200">{content.sell}</p>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-1">
                    {loading ? <span className="inline-block w-32 h-12 shimmer rounded-lg" /> : botRate ? botRate.sell_rate.toFixed(2) : '—'}
                  </div>
                  <p className="text-emerald-200 text-sm">MNT / RUB</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              Historical Chart
              ═══════════════════════════════════════════════════════════════ */}
          {/* Time Range Selector */}
          <div className="flex gap-2 mb-6">
            {([7, 30, 90] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  timeRange === range
                    ? "bg-[#2455D8] text-white shadow-lg shadow-blue-900/20"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-gray-200"
                }`}
              >
                {range} {content.days}
              </button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-slate-500 text-sm">{content.loading}</p>
              </div>
            ) : historyData.length > 0 ? (
              <ExchangeRateChart data={historyData} currencyPair="MNT/RUB" />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p className="text-slate-400">{content.no_data}</p>
              </div>
            )}
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════
              Section 2: Бизнес ханш (B2C + B2B — gradient cards)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1a1a1a]">{content.business_title}</h2>
                  <p className="text-sm text-[#555]">{content.business_desc}</p>
                </div>
              </div>
              <a
                href="https://t.me/Soyuns_aio"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex bg-[#2455D8] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                OYUNS ALL-IN-ONE
              </a>
              <a
                href="https://t.me/Soyuns_aio"
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden bg-[#2455D8] text-white p-2 rounded-xl hover:bg-blue-700 transition-colors"
                title="OYUNS ALL-IN-ONE"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* B2C */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative bg-white border border-gray-200 rounded-2xl p-7 overflow-hidden border-l-4 border-l-[#2455D8]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-8 translate-x-8 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-[#555]">{content.b2c}</p>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold tracking-tight mb-1 text-[#1a1a1a]">
                    {loading ? <span className="inline-block w-32 h-12 shimmer rounded-lg" /> : businessRate ? businessRate.b2c_rate.toFixed(2) : '—'}
                  </div>
                  <p className="text-[#555] text-sm">MNT / RUB</p>
                </div>
              </motion.div>

              {/* B2B */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative bg-white border border-gray-200 rounded-2xl p-7 overflow-hidden border-l-4 border-l-cyan-600"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-full -translate-y-8 translate-x-8 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-[#555]">{content.b2b}</p>
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold tracking-tight mb-1 text-[#1a1a1a]">
                    {loading ? <span className="inline-block w-32 h-12 shimmer rounded-lg" /> : businessRate ? businessRate.b2b_rate.toFixed(2) : '—'}
                  </div>
                  <p className="text-[#555] text-sm">MNT / RUB</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              Section 3: Тооцоолуур (Exchange Calculator)
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className=""
          >
            <ExchangeCalculator initialRate={botRate} lang={lang} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
