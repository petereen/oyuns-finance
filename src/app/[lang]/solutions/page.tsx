import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import * as motion from 'framer-motion/client';
import { getDictionary } from '@/lib/dictionary';
import SolutionsSubnav from '@/components/SolutionsSubnav';

const SITE_URL = 'https://oyuns.mn';

// No pricing page exists yet — set this to e.g. `/pricing` to show the hero's secondary CTA
const PRICING_PATH: string | null = null;

// TODO: add product screenshots (e.g. /solutions/hr.png in /public) keyed by section id.
// Sections without an entry render a neutral placeholder frame.
const SCREENSHOTS: Partial<Record<string, string>> = {};

/* ── Icons ───────────────────────────────────────────────────────────── */

const ICON_PATHS: Record<string, string> = {
  hr: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
  time: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  tasks: 'M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75',
  reports: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z',
  crm: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z',
  contracts: 'M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12',
  budget: 'M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z',
  payroll: 'M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z',
  ai: 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z',
  chat: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155',
  web: 'M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25',
  mobile: 'M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3',
  isolation: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125',
  roles: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
  twofa: 'M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z',
  biometric: 'M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33',
  consent: 'M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z',
  audit: 'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25',
};

const TelegramIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

function Icon({ name, className = 'w-6 h-6 text-blue-600' }: { name: string; className?: string }) {
  if (name === 'telegram') return <TelegramIcon className={className} />;
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[name]} />
    </svg>
  );
}

const CheckIcon = () => (
  <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
    <svg className="w-3 h-3 text-emerald-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path d="M5 13l4 4L19 7" />
    </svg>
  </span>
);

/* ── Screenshot slot ─────────────────────────────────────────────────── */

function ScreenshotFrame({ id, title, alt }: { id: string; title: string; alt: string }) {
  const src = SCREENSHOTS[id];

  return (
    <div className="glass-surface rounded-[1.5rem] p-2 sm:p-3">
      <div className="flex items-center gap-1.5 px-2 pb-2 sm:pb-3" aria-hidden="true">
        <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
      </div>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={1280}
          height={800}
          sizes="(min-width: 1024px) 560px, 100vw"
          className="w-full h-auto rounded-xl border border-white/70"
        />
      ) : (
        // Decorative stand-in until a real screenshot is added to SCREENSHOTS
        <div aria-hidden="true" className="aspect-[16/10] rounded-xl bg-white/70 border border-white/70 p-5 sm:p-7 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Icon name={id} />
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-800">{title}</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((n) => (
              <div key={n} className="h-14 sm:h-16 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/60" />
            ))}
          </div>
          <div className="flex-1 rounded-xl bg-slate-50 border border-slate-100 p-4 flex flex-col gap-2.5">
            <div className="h-2.5 w-3/4 rounded-full bg-slate-200" />
            <div className="h-2.5 w-1/2 rounded-full bg-slate-200" />
            <div className="h-2.5 w-2/3 rounded-full bg-slate-200" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Metadata ────────────────────────────────────────────────────────── */

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

