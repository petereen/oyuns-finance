import type { MetadataRoute } from 'next';
import { isIndexingAllowed } from '@/lib/indexing';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://oyuns.mn';
const locales = ['mn', 'ru'] as const;

// Static, localized routes. Blog posts come from Directus and are not listed yet.
const routes = ['', '/about', '/services', '/solutions', '/exchange', '/blog', '/contact', '/user-agreement'];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexingAllowed()) return [];
  return routes.flatMap((route) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}${route}`,
      changeFrequency: route === '/exchange' ? 'daily' : 'monthly',
      priority: route === '' ? 1 : route === '/solutions' ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${route}`])),
      },
    }))
  );
}
