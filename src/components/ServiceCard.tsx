'use client';

import { motion } from 'framer-motion';
import { ReactNode, isValidElement } from 'react';
import { assetUrl } from '@/lib/directus';

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  icon: ReactNode | string;
  telegramLink?: string;
  telegram_link?: string; // Handle snake_case from Directus
  index: number;
  lang?: 'mn' | 'ru';
}

export default function ServiceCard({
  title,
  description,
  features = [],
  icon,
  telegramLink,
  telegram_link,
  index,
  lang = 'mn',
}: ServiceCardProps) {
  const link = telegramLink || telegram_link;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-2xl p-6 card-hover border border-gray-100 overflow-hidden flex flex-col h-full"
    >
      {/* Subtle gradient hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-cyan-50/0 group-hover:from-blue-50/50 group-hover:to-cyan-50/50 transition-all duration-500 rounded-2xl" />
      
      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl mb-5 group-hover:scale-110 transition-transform duration-300">
          {isValidElement(icon) ? (
            icon
          ) : typeof icon === 'string' ? (
            <img
              src={assetUrl(icon)}
              alt={title}
              className="w-8 h-8 object-contain"
            />
          ) : null}
        </div>
        
        <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">{title}</h3>
        <p className="text-[#555] text-sm leading-relaxed mb-5">{description}</p>
        
        <ul className="space-y-2.5 mb-6">
          {Array.isArray(features) && features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-sm text-[#555] gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-emerald-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {typeof feature === 'string' ? feature : JSON.stringify(feature)}
            </li>
          ))}
        </ul>
        
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center justify-center w-full bg-gradient-to-r from-[#2455D8] to-[#3d6de5] text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-900/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-medium text-sm"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            {lang === 'ru' ? 'Начать' : 'Эхлэх'}
          </a>
        )}
      </div>
    </motion.div>
  );
}
