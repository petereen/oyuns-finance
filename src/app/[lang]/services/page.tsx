'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
  const params = useParams();
  const lang = params.lang as 'mn' | 'ru';
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

  const t = {
    mn: {
      title_sub: 'Үйлчилгээ',
      title_main: 'Бидний үйлчилгээ',
      title_desc: 'Хувь хүн болон байгууллагад зориулсан олон улсын мөнгөн гуйвуулгын иж бүрэн шийдэл',
      mn_client_sub: 'Монгол хэрэглэгчдэд',
      mn_client_title: 'Монгол хэрэглэгчдэд зориулсан үйлчилгээ',
      ru_client_sub: 'Орос хэрэглэгчдэд зориулсан үйлчилгээ',
      ru_client_title: 'Олон улсын төлбөр тооцоо',
      why_sub: 'Давуу тал',
      why_title: 'Яагаад биднийг сонгох вэ?',
      why_items: {
        flex: { title: 'Уян хатан', desc: 'Гадаад болон дотоод гүйлгээний хямд, уян хатан үнийн тариф' },
        fast: { title: 'Хурдан, найдвартай гүйлгээ', desc: 'Хоромхон зуур шилжүүлэг хийгдэх найдвартай систем' },
        secure: { title: 'Баталгаатай', desc: 'Олон улсын стандартын дагуу аюулгүй, баталгаатай үйлчилгээ' },
        support: { title: 'Хэрэглэгчийн дэмжлэг', desc: 'Өндөр түвшний үйлчилгээ, найдвартай харилцаа' }
      },
      fallback_ind: {
        title: 'Хувь хэрэглэгчид зориулсан үйлчилгээ',
        desc: 'Хувь хүмүүст зориулсан олон улсын мөнгөн гуйвуулгын найдвартай шийдэл',
        features: ['Сургалтын төлбөр', 'Байрны түрээс', 'Хувийн хэрэглээний зардал', 'Шатахуун, замын төлбөр', 'Засвар, үйлчилгээний төлбөр', 'Aжилчдын цалин']
      },
      fallback_biz: {
        title: 'BusinessPay',
        desc: 'Байгууллагуудын төлбөр тооцооны шийдэл',
        features: ['Олон улсын гүйлгээ', 'Импортын төлбөрийн шилжүүлэг', 'Бизнес хоорондын төлбөр тооцоо']
      },
      fallback_receive: {
        title: 'Гадаад улсаас төлбөр хүлээн авах',
        desc: 'Гадаадын харилцагчаас мөнгө хүлээн авахад хялбар шийдэл',
        features: ['Олон улсын үйлчлүүлэгчдээс төлбөр хүлээн авах', 'Төлбөрийн найдвартай, шуурхай шилжүүлэг']
      },
      fallback_send: {
        title: 'Гадаад улс руу төлбөр төлөх',
        desc: 'Импортын гэрээний дагуу гадаадын харилцагч руу төлбөр шилжүүлэх',
        features: ['Олон улсын худалдааны төлбөр', 'Импортын барааны инвойс төлөх']
      }
    },
    ru: {
      title_sub: 'Услуги',
      title_main: 'Наши услуги',
      title_desc: 'Комплексные решения международных денежных переводов для частных лиц и организаций',
      mn_client_sub: 'Для клиентов из Монголии',
      mn_client_title: 'Услуги для монгольских клиентов',
      ru_client_sub: 'Для клиентов из России',
      ru_client_title: 'Международные платежи',
      why_sub: 'Преимущества',
      why_title: 'Почему выбирают нас?',
      why_items: {
        flex: { title: 'Гибкость', desc: 'Дешевые и гибкие тарифы на внешние и внутренние транзакции' },
        fast: { title: 'Быстрые и надежные транзакции', desc: 'Надежная система мгновенных переводов' },
        secure: { title: 'Гарантировано', desc: 'Безопасные и гарантированные услуги по международным стандартам' },
        support: { title: 'Поддержка клиентов', desc: 'Высокий уровень обслуживания и надежные отношения' }
      },
      fallback_ind: {
        title: 'Услуги для частных лиц',
        desc: 'Надежные решения международных денежных переводов для частных лиц',
        features: ['Оплата обучения', 'Аренда жилья', 'Личные расходы', 'Топливо, дорожные сборы', 'Ремонт и обслуживание', 'Зарплата сотрудников']
      },
      fallback_biz: {
        title: 'BusinessPay',
        desc: 'Платежные решения для организаций',
        features: ['Международные транзакции', 'Импортные платежи', 'B2B расчеты']
      },
      fallback_receive: {
        title: 'Прием платежей из-за рубежа',
        desc: 'Простое решение для получения денег от иностранных клиентов',
        features: ['Прием платежей от международных клиентов', 'Надежные и быстрые переводы']
      },
      fallback_send: {
        title: 'Платежи за рубеж',
        desc: 'Перевод средств иностранным контрагентам по импортным контрактам',
        features: ['Платежи по международной торговле', 'Оплата инвойсов за импортные товары']
      }
    }
  };

  const content = t[lang] || t.mn;

  const iconMap: Record<string, React.ReactNode> = {
    'individual': <IndividualIcon />,
    'businesspay': <BusinessPayIcon />,
    'receive-payment': <ReceivePayIcon />,
    'send-payment': <SendPayIcon />,
  };

  /* ── Mongolian Individual (combined Student Pay + Individual) ──────── */
  const fallbackIndividual = {
    title: content.fallback_ind.title,
    description: content.fallback_ind.desc,
    features: content.fallback_ind.features,
    telegramLink: 'https://t.me/oyunsaio_bot',
    icon: <IndividualIcon />,
  };

  /* ── Mongolian Business ────────────────────────────────────────────── */
  const fallbackBusiness = {
    title: content.fallback_biz.title,
    description: content.fallback_biz.desc,
    features: content.fallback_biz.features,
    telegramLink: 'https://t.me/Soyuns_aio',
    icon: <BusinessPayIcon />,
  };

  /* ── Russian client services (separate section) ────────────────────── */
  const fallbackReceive = {
    title: content.fallback_receive.title,
    description: content.fallback_receive.desc,
    features: content.fallback_receive.features,
    icon: <ReceivePayIcon />,
  };

  const fallbackSend = {
    title: content.fallback_send.title,
    description: content.fallback_send.desc,
    features: content.fallback_send.features,
    icon: <SendPayIcon />,
  };

  /* ── Build display arrays ──────────────────────────────────────────── */
  // Note: if directus has data, we might show Mongolian there if we don't translate dynamic content.
  // For now, let's mix or prioritize fallback if we want forced current language, but standard is fetching.
  // Assuming directus content is MN only, we use fallback for RU (or for both if we want full control).
  // Strategy: If language is RU, force fallback structure to show translated content.
  // If language is MN, try directus, else fallback.

  const useDirectus = lang === 'mn' && directusServices.length > 0;

  const mongolianIndividual = useDirectus
    ? directusServices.filter((s) => s.category === 'client').map((s) => ({
        title: s.title, description: s.description, features: s.features ?? [],
        telegramLink: s.telegram_link, icon: iconMap[s.icon] || <IndividualIcon />,
      }))
    : [fallbackIndividual];

  const mongolianBusiness = useDirectus
    ? directusServices.filter((s) => s.category === 'business').map((s) => ({
        title: s.title, description: s.description, features: s.features ?? [],
        telegramLink: s.telegram_link, icon: iconMap[s.icon] || <BusinessPayIcon />,
      }))
    : [fallbackBusiness];

  const russianServices = [fallbackReceive, fallbackSend];

  const whyChoose = [
    { title: content.why_items.flex.title, desc: content.why_items.flex.desc, icon: <FlexIcon />, color: 'bg-blue-50' },
    { title: content.why_items.fast.title, desc: content.why_items.fast.desc, icon: <ClockIcon />, color: 'bg-amber-50' },
    { title: content.why_items.secure.title, desc: content.why_items.secure.desc, icon: <LockIcon />, color: 'bg-emerald-50' },
    { title: content.why_items.support.title, desc: content.why_items.support.desc, icon: <ChatIcon />, color: 'bg-violet-50' },
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
          <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">{content.title_sub}</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4">
            {content.title_main}
          </h1>
          <p className="text-lg text-[#555] max-w-2xl mx-auto">
            {content.title_desc}
          </p>
        </motion.div>

        {/* ── Монгол хэрэглэгчдэд — Хувь хүн + Байгууллага side-by-side ── */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-8">
              <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-1">{content.mn_client_sub}</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">{content.mn_client_title}</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {mongolianIndividual.map((s, i) => (
                <ServiceCard key={ind-} {...s} index={i} />
              ))}
              {mongolianBusiness.map((s, i) => (
                <ServiceCard key={iz-} {...s} index={i + 1} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Оросын хэрэглэгчдэд — visually distinct ───────────────── */}
        <div className="mb-16 bg-gradient-to-br from-[#2455D8] to-[#1b40a8] rounded-2xl p-8 md:p-12">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-8">
            <p className="text-sm font-semibold text-cyan-300 tracking-wide uppercase mb-1">{content.ru_client_sub}</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{content.ru_client_title}</h2>
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
            <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">{content.why_sub}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
              {content.why_title}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChoose.map((item, index) => (
              <div key={index} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className={w-12 h-12 rounded-xl mb-4 flex items-center justify-center }>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
