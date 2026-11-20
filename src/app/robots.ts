import type { MetadataRoute } from 'next';
import { isIndexingAllowed } from '@/lib/indexing';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  if (!isIndexingAllowed()) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://oyuns.mn/sitemap.xml',
  };
}
