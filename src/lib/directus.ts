import { createDirectus, rest, readItems, readItem } from '@directus/sdk';

// Define your Directus schema
type DirectusSchema = {
  services: Service[];
  blog_posts: BlogPost[];
  testimonials: Testimonial[];
  partners: Partner[];
  exchange_rates: ExchangeRate[];
  site_settings: SiteSettings[];
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

export type ExchangeRate = {
  id: number;
  date: string;
  currency_pair: string; // e.g., "MNT/RUB"
  buy_rate: number;
  sell_rate: number;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  key: string;
  value: any;
  updated_at: string;
};

// Initialize Directus client
const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export const directus = createDirectus<DirectusSchema>(directusUrl).with(rest());

// Helper functions for fetching data
export async function getServices(category?: 'client' | 'business') {
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
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function getBlogPosts(limit = 10) {
  try {
    const posts = await directus.request(
      readItems('blog_posts', {
        filter: { status: { _eq: 'published' } },
        sort: ['-published_date'],
        limit,
      })
    );
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPost(slug: string) {
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
    return posts[0] || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function getTestimonials() {
  try {
    const testimonials = await directus.request(
      readItems('testimonials', {
        filter: { status: { _eq: 'published' } },
        sort: ['-created_at'],
      })
    );
    return testimonials;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export async function getPartners() {
  try {
    const partners = await directus.request(
      readItems('partners', {
        filter: { status: { _eq: 'published' } },
        sort: ['sort'],
      })
    );
    return partners;
  } catch (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
}
