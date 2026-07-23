import { createDirectus, rest, readItems, createItem } from '@directus/sdk';

// Define your Directus schema
type DirectusSchema = {
  services: Service[];
  blog_posts: BlogPost[];
  testimonials: Testimonial[];
  partners: Partner[];
  logos: Logo[];
  site_settings: SiteSettings[];
  site_content: SiteContent[];
  messages: Message[];
};

export type Message = {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at?: string;
};

export type Service = {
  id: number;
  status: 'published' | 'draft';
  title: string;
  slug: string;
  description: string;
  features: string[];
  icon: string;
  telegram_link?: string;
  category: 'client' | 'business';
  sort: number;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: number;
  status: 'published' | 'draft';
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author: string;
  published_date: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: number;
  status: 'published' | 'draft';
  author: string;
  content: string;
  rating: number;
  created_at: string;
};

export type Partner = {
  id: number;
  status: 'published' | 'draft';
  name: string;
  logo: string;
  url?: string;
  sort: number;
};

export type SiteSettings = {
  id: number;
  key: string;
  value: string;
  updated_at: string;
};

export type SiteContent = {
  id: number;
  status: 'published' | 'draft';
  key: string;
  language: 'mn' | 'ru';
  value: Record<string, unknown>;
  updated_at?: string;
};

export type Logo = {
  id: number;
  status: 'published' | 'draft';
  variant: 'logo_dark' | 'logo_light' | 'logo_icon' | 'logo_full' | 'favicon';
  image: string;
  alt_text?: string;
  sort: number;
  created_at: string;
  updated_at: string;
};

// Initialize Directus client
const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://api.oyuns.mn';

/**
 * Directus sometimes returns file/image UUIDs as binary objects
 * (with keys 0–15) instead of strings. This helper converts them.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ensureString(val: any): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') {
    // UUID buffer object with keys 0–15 (16 bytes)
    const keys = Object.keys(val);
    // Check if keys are approximately 0..15
    const isBuffer = keys.length === 16 && keys.every(k => !isNaN(parseInt(k)));
    
    if (isBuffer) {
      const hex = Array.from({ length: 16 }, (_, i) => {
        const b = val[i];
        return typeof b === 'number' ? b.toString(16).padStart(2, '0') : '';
      }).join('');
      if (hex.length === 32) {
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
      }
    }
    // Fallback: try JSON stringify or toString
    // But avoids crash if object has circular ref, though UUID buffer wont.
    try {
        return String(val);
    } catch {
        return '';
    }
  }
  return String(val ?? '');
}

/**
 * Recursively deep-transform data to convert any UUID buffer objects to strings.
 * This prevents React errors when passing data to components.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformData(data: any): any {
  if (Array.isArray(data)) {
    return data.map(transformData);
  }
  if (data && typeof data === 'object') {
    // Check if it's a UUID buffer
    const keys = Object.keys(data);
    const isBuffer = keys.length === 16 && keys.every(k => !isNaN(parseInt(k)));
    if (isBuffer) {
      return ensureString(data);
    }
    // Otherwise recurse
    const newData: any = {};
    for (const key of keys) {
      newData[key] = transformData(data[key]);
    }
    return newData;
  }
  return data;
}

/** Build a Directus asset URL from a file UUID (handles object UUIDs) */
export function assetUrl(fileId: any): string {
  return `${directusUrl}/assets/${ensureString(fileId)}`;
}

// This module is imported by client components, so it must never use a static
// token. Public CMS data is instead protected by Directus Public-role rules.
export const directus = createDirectus<DirectusSchema>(directusUrl).with(rest());

// Helper functions for fetching data
export async function getServices(category?: 'client' | 'business'): Promise<Service[]> {
  try {
    const services = await directus.request(
      readItems('services', {
        filter: {
          status: { _eq: 'published' },
          ...(category && { category: { _eq: category } }),
        },
        sort: ['sort'],
      })
    );
    return transformData(services) as Service[];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function getBlogPosts(limit = 10): Promise<BlogPost[]> {
  try {
    const posts = await directus.request(
      readItems('blog_posts', {
        filter: { status: { _eq: 'published' } },
        sort: ['-published_date'],
        limit,
      })
    );
    return transformData(posts) as BlogPost[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await directus.request(
      readItems('blog_posts', {
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' },
        },
        limit: 1,
      })
    );
    return (transformData(posts[0]) as BlogPost) || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonials = await directus.request(
      readItems('testimonials', {
        filter: { status: { _eq: 'published' } },
        sort: ['-created_at'],
      })
    );
    return transformData(testimonials) as Testimonial[];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export async function getPartners(): Promise<Partner[]> {
  try {
    const partners = await directus.request(
      readItems('partners', {
        filter: { status: { _eq: 'published' } },
        sort: ['sort'],
      })
    );
    return transformData(partners) as Partner[];
  } catch (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
}

export async function getSiteSettings() {
  try {
    const settings = await directus.request(
      readItems('site_settings', {})
    );
    const map: Record<string, string> = {};
    const transformedSettings = transformData(settings) as SiteSettings[];
    for (const s of transformedSettings) {
      map[s.key] = s.value;
    }
    return map;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return {};
  }
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    const settings = await directus.request(
      readItems('site_settings', {
        filter: { key: { _eq: key } },
        limit: 1,
      })
    );
    const transformed = transformData(settings) as SiteSettings[];
    return transformed[0]?.value ?? null;
  } catch (error) {
    console.error('Error fetching setting:', error);
    return null;
  }
}

/** Load the published translation object for one page or shared section. */
export async function getSiteContent<T extends Record<string, unknown>>(
  key: string,
  language: 'mn' | 'ru'
): Promise<T | null> {
  try {
    const items = await directus.request(
      readItems('site_content', {
        filter: {
          key: { _eq: key },
          language: { _eq: language },
          status: { _eq: 'published' },
        },
        limit: 1,
      })
    );
    const item = transformData(items[0]) as SiteContent | undefined;
    return (item?.value as T | undefined) ?? null;
  } catch (error) {
    console.error(`Error fetching site content for ${key}/${language}:`, error);
    return null;
  }
}

export async function getLogos(): Promise<Logo[]> {
  try {
    const logos = await directus.request(
      readItems('logos', {
        filter: { status: { _eq: 'published' } },
        sort: ['sort'],
      })
    );
    return transformData(logos) as Logo[];
  } catch (error) {
    console.error('Error fetching logos:', error);
    return [];
  }
}

export async function getLogo(variant: Logo['variant']) {
  try {
    const logos = await directus.request(
      readItems('logos', {
        filter: {
          status: { _eq: 'published' },
          variant: { _eq: variant },
        },
        limit: 1,
      })
    );
    if (logos.length > 0) {
      // transformData is not strictly needed for just assetUrl usage, but consistent
      const cleanLogo = transformData(logos[0]);
      return assetUrl(cleanLogo.image);
    }
    return null;
  } catch (error) {
    console.error('Error fetching logo:', error);
    return null;
  }
}

export async function createMessage(data: Omit<Message, 'id' | 'status' | 'created_at'>): Promise<boolean> {
  try {
    await directus.request(
      createItem('messages', {
        ...data,
        status: 'new',
      })
    );
    return true;
  } catch (error) {
    console.error('Error creating message:', error);
    return false;
  }
}
