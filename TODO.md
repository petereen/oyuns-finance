# Project Task Tracker

## Current Milestone
- [x] Replace the hero’s static blue gradient with a paused-when-hidden WebGL mesh-drift background (src/components/WebGLMeshBackground.tsx, src/app/[lang]/page.tsx, src/app/globals.css)
- [x] Add the WebGL1 mesh-drift renderer with packed uniforms, current OYUNS blue palette, DPR cap, reduced-motion fallback, visibility pause, and pointer pass-through (src/components/WebGLMeshBackground.tsx)
- [x] Mount the shader behind the localized hero content and remove the old static floating blobs (src/app/[lang]/page.tsx)
- [x] Restore contact-form message delivery through a server-side Directus endpoint (src/app/api/messages/route.ts, src/lib/directus.ts)
- [x] Add the messages collection to Directus schema initialization and setup documentation (scripts/init-directus.mjs, docs/DIRECTUS_SETUP.md, docs/COMPLETE_SETUP.md)
- [x] Fill missing exchange-rate calendar days with the latest uploaded rate and render a continuous graph (src/lib/supabase.ts, src/app/[lang]/exchange/page.tsx, src/components/ExchangeRateChart.tsx)
- [x] Add the reusable InfiniteSlider and Directus-backed partner logo presentation (src/components/ui/infinite-slider.tsx, src/components/PartnerLogoSlider.tsx)
- [x] Add shadcn utility configuration and slider dependencies (components.json, src/lib/utils.ts, package.json)

## Completed Tasks
- [x] Render the branded 404 view directly from the locale catch-all route (src/app/[lang]/[...notFound]/page.tsx)
- [x] Route all unmatched locale URLs through the branded 404 view (src/app/[lang]/[...notFound]/page.tsx)
- [x] Build a branded localized 404 page with OYUNS, RUB, and MNT transaction illustrations (src/app/[lang]/not-found.tsx, src/app/globals.css)
- [x] Apply liquid-glass visual system across the core web UI (globals.css, Navbar, homepage cards, calculator, service/testimonial cards, Footer)
- [x] Show both Mongolian and Russian contact phone numbers on the web (Footer.tsx, contact/page.tsx)
- [x] Render Directus rich-text HTML with scoped web styles and preserve editor font choices (blog/[slug]/page.tsx, globals.css)
