'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ViewOnMapProps {
  className?: string;
}

const directionsUrl =
  'https://www.google.com/maps/place/OYUNS+ALL-IN-ONE/@47.9143833,106.9123287,807m/data=!3m2!1e3!4b1!4m6!3m5!1s0x5d969300484077cb:0x5783b60e41255746!8m2!3d47.9143797!4d106.9149036!16s%2Fg%2F11z7ksdcdz';

export function ViewOnMap({ className = '' }: ViewOnMapProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  return (
    <div className={`flex w-full justify-start ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.div
            key="map"
            layoutId="oyuns-map-card"
            className="relative h-[min(78vw,380px)] w-full max-w-[460px] overflow-hidden rounded-3xl border border-white/70 bg-slate-100 shadow-xl shadow-blue-950/10"
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
          >
            <iframe
              title="OYUNS ALL-IN-ONE location on Google Maps"
              src="https://maps.google.com/maps?q=47.9143797,106.9149036&z=16&output=embed"
              className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${isMapLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsMapLoaded(true)}
            />
            {!isMapLoaded && (
              <div className="absolute inset-0 grid place-items-center bg-slate-100" aria-label="Loading map">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-white/90 p-3 backdrop-blur-md">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#2D62EC] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D62EC]"
              >
                Open Google Maps
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsMapLoaded(false);
                }}
                aria-label="Close map"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0B172A] text-white transition hover:bg-[#2D62EC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D62EC]"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="button"
            layoutId="oyuns-map-card"
            type="button"
            onClick={() => setIsOpen(true)}
            aria-expanded={false}
            className="group relative flex h-[52px] items-center gap-3 overflow-hidden rounded-full border border-blue-200/80 bg-white px-5 text-[#231F20] shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#2D62EC]"
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#2D62EC]/[0.08] to-cyan-400/[0.12] opacity-70 transition-opacity group-hover:opacity-100" />
            <svg viewBox="0 0 24 24" aria-hidden="true" className="relative h-5 w-5 text-[#2D62EC]" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className="relative text-sm font-semibold">View on Map</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
