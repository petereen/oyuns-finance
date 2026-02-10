'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ExchangeRateChart from '@/components/ExchangeRateChart';
import {
  getLatestBotRate,
  getLatestBusinessRate,
  getBotRateHistory,
  type BotRate,
  type BusinessRate,
} from '@/lib/supabase';

export default function ExchangePage() {
  const [loading, setLoading] = useState(true);
  const [botRate, setBotRate] = useState<BotRate | null>(null);
  const [businessRate, setBusinessRate] = useState<BusinessRate | null>(null);
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);
  const [historyData, setHistoryData] = useState<Array<{ date: string; buy_rate: number; sell_rate: number }>>([]);
  const [calcAmount, setCalcAmount] = useState<string>('100000');

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

  const calculatedAmount = botRate && calcAmount
    ? (parseFloat(calcAmount) / botRate.buy_rate).toFixed(2)
    : '—';

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="mb-10">
            <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-2">Ханш</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
              Валютын ханш
            </h1>
            <p className="text-slate-500">
              Өдөр тутмын ханш болон түүхэн мэдээлэл
            </p>
          </div>

          {/* Individual (Bot) Rates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-7 text-white overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-blue-200">Хувь хүний худалдан авах</p>
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
                  <p className="text-sm font-medium text-emerald-200">Хувь хүний зарах</p>
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

          {/* Time Range Selector */}
          <div className="flex gap-2 mb-6">
            {([7, 30, 90] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-gray-200'
                }`}
              >
                {range} хоног
              </button>
            ))}
          </div>

          {/* Historical Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-slate-500 text-sm">Ханш ачааллаж байна...</p>
              </div>
            ) : historyData.length > 0 ? (
              <ExchangeRateChart data={historyData} currencyPair="MNT/RUB" />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p className="text-slate-400">Түүхэн мэдээлэл олдсонгүй</p>
              </div>
            )}
          </motion.div>

          {/* Business Rates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl p-7 border border-gray-100 card-hover"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-slate-500">Бизнес B2C ханш</p>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-blue-600 mb-1">
                {loading ? <span className="inline-block w-24 h-9 shimmer rounded-lg" /> : businessRate ? businessRate.b2c_rate.toFixed(2) : '—'}
              </div>
              <p className="text-slate-400 text-sm">MNT / RUB</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-2xl p-7 border border-gray-100 card-hover"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-slate-500">Бизнес B2B ханш</p>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-emerald-600 mb-1">
                {loading ? <span className="inline-block w-24 h-9 shimmer rounded-lg" /> : businessRate ? businessRate.b2b_rate.toFixed(2) : '—'}
              </div>
              <p className="text-slate-400 text-sm">MNT / RUB</p>
            </motion.div>
          </div>

          {/* Exchange Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl p-7 border border-gray-100 card-hover"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-5">Валют тооцоолуур</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-2">
                  Мөнгөн дүн (MNT)
                </label>
                <input
                  type="number"
                  placeholder="100000"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 text-lg font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-2">
                  Хөрвүүлэх дүн (RUB)
                </label>
                <div className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-slate-50 text-slate-900 text-lg font-semibold">
                  {calculatedAmount}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <a
                href="https://t.me/oyuns_aio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-7 py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-semibold text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 3.767-1.362 5.001-.169.523-.506.697-.83.715-.704.031-1.237-.465-1.918-.912-.964-.633-1.508-1.028-2.447-1.647-.951-.627-.334-1.098.208-1.735.142-.164 2.606-2.389 2.652-2.592.006-.025.011-.117-.043-.166-.054-.049-.133-.033-.19-.019-.079.019-1.339.851-3.781 2.5-.358.246-.682.366-.973.36-.32-.006-.936-.181-1.395-.329-.563-.181-1.009-.277-1.086-.299-.167-.046-.252-.088-.252-.183 0-.074.057-.149.172-.225.641-.423 1.64-1.056 2.987-1.9.984-.615 2.149-1.314 3.487-2.097.284-.166.567-.333.85-.499.117-.069.234-.068.35.002.116.069.174.183.174.315z"/>
                </svg>
                Валют солих (Telegram)
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
