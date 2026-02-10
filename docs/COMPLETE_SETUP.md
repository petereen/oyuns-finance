# OYUNS FINANCE — STEP-BY-STEP SETUP GUIDE

> **This is the master guide.** Follow it from top to bottom to go from a fresh clone to a live website. Each step links to a deeper reference doc when one exists.

---

## How to Read the Documentation

| Document | What It Covers | When to Read |
|----------|----------------|--------------|
| **This file (`COMPLETE_SETUP.md`)** | Full walkthrough, Step 1→8 | **Start here** |
| [SUPABASE_SETUP.md](SUPABASE_SETUP.md) | Database tables, SQL, API examples | Step 3 — deep reference |
| [DIRECTUS_SETUP.md](DIRECTUS_SETUP.md) | CMS collections, permissions, sample data | Step 4 — deep reference |
| [VPS_DEPLOYMENT.md](VPS_DEPLOYMENT.md) | VPS, Nginx, PM2, SSL, CI/CD | Step 7 — deep reference |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Cheat sheet for daily commands & schemas | After setup — ongoing |

---

## Prerequisites

Before you begin, make sure you have:

- [ ] **Node.js 18+** installed — [download](https://nodejs.org/)
- [ ] **Git** installed — [download](https://git-scm.com/)
- [ ] A **GitHub** account — [sign up](https://github.com/)
- [ ] A **Supabase** account — [sign up](https://supabase.com/) (free tier works)
- [ ] A **Directus** account — [sign up](https://directus.cloud/) (or self-host)
- [ ] A **VPS** (Ubuntu 22.04+) — [DigitalOcean](https://digitalocean.com/), [Hetzner](https://hetzner.com/), [Vultr](https://vultr.com/), or similar
- [ ] A **domain name** (e.g. `oyuns.mn`) with DNS access

---

## Step 1 — Clone & Install

```bash
cd "c:\Users\temuu\Downloads\Oyuns Finance Website"
cd oyuns-finance
npm install
```

After this you should see `node_modules/` appear with no errors.

### Verify the install

```bash
npm run build
```

If the build succeeds, the code itself is healthy. You can ignore "cannot fetch" warnings — the backends aren't configured yet.

---

## Step 2 — Create Your Environment File

```bash
# Windows
copy .env.local.example .env.local
```

Open `.env.local` and you'll fill it in over the next two steps:

```env
# ── Directus (CMS) ──────────────────────────────
NEXT_PUBLIC_DIRECTUS_URL=           # ← Step 4
DIRECTUS_STATIC_TOKEN=              # ← Step 4

# ── Supabase (Database) ─────────────────────────
NEXT_PUBLIC_SUPABASE_URL=           # ← Step 3
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # ← Step 3
SUPABASE_SERVICE_ROLE_KEY=          # ← Step 3

# ── Site ─────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://oyuns.mn
```

> ⚠️ **Never commit `.env.local` to Git.** It is already in `.gitignore`.

---

## Step 3 — Set Up Supabase (Database)

> **Deep reference →** [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

### 3.1 Create a project

1. Open [supabase.com](https://supabase.com) → **New Project**
2. Name: `oyuns-finance`, pick closest region, generate a strong DB password
3. Wait for provisioning (~1 min)

### 3.2 Create the tables

Go to **SQL Editor** in the Supabase dashboard, paste and run each block:

**Table 1 — `bot_rates` (individual exchange rates):**

```sql
create table public.bot_rates (
  id serial not null,
  buy_rate numeric(10, 4) not null,
  sell_rate numeric(10, 4) not null,
  updated_at timestamp without time zone null,
  created_at timestamp without time zone null,
  constraint student_rates_pkey primary key (id)
) TABLESPACE pg_default;

create index if not exists idx_bot_rates_updated_at
  on public.bot_rates using btree (updated_at desc)
  TABLESPACE pg_default;
```

**Table 2 — `business_rates` (business exchange rates):**

```sql
create table public.business_rates (
  id serial not null,
  b2c_rate numeric(10, 4) not null,
  b2b_rate numeric(10, 4) not null,
  updated_at timestamp without time zone null
    default (now() AT TIME ZONE 'Europe/Moscow'::text),
  created_at timestamp without time zone null default now(),
  constraint business_rates_pkey primary key (id)
) TABLESPACE pg_default;

create index if not exists idx_business_rates_updated_at
  on public.business_rates using btree (updated_at desc)
  TABLESPACE pg_default;
```

> **Note:** The triggers (`trig_bot_rates`, `trig_business_rates`) and their functions (`trigger_bot_update`, `trigger_business_update`) are managed by your existing apps. You do **not** need to recreate them for the website.

### 3.3 Copy your API keys

1. In the Supabase dashboard go to **Settings → API**
2. Copy these three values into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # keep secret!
```

### 3.4 Verify

Insert a test row to confirm the table works:

```sql
INSERT INTO bot_rates (buy_rate, sell_rate, updated_at, created_at)
VALUES (45.5000, 46.0000, now(), now());
```

You should see it in **Table Editor → bot_rates**.

---

## Step 4 — Set Up Directus (CMS)

> **Deep reference →** [DIRECTUS_SETUP.md](DIRECTUS_SETUP.md)

### 4.1 Create a Directus project

**Option A — Directus Cloud (easiest):**
1. Go to [directus.cloud](https://directus.cloud/) → create a project
2. Copy the project URL (e.g. `https://your-project.directus.app`)

**Option B — Self-hosted (Docker):**
```bash
docker run -d -p 8055:8055 \
  -e KEY=random-key -e SECRET=random-secret \
  -e DB_CLIENT=postgres \
  -e DB_HOST=host -e DB_PORT=5432 \
  -e DB_DATABASE=directus -e DB_USER=directus -e DB_PASSWORD=password \
  directus/directus
```

### 4.2 Create collections

In the Directus admin panel → **Settings → Data Model**, create these 5 collections:

| # | Collection | Key Fields |
|---|-----------|-----------|
| 1 | `services` | title, slug, description, features (JSON), icon, telegram_link, category (client/business), sort, status |
| 2 | `blog_posts` | title, slug, excerpt, content (WYSIWYG), featured_image, author, published_date, category, tags, status |
| 3 | `testimonials` | author, content, rating (1-5), status |
| 4 | `partners` | name, logo, url, sort, status |
| 5 | `site_settings` | key (unique), value (JSON) |

> See [DIRECTUS_SETUP.md](DIRECTUS_SETUP.md) for the exact field types and sample data.

### 4.3 Set up permissions

For the **Public** role, grant **Read** access to all 5 collections (filter `status = published` where applicable).

### 4.4 Generate an API token

1. Go to **User Directory** → select your admin user
2. Scroll to **Admin Options → Token** → generate a **Static Token**
3. Copy it

### 4.5 Add to `.env.local`

```env
NEXT_PUBLIC_DIRECTUS_URL=https://your-project.directus.app
DIRECTUS_STATIC_TOKEN=your-static-token
```

### 4.6 Add sample content

Add at least 1 item per collection so pages have data to display. See [DIRECTUS_SETUP.md](DIRECTUS_SETUP.md) for JSON examples.

---

## Step 5 — Run Locally & Test

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and walk through every page:

| # | Page | URL | What to Check |
|---|------|-----|---------------|
| 1 | Home | `/` | Hero loads, services appear, testimonials show |
| 2 | Exchange | `/exchange` | Individual rates (buy/sell), business rates (B2C/B2B), historical chart, calculator |
| 3 | Services | `/services` | Service cards load from Directus |
| 4 | Blog | `/blog` | Posts load from Directus |
| 5 | About | `/about` | Static content renders |
| 6 | Contact | `/contact` | Form renders, info shows |

### What if a page is empty?

| Symptom | Cause | Fix |
|---------|-------|-----|
| Exchange rates show `—` | No rows in `bot_rates`/`business_rates` | Insert a rate row (Step 3.4) |
| Services/Blog empty | No items in Directus | Add sample data (Step 4.6) |
| Console: `Error fetching...` | Wrong URL or key in `.env.local` | Double-check env vars, restart dev server |
| Page 500 error | Env var missing entirely | Ensure `.env.local` has all 6 variables |

### Verify production build

```bash
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) again — everything should work identically.

---

## Step 6 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Oyuns Finance website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/oyuns-finance.git
git push -u origin main
```

> Make sure `.env.local` is **not** in the commit (it's gitignored by default).

---

## Step 7 — Deploy to VPS

> **Deep reference →** [VPS_DEPLOYMENT.md](VPS_DEPLOYMENT.md)

### 7.1 Prepare the server

SSH into your VPS and install dependencies:

```bash
ssh root@YOUR_SERVER_IP

# Create deploy user
adduser deploy
usermod -aG sudo deploy

# Install Node.js 20, Nginx, PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pm2

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 7.2 Clone & build on the server

```bash
su - deploy
git clone https://github.com/YOUR_USERNAME/oyuns-finance.git
cd oyuns-finance
npm ci --production=false
```

Create `.env.local` with your 6 environment variables, then:

```bash
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
```

### 7.3 Start with PM2

```bash
pm2 start .next/standalone/server.js --name oyuns-finance \
  -- --hostname 0.0.0.0 --port 3000
pm2 save
pm2 startup   # follow the printed command
```

### 7.4 Configure Nginx reverse proxy

```bash
sudo nano /etc/nginx/sites-available/oyuns-finance
```

```nginx
server {
    listen 80;
    server_name oyuns.mn www.oyuns.mn;

    location /_next/static {
        alias /home/deploy/oyuns-finance/.next/standalone/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/oyuns-finance /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### 7.5 DNS & SSL

1. Point your domain's **A record** to `YOUR_SERVER_IP`
2. Install SSL with Let's Encrypt:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d oyuns.mn -d www.oyuns.mn
```

### 7.6 Verify

Visit `https://oyuns.mn` — your site should be live with HTTPS.

### 7.7 Deploy updates

Create a deploy script (`~/deploy.sh`) for one-command updates:

```bash
cd /home/deploy/oyuns-finance
git pull origin main
npm ci --production=false
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
pm2 restart oyuns-finance
```

See [VPS_DEPLOYMENT.md](VPS_DEPLOYMENT.md) for the full script and optional GitHub Actions CI/CD.

---

## Step 8 — Post-Launch

### 8.1 Deployments

Run `~/deploy.sh` on the server, or set up GitHub Actions for automatic deploys on push to `main` (see [VPS_DEPLOYMENT.md](VPS_DEPLOYMENT.md#optional-github-actions-cicd-auto-deploy-on-push)).

### 8.2 Daily operations

| Task | Where | How |
|------|-------|-----|
| Update exchange rates | Your existing apps | They write to `bot_rates` & `business_rates` via triggers |
| Add a blog post | Directus admin panel | Create new item in `blog_posts`, set status to `published` |
| Add a new service | Directus admin panel | Create new item in `services` |
| Update company info | Directus admin panel | Edit `site_settings` collection |

### 8.3 Rollback a bad deploy

```bash
ssh deploy@YOUR_SERVER_IP
cd /home/deploy/oyuns-finance
git log --oneline -5          # find last good commit
git checkout <commit-hash>
npm ci --production=false && npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
pm2 restart oyuns-finance
```

### 8.4 Monitor

- **PM2** — `pm2 status`, `pm2 logs oyuns-finance`, `pm2 monit`
- **Nginx logs** — `sudo tail -f /var/log/nginx/access.log`
- **Server health** — `htop`, `df -h`, `free -h`
- **Google PageSpeed Insights** — Core Web Vitals
- **Supabase Dashboard** — database usage, query performance

---

## Project Structure Reference

```
oyuns-finance/
├── src/
│   ├── app/                          # Pages (Next.js App Router)
│   │   ├── layout.tsx               # Root layout (Navbar + Footer)
│   │   ├── page.tsx                 # Home page
│   │   ├── exchange/page.tsx        # Exchange rates + chart
│   │   ├── services/page.tsx        # Services listing
│   │   ├── blog/page.tsx            # Blog listing
│   │   ├── about/page.tsx           # About
│   │   └── contact/page.tsx         # Contact form
│   ├── components/                   # Reusable React components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── ExchangeRateChart.tsx    # Recharts-based rate chart
│   │   └── TestimonialCard.tsx
│   └── lib/                          # API clients
│       ├── directus.ts              # Directus SDK + helper functions
│       └── supabase.ts              # Supabase client + rate queries
├── docs/                             # You are here
├── public/                           # Static assets (images, favicon)
├── next.config.ts                    # Next.js config (images, headers)
├── package.json                      # Dependencies & scripts
└── tsconfig.json                     # TypeScript config
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm run build` fails | Delete `.next/` folder, run again. Check TypeScript errors. |
| Env vars not loading | Restart dev server after editing `.env.local`. Var names are case-sensitive. |
| Directus returns 404 | Verify `NEXT_PUBLIC_DIRECTUS_URL`. Check that collections exist and are published. |
| Supabase "relation does not exist" | Tables haven't been created yet — run SQL from Step 3.2. |
| Exchange rates show `—` | No data rows in `bot_rates`/`business_rates` — insert one. |
| Nginx 502 Bad Gateway | App isn't running — `pm2 status`. Restart: `pm2 restart oyuns-finance`. |
| SSL not working | Check cert: `sudo certbot certificates`. Renew: `sudo certbot renew`. |
| Build fails on VPS | Low memory — add swap: `sudo fallocate -l 2G /swapfile`. See [VPS_DEPLOYMENT.md](VPS_DEPLOYMENT.md). |
| Custom domain not working | Check DNS propagation at [whatsmydns.net](https://www.whatsmydns.net/). Wait up to 24 hours. |

---

## Useful Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Serve production build locally
npm run lint         # Lint check
npm run lint:fix     # Auto-fix lint issues
npm run type-check   # TypeScript check
```

---

## Useful Links

| Resource | URL |
|----------|-----|
| Next.js Docs | https://nextjs.org/docs |
| Directus Docs | https://docs.directus.io |
| Supabase Docs | https://supabase.com/docs |
| Tailwind CSS Docs | https://tailwindcss.com/docs |
| PM2 Docs | https://pm2.keymetrics.io/docs/ |
| Nginx Docs | https://nginx.org/en/docs/ |
| Let's Encrypt | https://certbot.eff.org/ |
| Recharts Docs | https://recharts.org |
| Framer Motion Docs | https://motion.dev |
