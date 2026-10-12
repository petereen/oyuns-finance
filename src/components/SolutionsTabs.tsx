'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import SolutionIcon from '@/components/SolutionIcon';

interface Module {
  id: string;
  title: string;
  description: string;
  features: string[];
}

interface SolutionsTabsProps {
  items: Module[];
  screenshotAlt: string;
  // Module id → image path in /public; modules without one show a placeholder frame
  screenshots: Partial<Record<string, string>>;
}

export default function SolutionsTabs({ items, screenshotAlt, screenshots }: SolutionsTabsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Keep the active tab visible in the horizontally scrolling mobile row
  useEffect(() => {
    const tab = activeId ? tabRefs.current[activeId] : null;
    tab?.parentElement?.scrollTo({ left: tab.offsetLeft - 16, behavior: 'smooth' });
  }, [activeId]);

  // Open the module named in the URL hash, e.g. /mn/solutions#payroll
  useEffect(() => {
    const syncHash = () => {
      const id = window.location.hash.slice(1);
      if (items.some((item) => item.id === id)) setActiveId(id);
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, [items]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!next) return;
    e.preventDefault();
    const target = items[(index + next + items.length) % items.length];
    setActiveId(target.id);
    tabRefs.current[target.id]?.focus();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[15rem_1fr] gap-6 lg:gap-10 items-start">
      <div
        role="tablist"
        aria-orientation="vertical"
        className="flex lg:flex-col gap-1.5 overflow-x-auto -mx-1 px-1 pb-1 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              ref={(el) => { tabRefs.current[item.id] = el; }}
              id={`tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls={`panel-${item.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={`shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-full lg:rounded-xl text-sm font-medium text-left whitespace-nowrap transition-colors focus-ring ${
                active
                  ? 'bg-[#2455D8] text-white shadow-lg shadow-blue-900/15'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <SolutionIcon name={item.id} className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-blue-600'}`} />
              {item.title}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          id={`panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${item.id}`}
          hidden={item.id !== activeId}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start"
        >
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2">{item.title}</h3>
            <p className="text-base text-[#555] mb-6">{item.description}</p>
            <ul className="space-y-3">
              {item.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm sm:text-base text-[#333]">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-2.5">
            {screenshots[item.id] ? (
              <Image
                src={screenshots[item.id]!}
                alt={`OYUNS ERP — ${item.title} ${screenshotAlt}`}
                width={1280}
                height={800}
                sizes="(min-width: 1024px) 420px, 100vw"
                className="w-full h-auto rounded-xl"
              />
            ) : (
              // Decorative stand-in until a real screenshot is provided
              <div aria-hidden="true" className="aspect-[16/10] rounded-xl bg-white border border-gray-100 p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <SolutionIcon name={item.id} className="w-4 h-4 text-blue-600" />
                  </span>
                  <span className="h-2.5 w-24 rounded-full bg-slate-200" />
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {[0, 1, 2].map((n) => (
                    <div key={n} className="h-12 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50" />
                  ))}
                </div>
                <div className="flex-1 rounded-lg bg-slate-50 p-3 flex flex-col gap-2">
                  <div className="h-2 w-3/4 rounded-full bg-slate-200" />
                  <div className="h-2 w-1/2 rounded-full bg-slate-200" />
                  <div className="h-2 w-2/3 rounded-full bg-slate-200" />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
