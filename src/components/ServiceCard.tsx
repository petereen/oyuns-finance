'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  icon: ReactNode;
  telegramLink?: string;
  index: number;
}

export default function ServiceCard({
  title,
  description,
  features,
  icon,
  telegramLink,
  index,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-2xl p-6 card-hover border border-gray-100 overflow-hidden"
    >
      {/* Subtle gradient hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-cyan-50/0 group-hover:from-blue-50/50 group-hover:to-cyan-50/50 transition-all duration-500 rounded-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl mb-5 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-5">{description}</p>
        
        <ul className="space-y-2.5 mb-6">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-sm text-slate-600 gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-emerald-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {feature}
            </li>
          ))}
        </ul>
        
        {telegramLink && (
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-medium text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 3.767-1.362 5.001-.169.523-.506.697-.83.715-.704.031-1.237-.465-1.918-.912-.964-.633-1.508-1.028-2.447-1.647-.951-.627-.334-1.098.208-1.735.142-.164 2.606-2.389 2.652-2.592.006-.025.011-.117-.043-.166-.054-.049-.133-.033-.19-.019-.079.019-1.339.851-3.781 2.5-.358.246-.682.366-.973.36-.32-.006-.936-.181-1.395-.329-.563-.181-1.009-.277-1.086-.299-.167-.046-.252-.088-.252-.183 0-.074.057-.149.172-.225.641-.423 1.64-1.056 2.987-1.9.984-.615 2.149-1.314 3.487-2.097.284-.166.567-.333.85-.499.117-.069.234-.068.35.002.116.069.174.183.174.315z"/>
            </svg>
            Валют солих
          </a>
        )}
      </div>
    </motion.div>
  );
}