/* ── Page ────────────────────────────────────────────────────────────── */

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
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative liquid-hero isolate text-white pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b40a8]/40 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 text-sm font-semibold tracking-wide">
              {content.hero.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-balance">
              {content.hero.title}
            </h1>
            <p className="text-lg sm:text-xl text-blue-50/90 leading-relaxed mb-10">
              {content.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={demoHref}
                className="inline-flex items-center gap-2 bg-white text-[#2455D8] px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-white/25 hover:-translate-y-0.5 transition-all duration-300 text-base"
              >
                {content.hero.cta_demo}
              </Link>
              {PRICING_PATH && (
                <Link
                  href={`/${lang}${PRICING_PATH}`}
                  className="inline-flex items-center gap-2 glass-pill text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 text-base"
                >
                  {content.hero.cta_pricing}
                </Link>
              )}
            </div>
            <ul className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {content.channels.items.map((channel) => (
                <li key={channel.id} className="glass-pill rounded-full px-3.5 py-1.5 text-sm font-medium flex items-center gap-2">
                  <Icon name={channel.id} className="w-4 h-4 text-white" />
                  {channel.title}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-blue-100/80">{content.hero.audience}</p>
          </motion.div>
        </div>
      </section>

      {/* Sticky sub-nav sticks within this wrapper, i.e. for the rest of the page */}
      <div>
        <SolutionsSubnav
          label={content.subnav_label}
          items={content.items.map(({ id, title }) => ({ id, title }))}
        />

        {/* ── Overview grid ───────────────────────────────────────────── */}
        <section aria-labelledby="overview-title" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">{content.overview.eyebrow}</p>
              <h2 id="overview-title" className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">
                {content.overview.title}
              </h2>
              <p className="text-lg text-[#555]">{content.overview.subtitle}</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {content.items.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (index % 5) * 0.06 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={`#${item.id}`}
                    className="group glass-surface card-hover focus-ring rounded-[1.5rem] p-5 flex flex-col h-full"
                  >
                    <span className="w-12 h-12 rounded-2xl bg-white/60 border border-white/70 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon name={item.id} />
                    </span>
                    <span className="text-base font-bold text-[#1a1a1a] mb-1.5">{item.title}</span>
                    <span className="text-sm text-[#555] leading-relaxed">{item.tagline}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Solution sections ───────────────────────────────────────── */}
        {content.items.map((item, index) => {
          const reversed = index % 2 === 1;
          return (
            <section
              key={item.id}
              id={item.id}
              aria-labelledby={`${item.id}-title`}
              className={`scroll-mt-32 lg:scroll-mt-36 py-16 lg:py-20 ${index % 2 === 0 ? 'bg-white/30 backdrop-blur-[2px]' : ''}`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={reversed ? 'lg:order-2' : ''}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                      <Icon name={item.id} />
                    </span>
                    <span className="text-sm font-semibold text-[#2455D8] tracking-wide">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h2 id={`${item.id}-title`} className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-2">
                    {item.title}
                  </h2>
                  <p className="text-lg font-semibold text-[#2455D8] mb-6">{item.tagline}</p>

                  <dl className="space-y-5 mb-6">
                    <div>
                      <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{content.labels.problem}</dt>
                      <dd className="text-base text-[#555] leading-relaxed">{item.problem}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{content.labels.solution}</dt>
                      <dd className="text-base text-[#333] leading-relaxed">{item.solution}</dd>
                    </div>
                  </dl>

                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{content.labels.features}</h3>
                  <ul className="space-y-2.5 mb-6">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-start text-sm sm:text-base text-[#444] gap-2.5">
                        <CheckIcon />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="rounded-2xl bg-blue-50/80 border-l-4 border-[#2455D8] px-5 py-4">
                    <p className="text-xs font-semibold text-[#2455D8] uppercase tracking-wider mb-1">{content.labels.outcome}</p>
                    <p className="text-base font-medium text-[#1a1a1a]">{item.outcome}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className={reversed ? 'lg:order-1' : ''}
                >
                  <ScreenshotFrame
                    id={item.id}
                    title={item.title}
                    alt={`OYUNS ERP — ${item.title} ${content.labels.screenshot_alt}`}
                  />
                </motion.div>
              </div>
            </section>
          );
        })}

        {/* ── Channels ────────────────────────────────────────────────── */}
        <section aria-labelledby="channels-title" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">{content.channels.eyebrow}</p>
              <h2 id="channels-title" className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">
                {content.channels.title}
              </h2>
              <p className="text-lg text-[#555]">{content.channels.subtitle}</p>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.channels.items.map((channel, index) => (
                <motion.li
                  key={channel.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-surface rounded-[1.5rem] p-6"
                >
                  <span className="w-14 h-14 rounded-2xl bg-white/60 border border-white/70 flex items-center justify-center mb-5">
                    <Icon name={channel.id} className="w-7 h-7 text-blue-600" />
                  </span>
                  <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">{channel.title}</h3>
                  <p className="text-sm font-medium text-[#2455D8] mb-3">{channel.audience}</p>
                  <p className="text-sm text-[#555] leading-relaxed">{channel.description}</p>
                </motion.li>
              ))}
            </ul>
            <p className="mt-8 text-center text-sm text-slate-500">{content.channels.note}</p>
          </div>
        </section>

        {/* ── Security ────────────────────────────────────────────────── */}
        <section aria-labelledby="security-title" className="py-20 bg-gradient-to-br from-[#2455D8] to-[#1b40a8] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-sm font-semibold text-cyan-300 tracking-wide uppercase mb-2">{content.security.eyebrow}</p>
              <h2 id="security-title" className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                {content.security.title}
              </h2>
              <p className="text-lg text-blue-100/80">{content.security.subtitle}</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {content.security.items.map((item) => (
                <li key={item.id} className="rounded-2xl bg-white/10 border border-white/15 p-6 backdrop-blur-sm">
                  <span className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                    <Icon name={item.id} className="w-6 h-6 text-cyan-200" />
                  </span>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-blue-100/85 leading-relaxed">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        <section aria-labelledby="faq-title" className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-[#2455D8] tracking-wide uppercase mb-2">{content.faq.eyebrow}</p>
              <h2 id="faq-title" className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
                {content.faq.title}
              </h2>
            </div>
            <div className="space-y-3">
              {content.faq.items.map((item) => (
                <details key={item.question} className="group glass-surface rounded-2xl">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden px-6 py-5 font-semibold text-[#1a1a1a] focus-ring rounded-2xl">
                    {item.question}
                    <svg className="w-5 h-5 text-[#2455D8] shrink-0 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <p className="px-6 pb-5 -mt-1 text-[#555] leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <section className="relative py-20 liquid-hero text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b40a8]/50 to-transparent pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                {content.cta.title}
              </h2>
              <p className="text-blue-100/80 text-lg mb-8 max-w-xl mx-auto">
                {content.cta.description}
              </p>
              <Link
                href={demoHref}
                className="inline-flex items-center gap-2 bg-white text-[#2455D8] px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-white/25 hover:-translate-y-0.5 transition-all duration-300 text-base"
              >
                {content.cta.button}
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
