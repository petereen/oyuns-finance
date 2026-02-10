'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// This will be replaced with actual Directus data
const blogPosts = [
  {
    id: 1,
    title: 'OYUNShot №10 . Мөнгө, санхүүгийн суурь мэдлэг олгох 5 ном',
    slug: 'oyunshot-10-finance-books',
    excerpt: 'Санхүүгийн мэдлэгээ дээшлүүлэхэд тань тусална.',
    published_date: '2025-06-18',
    category: 'OYUNShot',
  },
  {
    id: 2,
    title: 'OYUNShot №9. Хойш тавилтын зардал: "Дараа хийнэ ээ…" гэж хэлэх бүртээ та юуг алддаг вэ?',
    slug: 'oyunshot-9-procrastination-cost',
    excerpt: 'Хойш тавих зуршил таны санхүүд хэрхэн нөлөөлдөг тухай.',
    published_date: '2025-06-11',
    category: 'OYUNShot',
  },
  {
    id: 3,
    title: 'OYUNShot №8. Санхүү + Технологи = FinTech гэж юу вэ?',
    slug: 'oyunshot-8-what-is-fintech',
    excerpt: 'FinTech буюу санхүүгийн технологийн тухай ойлголт.',
    published_date: '2025-06-04',
    category: 'OYUNShot',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-2">Блог</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-3">
            Мэдээ, мэдээлэл
          </h1>
          <p className="text-lg text-slate-500">
            Санхүү, бизнес, технологийн тухай сонирхолтой нийтлэлүүд
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover"
            >
              <div className="h-44 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 relative overflow-hidden">
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
                <h2 className="text-base font-bold text-slate-900 mt-2 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-semibold group/link"
                >
                  Дэлгэрэнгүй үзэх
                  <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Newsletter CTA */}
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
              Өдөр бүрийн ханш ба зах зээлийн тойм мэдээ авах
            </h2>
            <p className="text-lg mb-8 text-blue-100/80 max-w-xl mx-auto">
              Санхүүгийн мэдээллээ цаг тухайд нь авч, ухаалаг шийдвэр гаргаарай
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
              Telegram-д нэгдэх
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
