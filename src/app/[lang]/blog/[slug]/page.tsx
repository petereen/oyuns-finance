'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getBlogPost, assetUrl, type BlogPost } from '@/lib/directus';
import { useParams } from 'next/navigation';

/* ── Fallback data matching the blog list ─────────────────────────── */
const fallbackPosts: Record<string, Partial<BlogPost>> = {
  'oyunshot-10-finance-books': {
    title: 'OYUNShot №10 . Мөнгө, санхүүгийн суурь мэдлэг олгох 5 ном',
    slug: 'oyunshot-10-finance-books',
    excerpt: 'Санхүүгийн мэдлэгээ дээшлүүлэхэд тань тусална.',
    content:
      '<p>Санхүүгийн мэдлэгээ дээшлүүлэхэд тань туслах 5 номыг санал болгож байна.</p><h3>1. Баялаг бүтээх ухаан</h3><p>Хувь хүний санхүүгийн сахилга батын тухай гайхалтай ном.</p><h3>2. Мөнгөний сэтгэл зүй</h3><p>Мөнгөтэй харьцах хандлага, сэтгэл зүйн төлөв байдлыг тайлбарласан бүтээл.</p>',
    published_date: '2025-06-18',
    category: 'OYUNShot',
  },
  'oyunshot-9-procrastination-cost': {
    title: 'OYUNShot №9. Хойш тавилтын зардал: ""Дараа хийнэ ээ…"" гэж хэлэх бүртээ та юуг алддаг вэ?',
    slug: 'oyunshot-9-procrastination-cost',
    excerpt: 'Хойш тавих зуршил таны санхүүд хэрхэн нөлөөлдөг тухай.',
    content:
      '<p>Хойш тавих зуршил нь зөвхөн цаг хугацаа алдах бус, санхүүгийн боломжуудыг алдах шалтгаан болдог.</p><p>Жижиг зүйлсийг хойш тавих нь ирээдүйд том алдагдал дагуулдаг.</p>',
    published_date: '2025-06-11',
    category: 'OYUNShot',
  },
  'oyunshot-8-what-is-fintech': {
    title: 'OYUNShot №8. Санхүү + Технологи = FinTech гэж юу вэ?',
    slug: 'oyunshot-8-what-is-fintech',
    excerpt: 'FinTech буюу санхүүгийн технологийн тухай ойлголт.',
    content:
      '<p>FinTech нь Financial Technology гэсэн үгний товчлол бөгөөд санхүүгийн үйлчилгээг технологийн тусламжтайгаар илүү хялбар, хурдан, хүртээмжтэй болгох салбар юм.</p><p>Манай OYUNS ALL-IN-ONE бол үүний нэг тод жишээ юм.</p>',
    published_date: '2025-06-04',
    category: 'OYUNShot',
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const lang = params.lang as 'mn' | 'ru';
  const slug = params.slug as string;
  const [post, setPost] = useState<Partial<BlogPost> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBlogPost(slug);
        if (data) {
          setPost(data as BlogPost);
        } else {
          // Use fallback
          setPost(fallbackPosts[slug] || null);
        }
      } catch {
        setPost(fallbackPosts[slug] || null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const t = {
    mn: {
      back_to_news: 'Мэдээ, мэдээлэл рүү буцах',
      not_found_title: 'Нийтлэл олдсонгүй',
      not_found_desc: 'Энэ нийтлэл байхгүй эсвэл устгагдсан байна.',
      back_btn: 'Мэдээ, мэдээлэл руу буцах',
    },
    ru: {
      back_to_news: 'Назад к новостям',
      not_found_title: 'Статья не найдена',
      not_found_desc: 'Эта статья не существует или была удалена.',
      back_btn: 'Вернуться к новостям',
    }
  };

  const content = t[lang] || t.mn;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-[#eaeaea] flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-[#eaeaea]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-4">{content.not_found_title}</h1>
          <p className="text-[#555] mb-8">{content.not_found_desc}</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-[#2455D8] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            {content.back_btn}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#eaeaea]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#2455D8] mb-8 transition-colors group"
        >
          <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {content.back_to_news}
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 overflow-hidden"
        >
          <header className="mb-8 border-b border-gray-100 pb-8">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {post.category && (
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {post.category}
                </span>
              )}
              {post.published_date && (
                <time className="text-sm text-slate-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {new Date(post.published_date).toLocaleDateString(lang === 'mn' ? 'mn-MN' : 'ru-RU')}
                </time>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] leading-tight mb-6">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg text-slate-500 italic border-l-4 border-blue-500 pl-4 py-1">
                {post.excerpt}
              </p>
            )}
            {post.featured_image && (
              <div className="mt-8 rounded-xl overflow-hidden shadow-md">
                <img
                  src={assetUrl(post.featured_image)}
                  alt={post.title || ''}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </header>

          {post.content && (
            <div
              className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#1a1a1a] prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-img:rounded-xl prose-strong:text-slate-900"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}
        </motion.article>
      </div>
    </div>
  );
}
