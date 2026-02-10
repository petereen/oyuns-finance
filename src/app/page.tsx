'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ServiceCard from '@/components/ServiceCard';
import TestimonialCard from '@/components/TestimonialCard';

export default function Home() {
  const clientServices = [
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
  ];

  const businessServices = [
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
      features: ['Төлбөрийн найдвартай шилжүүлэг', 'Шуурхай гүйлгээ'],
      icon: (
        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
    },
    {
      title: 'Гадаад улс руу төлбөр төлөх',
      description: 'Импортын гэрээний дагуу гадаадын харилцагч руу төлбөр шилжүүлэх',
      features: ['Олон улсын худалдааны төлбөр', 'Импортын барааны инвойс төлөх'],
      icon: (
        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h2m3-4H9a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-1m-1 4l-3 3m0 0l-3-3m3 3V3" />
        </svg>
      ),
    },
  ];

  const testimonials = [
    {
      author: 'Хэрэглэгч',
      content: 'Үйлчилгээ нь маш хурдан, найдвартай. Харилцаа хандлага ч гэсэн их найрсаг, тав тухтай байдагт сэтгэл хангалуун байдаг.',
      rating: 5,
    },
    {
      author: 'Хэрэглэгч',
      content: 'Бусад газруудаас илүү шуурхай, найдвартай гэдэгт итгэлтэй болсон. Ирээдүйд улам өргөжиж хөгжөөсэй гэж хүсэж байна!',
      rating: 5,
    },
    {
      author: 'Хэрэглэгч',
      content: 'Үнэхээр хурдан, найдвартай, бас эелдэг. Баярлалаа!',
      rating: 5,
    },
  ];

  const features = [
    {
      title: 'Уян хатан',
      description: 'Гадаад болон дотоод гүйлгээний хямд, уян хатан тариф',
      icon: (
        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-blue-50 to-indigo-50',
    },
    {
      title: 'Хурдан, найдвартай',
      description: 'Хоромхон зуур шилжүүлэг хийгдэх найдвартай систем',
      icon: (
        <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-amber-50 to-yellow-50',
    },
    {
      title: 'Баталгаатай',
      description: 'Олон улсын стандартын дагуу аюулгүй үйлчилгээ',
      icon: (
        <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'from-emerald-50 to-teal-50',
    },
    {
      title: 'Дэмжлэг',
      description: 'Өндөр түвшний үйлчилгээ, найдвартай гүйлгээ',
      icon: (
        <svg className="w-7 h-7 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'from-violet-50 to-purple-50',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section — mesh gradient */}
      <section className="relative mesh-gradient text-white pt-32 pb-24 overflow-hidden">
        {/* Floating decorative shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-float-delay pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              2018 оноос найдвартай үйлчилгээ
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              Олон улсын мөнгөн
              <br />
              <span className="text-cyan-300">гуйвуулгын үйлчилгээ</span>
            </h1>
            <p className="text-lg sm:text-xl mb-10 text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
              Таны найдвартай санхүүгийн түнш. Хурдан, найдвартай, хямд.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/exchange"
                className="group bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 hover:shadow-xl hover:shadow-white/10 transition-all duration-300 text-base inline-flex items-center justify-center gap-2"
              >
                Валют солих
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/services"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 text-base"
              >
                Үйлчилгээ үзэх
              </Link>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { value: '2018', label: 'Оноос' },
              { value: '1000+', label: 'Хэрэглэгч' },
              { value: '5+', label: 'Үйлчилгээ' },
            ].map((stat, i) => (
              <div key={i} className="text-center bg-white/5 backdrop-blur-sm rounded-xl py-4 border border-white/10">
                <div className="text-2xl font-extrabold">{stat.value}</div>
                <div className="text-xs text-blue-200 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-2">Давуу тал</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Яагаад <span className="gradient-text">OYUNS FINANCE</span>?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 text-center card-hover border border-gray-100"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-2">Хувь хүн</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Монгол хэрэглэгчдэд зориулсан
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clientServices.map((service, index) => (
              <ServiceCard key={index} {...service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Business Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-2">Байгууллага</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Байгууллагуудад зориулсан
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessServices.map((service, index) => (
              <ServiceCard key={index} {...service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-2">Сэтгэгдэл</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Хэрэглэгчдийн сэтгэгдэл
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 mesh-gradient text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Өдөр бүрийн ханш ба зах зээлийн мэдээ авах
            </h2>
            <p className="text-blue-100/80 text-lg mb-8 max-w-xl mx-auto">
              Бидний валютын ханшийн хуудаснаас шинэчлэгдсэн мэдээллийг харна уу
            </p>
            <Link
              href="/exchange"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 hover:shadow-xl hover:shadow-white/10 transition-all duration-300 text-base"
            >
              Ханш үзэх
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
