# OYUNS ALL-IN-ONE — Modern Finance Website

International money transfer platform built with Next.js, Directus CMS, and Supabase.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| CMS | Directus (Headless) |
| Database | Supabase (PostgreSQL) |
| Charts | Recharts |
| Animations | Framer Motion |
| Hosting | Cloudflare Pages |

## Quick Start

```bash
npm install
cp .env.local.example .env.local   # then fill in credentials
npm run dev                         # http://localhost:3000
```

## Full Setup Guide

**→ Start here: [`docs/COMPLETE_SETUP.md`](docs/COMPLETE_SETUP.md)**

It walks you through every step — Supabase tables, Directus collections, local testing, and deployment — with links to deeper reference docs:

| Step | Doc |
|------|-----|
| 1–2 | Install & env file | _in COMPLETE_SETUP.md_ |
| 3 | Supabase (database) | [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) |
| 4 | Directus (CMS) | [`docs/DIRECTUS_SETUP.md`](docs/DIRECTUS_SETUP.md) |
| 5–6 | Test & push to GitHub | _in COMPLETE_SETUP.md_ |
| 7 | Cloudflare deployment | [`docs/CLOUDFLARE_DEPLOYMENT.md`](docs/CLOUDFLARE_DEPLOYMENT.md) |
| 8 | Post-launch ops | _in COMPLETE_SETUP.md_ |
| — | Daily cheat sheet | [`docs/QUICK_REFERENCE.md`](docs/QUICK_REFERENCE.md) |

## Database Tables (Supabase)

- `bot_rates` — Individual exchange rates (buy/sell)
- `business_rates` — Business exchange rates (B2C/B2B)

## CMS Collections (Directus)

- `services`, `blog_posts`, `testimonials`, `partners`, `site_settings`

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Home — hero, services, testimonials |
| `/exchange` | Live rates, historical chart, calculator |
| `/services` | All service offerings |
| `/blog` | Blog posts from Directus |
| `/about` | Company info |
| `/contact` | Contact form |

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # Lint check
npm run type-check   # TypeScript check
```

## Contact

Email: info@oyuns.mn | Web: [oyuns.mn](https://oyuns.mn)
