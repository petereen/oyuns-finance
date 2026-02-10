'use client';

import { motion } from 'framer-motion';
import ServiceCard from '@/components/ServiceCard';

export default function ServicesPage() {
  const allServices = [
    {
      title: 'Student Pay',
      description: 'Гадаадад суралцаж буй оюутнуудад зориулсан хялбар, найдвартай мөнгөн шилжүүлэг',
      features: ['Сургалтын төлбөр', 'Байрны түрээс', 'Хувийн хэрэглээний зардал'],
      telegramLink: 'https://t.me/oyunsaio_bot',
      icon: (
        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: 'DrivePay',
      description: 'Алсын тээврийн жолооч нарын мөнгөн гүйлгээг хялбар болгох шийдэл',
      features: ['Шатахуун, замын төлбөр', 'Засвар үйлчилгээний төлбөр', 'Ажилчдын цалин'],
      telegramLink: 'http://t.me/oyuns_drivepaybot',
      icon: (
        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'BusinessPay',
      description: 'Байгууллагуудын төлбөр тооцооны шийдэл',
      features: ['Олон улсын гүйлгээ', 'Импортын төлбөрийн шилжүүлэг', 'Бизнес хоорондын төлбөр тооцоо'],
      telegramLink: 'https://t.me/Soyuns_aio',
      icon: (
        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Гадаад улсаас төлбөр хүлээн авах',
      description: 'Олон улсын үйлчлүүлэгчдээс төлбөр хүлээн авах найдвартай шийдэл',
      features: ['Төлбөрийн найдвартай шилжүүлэг', 'Шуурхай гүйлгээ', 'Олон төрлийн валют дэмжлэг'],
      icon: (
        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
    },
    {
      title: 'Гадаад улс руу төлбөр төлөх',
      description: 'Импортын гэрээний дагуу гадаадын харилцагч руу төлбөр шилжүүлэх',
      features: ['Олон улсын худалдааны төлбөр', 'Импортын барааны инвойс төлөх', 'Хурдан баталгаажуулалт'],
      icon: (
        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h2m3-4H9a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-1m-1 4l-3 3m0 0l-3-3m3 3V3" />
        </svg>
      ),
    },
  ];

  const whyChoose = [
    {
      title: 'Уян хатан тариф',
      desc: 'Гадаад болон дотоод гүйлгээний хямд, уян хатан үнийн санал',
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-blue-50',
    },
    {
      title: 'Хурдан гүйлгээ',
      desc: 'Хоромхон зуур шилжүүлэг хийгдэх найдвартай систем',
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'bg-amber-50',
    },
    {
      title: 'Баталгаатай',
      desc: 'Олон улсын стандартын дагуу аюулгүй, баталгаатай үйлчилгээ',
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'bg-emerald-50',
    },
    {
      title: '24/7 дэмжлэг',
      desc: 'Өндөр түвшний үйлчилгээ, найдвартай харилцаа',
      icon: (
        <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'bg-violet-50',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-2">Үйлчилгээ</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">
            Бидний үйлчилгээ
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Хувь хүн болон байгууллагад зориулсан олон улсын мөнгөн гуйвуулгын иж бүрэн шийдэл
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {allServices.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </div>

        {/* Why Choose Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-gray-100 p-8 md:p-12"
        >
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-2">Давуу тал</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Яагаад биднийг сонгох вэ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whyChoose.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`flex-shrink-0 w-11 h-11 ${item.color} rounded-xl flex items-center justify-center`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
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
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Бидэнтэй хамтран ажиллахад бэлэн үү?
            </h2>
            <p className="text-lg mb-8 text-blue-100/80 max-w-xl mx-auto">
              Танай бизнес эсвэл хувийн санхүүгийн хэрэгцээнд тохирсон шийдлийг олоорой
            </p>
            <a
              href="https://t.me/oyuns_aio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 hover:shadow-xl hover:shadow-white/10 transition-all duration-300 text-base"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 3.767-1.362 5.001-.169.523-.506.697-.83.715-.704.031-1.237-.465-1.918-.912-.964-.633-1.508-1.028-2.447-1.647-.951-.627-.334-1.098.208-1.735.142-.164 2.606-2.389 2.652-2.592.006-.025.011-.117-.043-.166-.054-.049-.133-.033-.19-.019-.079.019-1.339.851-3.781 2.5-.358.246-.682.366-.973.36-.32-.006-.936-.181-1.395-.329-.563-.181-1.009-.277-1.086-.299-.167-.046-.252-.088-.252-.183 0-.074.057-.149.172-.225.641-.423 1.64-1.056 2.987-1.9.984-.615 2.149-1.314 3.487-2.097.284-.166.567-.333.85-.499.117-.069.234-.068.35.002.116.069.174.183.174.315z"/>
              </svg>
              Холбогдох
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
