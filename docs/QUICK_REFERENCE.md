# OYUNS ALL-IN-ONE — QUICK REFERENCE (Cheat Sheet)

> First-time setup? Go to **[COMPLETE_SETUP.md](COMPLETE_SETUP.md)** instead. This page is a reference card for day-to-day work.

---

## Commands

```bash
npm run dev          # Dev server → http://localhost:3000
npm run build        # Production build
npm run start        # Serve prod build locally
npm run lint         # Lint check
npm run lint:fix     # Auto-fix lint issues
npm run type-check   # TypeScript check
```

## Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus.com
DIRECTUS_STATIC_TOKEN=your-token

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-key

NEXT_PUBLIC_SITE_URL=https://oyuns.mn
```

## Key Files

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Home page |
| `src/app/exchange/page.tsx` | Exchange rates + chart |
| `src/app/services/page.tsx` | Services page |
| `src/app/blog/page.tsx` | Blog listing |
| `src/app/about/page.tsx` | About page |
| `src/app/contact/page.tsx` | Contact page |
| `src/lib/supabase.ts` | Supabase client + rate queries |
| `src/lib/directus.ts` | Directus client + CMS queries |
| `next.config.ts` | Next.js configuration |

## Components

| Component | File | Purpose |
|-----------|------|---------|
| Navbar | `src/components/Navbar.tsx` | Navigation bar |
| Footer | `src/components/Footer.tsx` | Site footer |
| ServiceCard | `src/components/ServiceCard.tsx` | Service display card |
| ExchangeRateChart | `src/components/ExchangeRateChart.tsx` | Historical rate chart |
| TestimonialCard | `src/components/TestimonialCard.tsx` | Testimonial card |

## Database Schema (Supabase)

### bot_rates (individual rates)
| Column | Type |
|--------|------|
| `id` | Serial PK |
| `buy_rate` | Numeric(10,4) |
| `sell_rate` | Numeric(10,4) |
| `updated_at` | Timestamp |
| `created_at` | Timestamp |

### business_rates
| Column | Type |
|--------|------|
| `id` | Serial PK |
| `b2c_rate` | Numeric(10,4) |
| `b2b_rate` | Numeric(10,4) |
| `updated_at` | Timestamp |
| `created_at` | Timestamp |

## CMS Collections (Directus)

| Collection | Key Fields |
|-----------|-----------|
| `services` | title, slug, description, features, category, telegram_link |
| `blog_posts` | title, slug, excerpt, content, author, published_date |
| `testimonials` | author, content, rating |
| `partners` | name, logo, url |
| `site_settings` | key, value |

## API Quick Examples

```typescript
// Supabase — latest individual rate
const botRate = await getLatestBotRate();

// Supabase — latest business rate
const businessRate = await getLatestBusinessRate();

// Supabase — historical rates (chart)
const history = await getBotRateHistory(30); // last 30 days

// Directus — services
const services = await getServices('client');

// Directus — blog posts
const posts = await getBlogPosts(10);
```

## Pages & Routes

| Route | Page |
|-------|------|
| `/` | Home |
| `/exchange` | Exchange rates, chart, calculator |
| `/services` | Services listing |
| `/blog` | Blog posts |
| `/about` | About company |
| `/contact` | Contact form |

## Git Workflow

```bash
git checkout -b feature/your-feature
# make changes…
git add .
git commit -m "feat: description"
git push origin feature/your-feature
# create PR on GitHub → merge → auto-deploys
```

## Deploy to VPS

```bash
# Option 1 — Manual
ssh deploy@YOUR_SERVER_IP
~/deploy.sh

# Option 2 — Git push (if GitHub Actions CI/CD is set up)
git add .
git commit -m "Update: description"
git push origin main
# GitHub Actions deploys automatically
```

### PM2 Commands

```bash
pm2 status                    # Check app status
pm2 logs oyuns-finance        # Live logs
pm2 restart oyuns-finance     # Restart app
pm2 monit                     # Monitoring dashboard
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails | Delete `.next/`, rebuild. Check TypeScript errors. |
| Env vars not loading | Restart dev server. Names are case-sensitive. |
| Directus 404 | Check URL and token. Ensure collections exist. |
| Supabase connection fails | Verify URL and API keys. Check tables exist. |
| Rates show `—` | Insert at least one row into `bot_rates` / `business_rates`. |

## Documentation Map

| Doc | Purpose |
|-----|---------|
| [COMPLETE_SETUP.md](COMPLETE_SETUP.md) | **Master guide** — start here |
| [SUPABASE_SETUP.md](SUPABASE_SETUP.md) | Database deep reference |
| [DIRECTUS_SETUP.md](DIRECTUS_SETUP.md) | CMS deep reference |
| [VPS_DEPLOYMENT.md](VPS_DEPLOYMENT.md) | VPS deployment deep reference |
| This file | Day-to-day cheat sheet |
