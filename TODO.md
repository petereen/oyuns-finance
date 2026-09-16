# Project Task Tracker

## Current Milestone
- [x] Restore contact-form message delivery through a server-side Directus endpoint (src/app/api/messages/route.ts, src/lib/directus.ts)
- [x] Add the messages collection to Directus schema initialization and setup documentation (scripts/init-directus.mjs, docs/DIRECTUS_SETUP.md, docs/COMPLETE_SETUP.md)
- [x] Fill missing exchange-rate calendar days with the latest uploaded rate and render a continuous graph (src/lib/supabase.ts, src/app/[lang]/exchange/page.tsx, src/components/ExchangeRateChart.tsx)

## Completed Tasks
- [x] Apply liquid-glass visual system across the core web UI (globals.css, Navbar, homepage cards, calculator, service/testimonial cards, Footer)
- [x] Show both Mongolian and Russian contact phone numbers on the web (Footer.tsx, contact/page.tsx)
- [x] Render Directus rich-text HTML with scoped web styles and preserve editor font choices (blog/[slug]/page.tsx, globals.css)
