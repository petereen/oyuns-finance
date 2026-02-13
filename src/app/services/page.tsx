'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ServiceCard from '@/components/ServiceCard';
import { getServices, type Service } from '@/lib/directus';

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

/* ── Why‑choose icons ────────────────────────────────────────────────── */

const FlexIcon = () => (
  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
  </svg>
);

export default function ServicesPage() {
  const [directusServices, setDirectusServices] = useState<Service[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const services = await getServices();
        if (services.length) setDirectusServices(services as Service[]);
      } catch (e) {
        console.error('Directus fetch failed, using fallback:', e);
      }
    }
    fetchData();
  }, []);

  const iconMap: Record<string, React.ReactNode> = {
    'individual': <IndividualIcon />,
    'businesspay': <BusinessPayIcon />,
    'receive-payment': <ReceivePayIcon />,
    'send-payment': <SendPayIcon />,
  };

  /* ── Mongolian Individual (combined Student Pay + Individual) ──────── */
  const fallbackIndividual = {
    title: 'Хувь хэрэглэгчид зориулсан үйлчилгээ',
    description: 'Хувь хүмүүст зориулсан олон улсын мөнгөн гуйвуулгын найдвартай шийдэл',
    features: ['Сургалтын төлбөр', 'Байрны түрээс', 'Хувийн хэрэглээний зардал', 'Шатахуун, замын төлбөр', 'Засвар, үйлчилгээний төлбөр', 'Aжилчдын цалин'],
    telegramLink: 'https://t.me/oyunsaio_bot',
    icon: <IndividualIcon />,
  };

  /* ── Mongolian Business ────────────────────────────────────────────── */
  const fallbackBusiness = {
    title: 'BusinessPay',
    description: 'Байгууллагуудын төлбөр тооцооны шийдэл',
    features: ['Олон улсын гүйлгээ', 'Импортын төлбөрийн шилжүүлэг', 'Бизнес хоорондын төлбөр тооцоо'],
    telegramLink: 'https://t.me/Soyuns_aio',
    icon: <BusinessPayIcon />,
  };

  /* ── Russian client services (separate section) ────────────────────── */
  const fallbackReceive = {
    title: 'Гадаад улсаас төлбөр хүлээн авах',
    description: 'Гадаадын харилцагчаас мөнгө хүлээн авахад хялбар шийдэл',
    features: ['Олон улсын үйлчлүүлэгчдээс төлбөр хүлээн авах', ' Төлбөрийн найдвартай, шуурхай шилжүүлэг'],
    icon: <ReceivePayIcon />,
  };

  const fallbackSend = {
    title: 'Гадаад улс руу төлбөр төлөх',
    description: 'Импортын гэрээний дагуу гадаадын харилцагч руу төлбөр шилжүүлэх',
    features: ['Олон улсын худалдааны төлбөр', 'Импортын барааны инвойс төлөх'],
    icon: <SendPayIcon />,
  };

  /* ── Build display arrays ──────────────────────────────────────────── */
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

  const whyChoose = [
    { title: 'Уян хатан', desc: 'Гадаад болон дотоод гүйлгээний хямд, уян хатан үнийн тариф', icon: <FlexIcon />, color: 'bg-blue-50' },
    { title: 'Хурдан, найдвартай гүйлгээ', desc: 'Хоромхон зуур шилжүүлэг хийгдэх найдвартай систем', icon: <ClockIcon />, color: 'bg-amber-50' },
    { title: 'Баталгаатай', desc: 'Олон улсын стандартын дагуу аюулгүй, баталгаатай үйлчилгээ', icon: <LockIcon />, color: 'bg-emerald-50' },
    { title: 'Хэрэглэгчийн дэмжлэг', desc: 'Өндөр түвшний үйлчилгээ, найдвартай харилцаа', icon: <ChatIcon />, color: 'bg-violet-50' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#eaeaea]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">Үйлчилгээ</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4">
            Бидний үйлчилгээ
          </h1>
          <p className="text-lg text-[#555] max-w-2xl mx-auto">
            Хувь хүн болон байгууллагад зориулсан олон улсын мөнгөн гуйвуулгын иж бүрэн шийдэл
          </p>
        </motion.div>

        {/* ── Монгол хэрэглэгчдэд — Хувь хүн + Байгууллага side-by-side ── */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-8">
              <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-1">Монгол хэрэглэгчдэд</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">Монгол хэрэглэгчдэд зориулсан үйлчилгээ</h2>
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
        </div>

        {/* ── Оросын хэрэглэгчдэд — visually distinct ───────────────── */}
        <div className="mb-16 bg-gradient-to-br from-[#2455D8] to-[#1b40a8] rounded-2xl p-8 md:p-12">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-8">
            <p className="text-sm font-semibold text-cyan-300 tracking-wide uppercase mb-1">Орос хэрэглэгчдэд зориулсан үйлчилгээ</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Олон улсын төлбөр тооцоо</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {russianServices.map((s, i) => (
              <ServiceCard key={i} {...s} index={i} />
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12"
        >
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">Давуу тал</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
              Яагаад биднийг сонгох вэ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whyChoose.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#eaeaea] transition-colors">
                <div className={`flex-shrink-0 w-11 h-11 ${item.color} rounded-xl flex items-center justify-center`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1a1a1a] mb-1">{item.title}</h3>
                  <p className="text-sm text-[#555] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 relative mesh-gradient rounded-2xl p-8 md:p-12 text-center text-white overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b40a8]/30 to-transparent pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Бидэнтэй хамтран ажиллахад бэлэн үү?
            </h2>
            <p className="text-lg mb-8 text-blue-100/80 max-w-xl mx-auto">
              Таны бизнес эсвэл хувийн санхүүгийн хэрэгцээнд тохирсон шийдлийг яг одоо олоорой!
            </p>
            <a
              href="https://t.me/Soyuns_aio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#2455D8] px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-white/25 hover:-translate-y-0.5 transition-all duration-300 text-base"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Холбогдох
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
