import type { Metadata } from 'next';
import Link from 'next/link';
import * as motion from 'framer-motion/client';
import { getDictionary } from '@/lib/dictionary';
import SolutionIcon from '@/components/SolutionIcon';
import SolutionsTabs from '@/components/SolutionsTabs';

const SITE_URL = 'https://oyuns.mn';

// Module id → illustration in /public
const SCREENSHOTS: Partial<Record<string, string>> = {
  hr: '/01-hr.png',
  time: '/02-time.png',
  tasks: '/03-tasks.png',
  reports: '/04-reports.png',
  crm: '/05-crm.png',
  contracts: '/06-contracts.png',
  budget: '/07-budget.png',
  payroll: '/08-payroll.png',
  ai: '/09-ai.png',
  chat: '/10-chat.png',
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'ru' ? 'ru' : 'mn';
  const { meta } = (await getDictionary(lang)).solutions;
  const url = `${SITE_URL}/${lang}/solutions`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: {
        mn: `${SITE_URL}/mn/solutions`,
        ru: `${SITE_URL}/ru/solutions`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: 'OYUNS ALL-IN-ONE',
      locale: lang === 'ru' ? 'ru_RU' : 'mn_MN',
      type: 'website',
    },
  };
}

export default async function SolutionsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'ru' ? 'ru' : 'mn';
  const content = (await getDictionary(lang)).solutions;
  const demoHref = `/${lang}/contact`;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen pb-20">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative liquid-hero isolate text-white pt-36 pb-24 sm:pt-44 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b40a8]/40 to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-none tracking-tight text-balance mb-6 sm:mb-8">
            {content.hero.title}
          </h1>
          <p className="inline-block glass-pill text-white px-5 py-2.5 rounded-full text-base sm:text-lg font-semibold text-balance">
            {content.hero.tagline}
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Modules ───────────────────────────────────────────────── */}
        <section aria-labelledby="modules-title" className="-mt-8 relative bg-white rounded-2xl border border-gray-200 shadow-xl shadow-blue-900/[0.04] p-5 sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">{content.modules.eyebrow}</p>
            <h2 id="modules-title" className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">{content.modules.title}</h2>
          </div>
          <SolutionsTabs items={content.items} screenshotAlt={content.labels.screenshot_alt} screenshots={SCREENSHOTS} />
        </section>

        {/* ── Channels ──────────────────────────────────────────────── */}
        <section aria-labelledby="channels-title" className="mt-16">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">{content.channels.eyebrow}</p>
            <h2 id="channels-title" className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">{content.channels.title}</h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.channels.items.map((channel) => (
              <li key={channel.id} className="glass-surface rounded-2xl p-5 flex items-center gap-4">
                <span className="w-12 h-12 shrink-0 rounded-xl bg-white/70 border border-white/80 flex items-center justify-center">
                  <SolutionIcon name={channel.id} />
                </span>
                <div>
                  <h3 className="font-bold text-[#1a1a1a]">{channel.title}</h3>
                  <p className="text-sm text-slate-500">{channel.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Security ──────────────────────────────────────────────── */}
        <section aria-labelledby="security-title" className="mt-16 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 lg:p-10">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">{content.security.eyebrow}</p>
            <h2 id="security-title" className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">{content.security.title}</h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {content.security.items.map((item) => (
              <li key={item.id} className="flex items-start gap-3.5">
                <span className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
                  <SolutionIcon name={item.id} className="w-5 h-5 text-blue-600" />
                </span>
                <div>
                  <h3 className="font-bold text-[#1a1a1a]">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <section aria-labelledby="faq-title" className="mt-16 max-w-3xl mx-auto">
          <h2 id="faq-title" className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] text-center mb-8">
            {content.faq.title}
          </h2>
          <div className="space-y-3">
            {content.faq.items.map((item) => (
              <details key={item.question} className="group bg-white rounded-2xl border border-gray-200">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden px-5 py-4 font-semibold text-[#1a1a1a] focus-ring rounded-2xl">
                  {item.question}
                  <svg className="w-5 h-5 text-[#2455D8] shrink-0 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <p className="px-5 pb-4 text-[#555]">{item.answer}</p>
              </details>
            ))}
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        </section>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 relative mesh-gradient rounded-2xl p-8 md:p-12 text-center text-white overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent pointer-events-none" />
          <div className="relative">
            <Link
              href={demoHref}
              className="inline-flex items-center gap-2 bg-white text-[#2455D8] px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-white/25 hover:-translate-y-0.5 transition-all duration-300 text-base"
            >
              {content.cta.button}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
