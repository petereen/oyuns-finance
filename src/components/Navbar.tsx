'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface NavbarProps {
  lang: 'mn' | 'ru';
  dict: any;
}

export default function Navbar({ lang = 'mn', dict }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // If dict is not provided (e.g. during initial render or if layout didn't pass it yet), use a fallback or wait
  // However, layout server component should pass it. 
  // For safety, we can have a fallback if needed, but 'dict' is expected.
  const t = dict || {
    home: 'Нүүр хуудас',
    about: 'Бидний тухай',
    services: 'Үйлчилгээ',
    exchange: 'Ханш',
    blog: 'Мэдээ, мэдээлэл',
    contact: 'Бидэнтэй холбогдох',
    exchange_btn: 'Валют солих'
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: `/${lang}`, label: t.home },
    { href: `/${lang}/about`, label: t.about },
    { href: `/${lang}/services`, label: t.services },
    { href: `/${lang}/exchange`, label: t.exchange },
    { href: `/${lang}/blog`, label: t.blog },
    { href: `/${lang}/contact`, label: t.contact },
  ];

  const isActive = (href: string) => {
    if (href === `/${lang}`) return pathname === `/${lang}`;
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const switchLanguage = (newLang: 'mn' | 'ru') => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = newLang; // Replace current lang with new lang
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/[0.03] border-b border-gray-100'
          : 'bg-white/60 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center group">
            <div className="relative h-12 lg:h-14 w-auto">
              <img 
                src="/logo-main.svg" 
                alt="Oyuns Finance" 
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#2455D8] rounded-full" />
                )}
              </Link>
            ))}
            <Link
              href={`/${lang}/exchange`}
              className="ml-3 bg-gradient-to-r from-[#2455D8] to-[#3d6de5] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-900/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              {t.exchange_btn}
            </Link>

            {/* Language Switcher - Minimal Icon */}
            <div className="ml-4 flex items-center border-l border-gray-200 pl-4">
               <button
                  onClick={() => switchLanguage(lang === 'mn' ? 'ru' : 'mn')}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1.5 font-medium text-sm"
                  title={lang === 'mn' ? 'Switch to Russian' : 'Монгол хэл рүү шилжих'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                  <span>{lang === 'mn' ? 'MN' : 'RU'}</span>
                </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[400px] opacity-100 pb-5' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-[#2455D8] bg-blue-50'
                    : 'text-[#555] hover:text-[#1a1a1a] hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${lang}/exchange`}
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 bg-gradient-to-r from-[#2455D8] to-[#3d6de5] text-white px-6 py-3 rounded-xl font-semibold text-center text-sm"
            >
              {t.exchange_btn}
            </Link>

            {/* Mobile Language Switcher */}
            <button
               onClick={() => {
                 switchLanguage(lang === 'mn' ? 'ru' : 'mn');
                 setMobileMenuOpen(false);
               }}
               className="mt-2 w-full flex items-center justify-center p-3 rounded-xl bg-slate-50 text-slate-700 font-medium text-sm hover:bg-slate-100 transition-colors gap-2"
             >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                {lang === 'mn' ? 'Русский' : 'Монгол'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
