'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPartners, assetUrl, type Partner } from '@/lib/directus';

export default function AboutPage() {
  const params = useParams();
  const lang = params.lang as 'mn' | 'ru';
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPartners();
        if (data.length) setPartners(data as Partner[]);
      } catch (e) {
        console.error('Partners fetch failed:', e);
      }
    }
    load();
  }, []);

  const t = {
    mn: {
      header_sub: 'OYUNS ALL-IN-ONE',
      header_title: 'Бидний тухай',
      text_1: (
        <>
          <strong className="text-slate-900">OYUNS ALL-IN-ONE</strong> нь 2018 оноос эхлэн олон улсын мөнгөн гуйвуулга,
          санхүүгийн үйлчилгээ, тээвэр зуучлал, карго, аялал жуулчлал зэрэг чиглэлээр
          үйл ажиллагаа явуулж ирсэн ба олон улсын болон дотоодын санхүүгийн хэрэгцээг
          хялбар, найдвартай шийдвэрлэхэд чиглэсэн санхүүгийн байгууллага юм.
        </>
      ),
      text_2: 'Бид Монгол Улс болон ОХУ хоорондын мөнгөн гуйвуулга, валют солилцооны үйлчилгээг хялбар, шуурхай, найдвартай хүргэж ирсэн туршлагатай байгууллага бөгөөд хувь хүн болон байгууллагуудын санхүүгийн хэрэгцээг хангахад анхаарч ажилладаг.',
      values: {
        innovation: { title: 'Инноваци', desc: 'Технологийн дэвшлийг ашиглан үйлчилгээг сайжруулах' },
        quality: { title: 'Чанар', desc: 'Өндөр түвшний үйлчилгээ, найдвартай гүйлгээ' },
        integrity: { title: 'Шударга байдал', desc: 'Итгэлцэл, ил тод байдлыг эрхэмлэнэ' },
        satisfaction: { title: 'Харилцагчийн сэтгэл ханамж', desc: 'Хэрэглэгчийн хэрэгцээнд нийцсэн шийдлийг санал болгоно' }
      },
      stats: { since: 'оноос', transactions: 'гүйлгээ', customers: 'харилцагч' },
      partners_title: 'Бидний хамтрагчид',
      cta_title: 'Бидэнтэй хамтран ажиллахад бэлэн үү?',
      cta_desc: 'Таны санхүүгийн хэрэгцээнд тохирсон шийдлийг олоорой',
      cta_btn: 'Холбогдох'
    },
    ru: {
      header_sub: 'OYUNS ALL-IN-ONE',
      header_title: 'О нас',
      text_1: (
        <>
          <strong className="text-slate-900">OYUNS ALL-IN-ONE</strong> предоставляет услуги международных денежных переводов,
          финансовых услуг, грузоперевозок и туризма с 2018 года. Мы — финансовая организация, нацеленная на простое и надежное
          решение международных и местных финансовых потребностей.
        </>
      ),
      text_2: 'Мы имеем большой опыт в предоставлении простых, быстрых и надежных услуг по переводу денег и обмену валюты между Монголией и Россией, уделяя особое внимание финансовым потребностям частных лиц и организаций.',
      values: {
        innovation: { title: 'Инновации', desc: 'Улучшение услуг с использованием технологий' },
        quality: { title: 'Качество', desc: 'Высокий уровень обслуживания и надежные транзакции' },
        integrity: { title: 'Честность', desc: 'Доверие и прозрачность' },
        satisfaction: { title: 'Удовлетворенность клиентов', desc: 'Решения, отвечающие потребностям клиентов' }
      },
      stats: { since: 'года', transactions: 'транзакций', customers: 'клиентов' },
      partners_title: 'Наши партнеры',
      cta_title: 'Готовы сотрудничать с нами?',
      cta_desc: 'Найдите решение для ваших финансовых потребностей',
      cta_btn: 'Связаться'
    }
  };

  const content = t[lang] || t.mn;

  const values = [
    {
      title: content.values.innovation.title,
      desc: content.values.innovation.desc,
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-blue-50',
    },
    {
      title: content.values.quality.title,
      desc: content.values.quality.desc,
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'bg-amber-50',
    },
    {
      title: content.values.integrity.title,
      desc: content.values.integrity.desc,
      icon: (
        <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'bg-violet-50',
    },
    {
      title: content.values.satisfaction.title,
      desc: content.values.satisfaction.desc,
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'bg-emerald-50',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#eaeaea]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="mb-10">
            <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">{content.header_sub}</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4">
              {content.header_title}
            </h1>
          </div>

          {/* About text */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
            <p className="text-base text-slate-600 leading-relaxed mb-5">
              {content.text_1}
            </p>
            <p className="text-base text-slate-600 leading-relaxed">
              {content.text_2}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              { value: '2018', label: content.stats.since, gradient: 'from-[#2455D8] to-[#1b40a8]' },
              { value: '15000+', label: content.stats.transactions, gradient: 'from-[#1b40a8] to-[#1b40a8]' },
              { value: '5000+', label: content.stats.customers, gradient: 'from-[#1b40a8] to-[#2455D8]' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-2xl text-white text-center shadow-lg shadow-blue-900/10`}
              >
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          
          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {values.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Partners */}
          {partners.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="bg-white rounded-2xl border border-gray-100 p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">{content.partners_title}</h2>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {partners.map((partner) => (
                  <div key={partner.id}>
                    {partner.url ? (
                      <a href={partner.url} target="_blank" rel="noopener noreferrer" className="block grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300" title={partner.name}>
                        <img src={assetUrl(partner.logo)} alt={partner.name} className="h-12 md:h-14 w-auto object-contain" />
                      </a>
                    ) : (
                      <div className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300" title={partner.name}>
                        <img src={assetUrl(partner.logo)} alt={partner.name} className="h-12 md:h-14 w-auto object-contain" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="relative mesh-gradient rounded-2xl p-8 md:p-12 text-center text-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
                {content.cta_title}
              </h2>
              <p className="text-lg mb-6 text-blue-100/80 max-w-xl mx-auto">
                {content.cta_desc}
              </p>
              <a
                href="https://t.me/oyunsaio_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#2455D8] px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-white/25 hover:-translate-y-0.5 transition-all duration-300 text-base"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                {content.cta_btn}
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
