'use client';

import { motion } from 'framer-motion';

export default function AboutPage() {
  const values = [
    {
      title: 'Найдвартай байдал',
      desc: 'Хэрэглэгчийн итгэл, найдвараа хүлээх нь бидний үндсэн үнэт зүйл',
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-blue-50',
    },
    {
      title: 'Хурд',
      desc: 'Цаг хугацаа хэмнэх, шуурхай үйлчилгээ үзүүлэх',
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'bg-amber-50',
    },
    {
      title: 'Хэрэглэгч төвтэй',
      desc: 'Хэрэглэгчийн хэрэгцээ, санал хүсэлтийг хүндэтгэх',
      icon: (
        <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'bg-violet-50',
    },
    {
      title: 'Аюулгүй байдал',
      desc: 'Өндөр түвшний аюулгүй байдал, хувийн мэдээллийн хамгаалалт',
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'bg-emerald-50',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="mb-10">
            <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-2">Бидний тухай</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">
              Бидний тухай
            </h1>
          </div>

          {/* About text */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
            <p className="text-base text-slate-600 leading-relaxed mb-5">
              <strong className="text-slate-900">OYUNS FINANCE</strong> нь 2018 оноос эхлэн олон улсын мөнгөн гуйвуулга,
              санхүүгийн үйлчилгээ, тээвэр зуучлал, карго, аялал жуулчлал зэрэг чиглэлээр
              үйл ажиллагаа явуулж ирсэн ба олон улсын болон дотоодын санхүүгийн хэрэгцээг
              хялбар, найдвартай шийдвэрлэхэд чиглэсэн санхүүгийн байгууллага юм.
            </p>
            <p className="text-base text-slate-600 leading-relaxed">
              Бид Монгол, Орос хоорондын мөнгөн гуйвуулга, валют солилцооны үйлчилгээг
              хялбар, шуурхай, найдвартай хүргэж ирсэн туршлагатай байгууллага бөгөөд
              хувь хүн болон байгууллагуудын санхүүгийн хэрэгцээг хангахад анхаарч ажилладаг.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              { value: '2018', label: 'Байгуулагдсан он', gradient: 'from-blue-600 to-blue-700' },
              { value: '5+', label: 'Үйлчилгээний төрөл', gradient: 'from-emerald-600 to-emerald-700' },
              { value: '1000+', label: 'Итгэлтэй үйлчлүүлэгч', gradient: 'from-violet-600 to-violet-700' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-7 text-white text-center`}
              >
                <div className="text-4xl font-extrabold mb-1">{stat.value}</div>
                <p className="text-sm text-white/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 mb-8"
          >
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Бидний алсын хараа</h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Олон улсын санхүүгийн үйлчилгээг цахим технологийн хамт хослуулан,
              хэрэглэгч нарт хамгийн хялбар, найдвартай, хурдан үйлчилгээг хүргэх,
              санхүүгийн салбарын тэргүүлэгч байгууллага болох.
            </p>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 mb-8"
          >
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Бидний үнэт зүйлс</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {values.map((item, i) => (
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
                Бидэнтэй хамтран ажиллахад бэлэн үү?
              </h2>
              <p className="text-lg mb-6 text-blue-100/80 max-w-xl mx-auto">
                Таны санхүүгийн хэрэгцээнд тохирсон шийдлийг олоорой
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
        </motion.div>
      </div>
    </div>
  );
}
