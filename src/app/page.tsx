'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import ServiceCard from '@/components/ServiceCard';
import TestimonialCard from '@/components/TestimonialCard';
import ExchangeCalculator from '@/components/ExchangeCalculator';
import { getServices, getTestimonials, getPartners, getBlogPosts, assetUrl, type Service, type Testimonial, type Partner, type BlogPost } from '@/lib/directus';
import { getLatestBotRate, getLatestBusinessRate, type BotRate, type BusinessRate } from '@/lib/supabase';

/* ── Icon Components ─────────────────────────────────────────────────── */

const IndividualIcon = () => (
  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const BusinessPayIcon = () => (
  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
  </svg>
);

const ReceivePayIcon = () => (
  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const SendPayIcon = () => (
  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);

/* ── Feature icons ───────────────────────────────────────────────────── */

const FlexPriceIcon = () => (
  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
  </svg>
);

const SpeedIcon = () => (
  <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const SecureIcon = () => (
  <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);

const SupportIcon = () => (
  <svg className="w-7 h-7 text-violet-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
  </svg>
);

export default function Home() {
  const [directusServices, setDirectusServices] = useState<Service[]>([]);
  const [directusTestimonials, setDirectusTestimonials] = useState<Testimonial[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [botRate, setBotRate] = useState<BotRate | null>(null);
  const [businessRate, setBusinessRate] = useState<BusinessRate | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [services, testimonials, rate, bizRate, partnerData, posts] = await Promise.all([
          getServices().catch(() => []),
          getTestimonials().catch(() => []),
          getLatestBotRate().catch(() => null),
          getLatestBusinessRate().catch(() => null),
          getPartners().catch(() => []),
          getBlogPosts(3).catch(() => []),
        ]);
        if (services.length) setDirectusServices(services as Service[]);
        if (testimonials.length) setDirectusTestimonials(testimonials as Testimonial[]);
        if (partnerData.length) setPartners(partnerData as Partner[]);
        setBotRate(rate);
        setBusinessRate(bizRate);
        if (posts.length) setBlogPosts(posts as BlogPost[]);
        setRatesLoading(false);
      } catch (e) {
        console.error('Fetch failed, using fallback:', e);
      } finally {
        setLoaded(true);
      }
    }
    fetchData();
  }, []);

  /* ── Fallback data ──────────────────────────────────────────────────── */

  const iconMap: Record<string, React.ReactNode> = {
    'individual': <IndividualIcon />,
    'businesspay': <BusinessPayIcon />,
    'receive-payment': <ReceivePayIcon />,
    'send-payment': <SendPayIcon />,
  };

  /* Mongolian Individual (combined Student Pay + Individual) */
  const fallbackIndividual = {
    title: 'Хувь хэрэглэгчид зориулсан үйлчилгээ',
    description: 'Хувь хүмүүст зориулсан олон улсын мөнгөн гуйвуулгын найдвартай шийдэл',
    features: ['Сургалтын төлбөр', 'Байрны түрээс', 'Хувийн хэрэглээний зардал', 'Шатахуун, замын төлбөр', 'Засвар, үйлчилгээний төлбөр', 'Aжилчдын цалин'],
    telegramLink: 'https://t.me/oyunsaio_bot',
    icon: <IndividualIcon />,
  };

  /* Mongolian Business */
  const fallbackBusiness = {
    title: 'BusinessPay',
    description: 'Байгууллагуудын төлбөр тооцооны шийдэл',
    features: ['Олон улсын гүйлгээ', 'Импортын төлбөрийн шилжүүлэг', 'Бизнес хоорондын төлбөр тооцоо'],
    telegramLink: 'https://t.me/Soyuns_aio',
    icon: <BusinessPayIcon />,
  };

  /* Russian client services (separate from business) */
  const fallbackReceive = {
    title: 'Гадаад улсаас төлбөр хүлээн авах',
    description: 'Олон улсын үйлчлүүлэгчдээс төлбөр хүлээн авах найдвартай шийдэл',
    features: ['Төлбөрийн найдвартай шилжүүлэг', 'Шуурхай гүйлгээ'],
    icon: <ReceivePayIcon />,
  };

  const fallbackSend = {
    title: 'Гадаад улс руу төлбөр төлөх',
    description: 'Импортын гэрээний дагуу гадаадын харилцагч руу төлбөр шилжүүлэх',
    features: ['Олон улсын худалдааны төлбөр', 'Импортын барааны инвойс төлөх'],
    icon: <SendPayIcon />,
  };

  const fallbackTestimonials = [
    { author: 'Хэрэглэгч', content: 'Үйлчилгээ нь маш хурдан, найдвартай. Харилцаа хандлага ч гэсэн их найрсаг, тав тухтай байдагт сэтгэл хангалуун байдаг.', rating: 5 },
    { author: 'Хэрэглэгч', content: 'Бусад газруудаас илүү шуурхай, найдвартай гэдэгт итгэлтэй болсон. Ирээдүйд улам өргөжиж хөгжөөсэй гэж хүсэж байна!', rating: 5 },
    { author: 'Хэрэглэгч', content: 'Үнэхээр хурдан, найдвартай, бас эелдэг. Баярлалаа!', rating: 5 },
  ];

  /* ── Map Directus data → display ────────────────────────────────────── */

  const mongolianIndividual = directusServices.length
    ? directusServices.filter((s) => s.category === 'client').map((s) => ({
        title: s.title, description: s.description, features: s.features ?? [],
        telegramLink: s.telegram_link, icon: iconMap[s.icon] || <IndividualIcon />,
      }))
    : [fallbackIndividual];

  const mongolianBusiness = directusServices.length
    ? directusServices.filter((s) => s.category === 'business').map((s) => ({
        title: s.title, description: s.description, features: s.features ?? [],
        telegramLink: s.telegram_link, icon: iconMap[s.icon] || <BusinessPayIcon />,
      }))
    : [fallbackBusiness];

  const russianServices = [fallbackReceive, fallbackSend];

  const testimonials = directusTestimonials.length
    ? directusTestimonials.map((t) => ({ author: t.author, content: t.content, rating: t.rating }))
    : fallbackTestimonials;

  const features = [
    { title: 'Уян хатан', description: 'Гадаад болон дотоод гүйлгээний хямд, уян хатан тариф', icon: <FlexPriceIcon />, color: 'from-blue-50 to-indigo-50' },
    { title: 'Хурдан, найдвартай', description: 'Хоромхон зуур шилжүүлэг хийгдэх найдвартай систем', icon: <SpeedIcon />, color: 'from-amber-50 to-yellow-50' },
    { title: 'Баталгаатай', description: 'Олон улсын стандартын дагуу аюулгүй үйлчилгээ', icon: <SecureIcon />, color: 'from-emerald-50 to-teal-50' },
    { title: 'Дэмжлэг', description: 'Өндөр түвшний үйлчилгээ, найдвартай гүйлгээ', icon: <SupportIcon />, color: 'from-violet-50 to-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-[#eaeaea]">
      {/* ── Hero — centered with slide-open calculator ──────────────── */}
      <section className="relative mesh-gradient text-white pt-32 pb-24 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-float-delay pointer-events-none" />

        {/* Slide-open calculator panel */}
        <AnimatePresence>
          {calcOpen && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 z-50 h-full w-full sm:w-[380px] bg-white shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <button
                  onClick={() => setCalcOpen(false)}
                  className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  Хаах
                </button>
                <ExchangeCalculator initialRate={botRate} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {calcOpen && (
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setCalcOpen(false)} />
        )}

        {/* Floating calculator button — left side */}
        <button
          onClick={() => setCalcOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-30 bg-gradient-to-b from-amber-400 to-amber-600 text-white px-3 py-5 rounded-r-xl shadow-lg hover:shadow-xl hover:px-4 transition-all duration-300 group"
          aria-label="Тооцоолуур нээх"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25v-.008Zm2.25-4.5h.008v.008H10.5v-.008Zm0 2.25h.008v.008H10.5v-.008Zm0 2.25h.008v.008H10.5v-.008Zm2.25-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H15v-.008Zm0 2.25h.008v.008H15v-.008ZM4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
          </svg>
          <span className="block text-[10px] font-bold mt-1 tracking-wide">Ханш</span>
        </button>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              2018 ОНООС 
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              OYUNS FINANCE
              <span className="block text-2xl sm:text-3xl lg:text-4xl mt-3 leading-snug font-bold text-wrap sm:text-nowrap">
                ОЛОН УЛСЫН МӨНГӨН ГУЙВУУЛГЫН ҮЙЛЧИЛГЭЭ
              </span>
            </h1>
            <p className="text-lg sm:text-xl mb-10 text-blue-100/80 max-w-2xl mx-auto leading-relaxed flex items-center justify-center gap-2">
              Илүү <span className="typewriter font-bold text-white"></span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/exchange"
                className="group bg-white text-[#2455D8] px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-white/25 hover:-translate-y-0.5 transition-all duration-300 text-base inline-flex items-center justify-center gap-2"
              >
                ВАЛЮТ СОЛИХ
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/services"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 text-base text-center"
              >
                БИДНИЙ ҮЙЛЧИЛГЭЭ
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── About Info ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">OYUNS FINANCE</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-6">Бидний тухай</h2>
            </div>
            <div className="bg-[#f7f7f7] rounded-2xl border border-gray-100 p-8 mb-8">
              <p className="text-base text-slate-600 leading-relaxed mb-5">
                <strong className="text-slate-900">OYUNS FINANCE</strong> нь 2018 оноос эхлэн олон улсын мөнгөн гуйвуулга,
                санхүүгийн үйлчилгээ, тээвэр зуучлал, карго, аялал жуулчлал зэрэг чиглэлээр
                үйл ажиллагаа явуулж ирсэн ба олон улсын болон дотоодын санхүүгийн хэрэгцээг
                хялбар, найдвартай шийдвэрлэхэд чиглэсэн санхүүгийн байгууллага юм.
              </p>
              <p className="text-base text-slate-600 leading-relaxed">
                Бид Монгол Улс болон ОХУ хоорондын мөнгөн гуйвуулга, валют солилцооны үйлчилгээг
                хялбар, шуурхай, найдвартай хүргэж ирсэн туршлагатай байгууллага бөгөөд
                хувь хүн болон байгууллагуудын санхүүгийн хэрэгцээг хангахад анхаарч ажилладаг.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {[
                { value: '2018', label: 'оноос', gradient: 'from-[#2455D8] to-[#1b40a8]' },
                { value: '10000+', label: 'гүйлгээ', gradient: 'from-[#1b40a8] to-[#1b40a8]' },
                { value: '2500+', label: 'итгэлтэй үйлчлүүлэгч', gradient: 'from-[#1b40a8] to-indigo-500' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-7 text-white text-center`}
                >
                  <div className="text-4xl font-extrabold mb-1">{stat.value}</div>
                  <p className="text-sm text-white/70">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[#2455D8] font-semibold hover:underline transition-all group"
              >
                Дэлгэрэнгүй
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#eaeaea]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
              ЯАГААД <span className="gradient-text">OYUNS FINANCE</span> ГЭЖ?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="bg-white rounded-2xl p-6 text-center card-hover border border-gray-200">
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl mb-4`}>{feature.icon}</div>
                <h3 className="text-base font-bold text-[#1a1a1a] mb-1.5">{feature.title}</h3>
                <p className="text-[#555] text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exchange Rates ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">Ханш</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">Өнөөдрийн валютын ханш</h2>
          </motion.div>

          {/* Individual rates */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a]">Хувь хэрэглэгчийн ханш</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }} className="relative bg-gradient-to-br from-[#2455D8] to-[#3d6de5] rounded-2xl p-7 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-blue-200">Худалдан авах</p>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                    </div>
                  </div>
                  <div className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-1">
                    {ratesLoading ? <span className="inline-block w-32 h-12 shimmer rounded-lg" /> : botRate ? botRate.buy_rate.toFixed(2) : '—'}
                  </div>
                  <p className="text-blue-200 text-sm">MNT / RUB</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }} className="relative bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-7 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-emerald-200">Зарах</p>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                    </div>
                  </div>
                  <div className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-1">
                    {ratesLoading ? <span className="inline-block w-32 h-12 shimmer rounded-lg" /> : botRate ? botRate.sell_rate.toFixed(2) : '—'}
                  </div>
                  <p className="text-emerald-200 text-sm">MNT / RUB</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Business rates */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a]">BusinessPay ханш</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }} className="relative bg-white border border-gray-200 rounded-2xl p-7 overflow-hidden border-l-4 border-l-[#2455D8]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-8 translate-x-8 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-[#555]">Хувь хүнээс байгууллага руу</p>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold tracking-tight mb-1 text-[#1a1a1a]">
                    {ratesLoading ? <span className="inline-block w-32 h-12 shimmer rounded-lg" /> : businessRate ? businessRate.b2c_rate.toFixed(2) : '—'}
                  </div>
                  <p className="text-[#555] text-sm">MNT / RUB</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }} className="relative bg-white border border-gray-200 rounded-2xl p-7 overflow-hidden border-l-4 border-l-cyan-600">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-full -translate-y-8 translate-x-8 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-[#555]">Байгууллагаас байгууллага руу</p>
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold tracking-tight mb-1 text-[#1a1a1a]">
                    {ratesLoading ? <span className="inline-block w-32 h-12 shimmer rounded-lg" /> : businessRate ? businessRate.b2b_rate.toFixed(2) : '—'}
                  </div>
                  <p className="text-[#555] text-sm">MNT / RUB</p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/exchange" className="inline-flex items-center gap-2 text-[#2455D8] font-semibold hover:underline transition-all group">
              Дэлгэрэнгүй ханш харах
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Монгол хэрэглэгчдэд — Хувь хүн + Байгууллага side-by-side ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">Монгол хэрэглэгчдэд зориулсан үйлчилгээ</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">Хувь хүн болон Байгууллагын гүйлгээ</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {mongolianIndividual.map((s, i) => (
              <ServiceCard key={`ind-${i}`} {...s} index={i} />
            ))}
            {mongolianBusiness.map((s, i) => (
              <ServiceCard key={`biz-${i}`} {...s} index={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Оросын хэрэглэгчдэд — visually distinct ─────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#2455D8] to-[#1b40a8] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-sm font-semibold text-cyan-300 tracking-wide uppercase mb-2">Орос хэрэглэгчдэд зориулсан үйлчилгээ</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Олон улсын төлбөр тооцоо</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {russianServices.map((s, i) => (
              <ServiceCard key={i} {...s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section className="py-20 bg-[#eaeaea]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">Хэрэглэгчдийн сэтгэгдэл</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => <TestimonialCard key={i} {...t} />)}
          </div>
        </div>
      </section>

      {/* ── Recent Blog Posts ────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">Мэдээ, мэдээлэл</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">Сүүлийн нийтлэлүүд</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(blogPosts.length > 0 ? blogPosts : [
              { id: 1, title: 'OYUNShot №10 . Мөнгө, санхүүгийн суурь мэдлэг олгох 5 ном', slug: 'oyunshot-10-finance-books', excerpt: 'Санхүүгийн мэдлэгээ дээшлүүлэхэд тань тусална.', published_date: '2025-06-18', category: 'OYUNShot' },
              { id: 2, title: 'OYUNShot №9. Хойш тавилтын зардал: "Дараа хийнэ ээ…"', slug: 'oyunshot-9-procrastination-cost', excerpt: 'Хойш тавих зуршил таны санхүүд хэрхэн нөлөөлдөг тухай.', published_date: '2025-06-11', category: 'OYUNShot' },
              { id: 3, title: 'OYUNShot №8. Санхүү + Технологи = FinTech гэж юу вэ?', slug: 'oyunshot-8-what-is-fintech', excerpt: 'FinTech буюу санхүүгийн технологийн тухай ойлголт.', published_date: '2025-06-04', category: 'OYUNShot' },
            ] as Array<{id: number; title: string; slug: string; excerpt: string; published_date: string; category: string; featured_image?: string}>).slice(0, 3).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-[#f7f7f7] rounded-2xl border border-gray-100 overflow-hidden card-hover"
              >
                <div className="h-44 relative overflow-hidden">
                  {post.featured_image ? (
                    <img src={assetUrl(post.featured_image)} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500" />
                  )}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-xs font-semibold text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <time className="text-xs text-slate-400 font-medium">
                    {new Date(post.published_date).toLocaleDateString('mn-MN')}
                  </time>
                  <h3 className="text-base font-bold text-slate-900 mt-2 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-semibold group/link">
                    Дэлгэрэнгүй үзэх
                    <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/blog" className="inline-flex items-center gap-2 bg-[#2455D8] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm">
              Бүх нийтлэл үзэх
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      {partners.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">Хамтран ажиллагч байгууллагууд</h2>
            </motion.div>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {partners.map((partner, i) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  {partner.url ? (
                    <a href={partner.url} target="_blank" rel="noopener noreferrer" className="block grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300" title={partner.name}>
                      <img
                        src={assetUrl(partner.logo)}
                        alt={partner.name}
                        className="h-12 md:h-14 w-auto object-contain"
                      />
                    </a>
                  ) : (
                    <div className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300" title={partner.name}>
                      <img
                        src={assetUrl(partner.logo)}
                        alt={partner.name}
                        className="h-12 md:h-14 w-auto object-contain"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="relative py-20 mesh-gradient text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b40a8]/50 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Өдөр бүрийн ханш ба зах зээлийн тойм мэдээ авах:</h2>
            <p className="text-blue-100/80 text-lg mb-8 max-w-xl mx-auto">Бидний телеграм сувгийг дагаж валютын ханшийн мэдээлэл аваарай!</p>
            <a href="https://t.me/oyuns_alo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-[#2455D8] px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-white/25 hover:-translate-y-0.5 transition-all duration-300 text-base">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Телеграм суваг
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
