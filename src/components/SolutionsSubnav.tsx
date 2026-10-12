'use client';

import { useEffect, useRef, useState } from 'react';

interface SolutionsSubnavProps {
  label: string;
  items: { id: string; title: string }[];
}

export default function SolutionsSubnav({ label, items }: SolutionsSubnavProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Highlight the section that currently sits under the sticky bars
  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    // Track every section's state so the highlight clears once we scroll past the last one
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
        setActiveId(items.find((item) => visible.has(item.id))?.id ?? null);
      },
      { rootMargin: '-140px 0px -60% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  // Keep the active pill visible on narrow screens
  useEffect(() => {
    if (!activeId || !listRef.current) return;
    const link = listRef.current.querySelector<HTMLElement>(`a[href="#${activeId}"]`);
    if (!link) return;
    const list = listRef.current;
    list.scrollTo({
      left: link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2,
      behavior: 'smooth',
    });
  }, [activeId]);

  return (
    <nav
      aria-label={label}
      className="sticky top-16 lg:top-[4.5rem] z-40 bg-white/85 backdrop-blur-xl border-b border-white/70 shadow-sm shadow-blue-900/[0.04]"
    >
      <ul
        ref={listRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,black_92%,transparent)]"
      >
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              aria-current={activeId === item.id ? 'location' : undefined}
              className={`block px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors focus-ring ${
                activeId === item.id
                  ? 'text-white bg-[#2455D8]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
