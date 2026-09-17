'use client';

import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { assetUrl, type Partner } from '@/lib/directus';
import { cn } from '@/lib/utils';

type PartnerLogoSliderProps = {
  partners: Partner[];
  className?: string;
};

export default function PartnerLogoSlider({
  partners,
  className,
}: PartnerLogoSliderProps) {
  if (!partners.length) return null;

  return (
    <div
      className={cn(
        'glass-surface rounded-2xl border border-white/70 p-4 sm:p-6',
        className,
      )}
      data-slot="partner-logo-slider"
      role="region"
      aria-label="Partner logos"
    >
      <InfiniteSlider
        gap={48}
        duration={96}
        durationOnHover={216}
        reverse
        className="w-full"
      >
        {partners.map((partner) => {
          const logo = (
            <img
              src={assetUrl(partner.logo)}
              alt={partner.name}
              className="h-12 w-36 object-contain grayscale opacity-65 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100 sm:h-14 sm:w-44"
            />
          );

          return (
            <div
              key={partner.id}
              className="group flex h-16 w-36 shrink-0 items-center justify-center sm:h-20 sm:w-44"
              data-slot="partner-logo"
            >
              {partner.url ? (
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={partner.name}
                  className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                >
                  {logo}
                </a>
              ) : (
                logo
              )}
            </div>
          );
        })}
      </InfiniteSlider>
    </div>
  );
}
