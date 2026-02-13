'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Added
import { getBlogPosts, assetUrl, type BlogPost } from '@/lib/directus';

// Fallback data used when Directus has no blog_posts yet
const fallbackPosts = [
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
    title: 'OYUNShot №9. Хойш тавилтын зардал: ""Дараа хийнэ ээ…"" гэж хэлэх бүртээ та юуг алддаг вэ?',
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
  const params = useParams(); // Added
  const lang = params.lang as 'mn' | 'ru'; // Added
  const [posts, setPosts] = useState(fallbackPosts);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBlogPosts();
        if (data.length > 0) {
          setPosts(
            data.map((p) => ({
              id: (p as BlogPost).id,
              title: (p as BlogPost).title,
              slug: (p as BlogPost).slug,
              excerpt: (p as BlogPost).excerpt,
              published_date: (p as BlogPost).published_date,
              category: (p as BlogPost).category,
              featured_image: (p as BlogPost).featured_image,
            }))
          );
        }
      } catch (e) {
        console.error('Blog fetch failed, using fallback:', e);
      }
    }
    load();
  }, []);

  const t = {
    mn: {
      sub_header: 'Мэдээ, мэдээлэл',
      header_title: 'Мэдээ, мэдээлэл',
      header_desc: 'Санхүү, бизнес, технологийн тухай сонирхолтой нийтлэлүүд',
      read_more: 'Дэлгэрэнгүй үзэх',
      cta_title: 'Өдөр бүрийн ханш ба зах зээлийн тойм мэдээ авах:',
      cta_desc: 'Бидний телеграм сувгийг дагаж валютын ханшийн мэдээлэл аваарай!',
      cta_btn: 'Сувагт нэгдэх',
    },
    ru: {
      sub_header: 'Новости',
      header_title: 'Новости и статьи',
      header_desc: 'Интересные статьи о финансах, бизнесе и технологиях',
      read_more: 'Подробнее',
      cta_title: 'Получайте ежедневные курсы и обзор рынка:',
      cta_desc: 'Подписывайтесь на наш канал в Telegram, чтобы получать информацию о курсах валют!',
      cta_btn: 'Присоединиться к каналу',
    }
  };

  const content = t[lang] || t.mn;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#eaeaea]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">{content.sub_header}</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-3">
            {content.header_title}
          </h1>
          <p className="text-lg text-slate-500">
            {content.header_desc}
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover"
            >
              <div className="h-44 relative overflow-hidden">
                {(post as any).featured_image ? (
                  <img
                    src={assetUrl((post as any).featured_image)}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
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
                  {new Date(post.published_date).toLocaleDateString(lang === 'mn' ? 'mn-MN' : 'ru-RU')}
                </time>
                <h2 className="text-base font-bold text-slate-900 mt-2 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <Link
                  href={/blog/}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-semibold group/link"
                >
                  {content.read_more}
                  <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
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
              {content.cta_title}
            </h2>
            <p className="text-lg mb-8 text-blue-100/80 max-w-xl mx-auto">
              {content.cta_desc}
            </p>
            <a
              href="https://t.me/oyuns_alo"
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
      </div>
    </div>
  );
}
