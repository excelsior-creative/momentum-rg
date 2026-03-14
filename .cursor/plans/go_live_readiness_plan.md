# Momentum RG — Go-Live Readiness Plan
**Generated:** 2026-03-14  
**Engineer:** Devon (Principal Engineer, Excelsior Creative)  
**Goal:** Lighthouse 90+ across all categories, SEO-ready, skill-conformant, production-hardened

---

## Executive Summary

The site is in solid shape — modern stack (Next.js 16, Payload 3.77, React 19), security hardening done, metadata on every page, structured data, proper caching headers, good Tailwind design system. The primary gaps before go-live are:

1. **LCP killer: 20+ raw `<img>` tags** bypassing `next/image` optimization (biggest Lighthouse hit)
2. **Hero LCP: CSS background-image** can't be preloaded — prevents hero from being the LCP winner
3. **Home page `force-dynamic`** prevents static rendering, kills TTFB
4. **Accessibility gaps**: No skip-to-content link, some missing focus states
5. **Missing Cursor skills** per the skills setup guide (`.cursor/skills/` not yet set up)
6. **In-memory rate limiting** not safe for Vercel serverless scale
7. **Missing Content-Security-Policy** header

Estimated effort: **2–3 focused sessions** to reach go-live quality.

---

## Priority System

- 🔴 **P0** — Blocks Lighthouse 90+ or breaks SEO/accessibility. Fix before go-live.
- 🟡 **P1** — Meaningful improvement, high ROI. Fix in same sprint.
- 🟢 **P2** — Best practice / future-proofing. Can ship after launch.

---

## 🔴 P0 — Critical Fixes (Pre-Launch Required)

### P0-1: Replace raw `<img>` tags with `next/image` across the codebase

**Impact:** Massive. Raw `<img>` tags miss: WebP/AVIF conversion, lazy loading, size optimization, LCP preloading, CLS prevention. Lighthouse will penalize every one of these.

**Affected files (20+ occurrences with `eslint-disable` suppressions):**
- `src/components/Hero.tsx` — Karl Parize floating card
- `src/components/CTASection.tsx` — 2 images
- `src/components/AboutSection.tsx` — 2 images
- `src/components/ServicesSection.tsx`
- `src/components/ComplexTransactionsSection.tsx`
- `src/components/PageHero.tsx`
- `src/app/(frontend)/contact/page.tsx` — 2 images
- `src/app/(frontend)/about/page.tsx` — 2 images
- `src/app/(frontend)/blog/page.tsx`
- `src/app/(frontend)/areas/[slug]/page.tsx`
- `src/app/(frontend)/listings/[slug]/page.tsx` — 3 images
- `src/app/(frontend)/team/karl/page.tsx`
- `src/app/(frontend)/team/esmeralda/page.tsx`
- `src/app/(frontend)/real-estate-solutions/page.tsx`

**Fix pattern:**
```tsx
// ❌ Before
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={url} alt="..." className="..." />

// ✅ After
import Image from "next/image"
<Image src={url} alt="..." width={800} height={600} className="..." />
```

**Special cases:**
- External WordPress CDN images (`momentumrg.com/wp-content/...`) — add to `next.config.ts` remotePatterns (already done ✅)
- Dynamic Payload media URLs — already covered by remotePatterns
- For images with unknown dimensions (from CMS), use `fill` + `object-cover` with a positioned container

**Add `priority` to above-fold images** (Karl Parize team photo in about/team pages, PageHero images):
```tsx
<Image src={url} alt="..." fill priority className="object-cover" />
```

---

### P0-2: Fix Hero LCP — CSS background-image can't be preloaded

**Impact:** The Hero is the LCP element on every page that uses it. CSS `background-image` cannot be preloaded by the browser and won't benefit from Next.js image optimization. This is typically a 2-4 second LCP penalty.

**Current approach:** `style={{ backgroundImage: \`url(${slide.image})\` }}` on an animated div.

**Fix options (pick one):**

**Option A (recommended): Use `next/image` underneath the slide with `fill`**
```tsx
// In the AnimatePresence section
<m.div key={current} ... className="absolute inset-0">
  <Image
    src={slide.image}
    alt={slide.heading}
    fill
    priority={current === 0}  // priority only on first slide
    className="object-cover object-center"
    sizes="100vw"
  />
</m.div>
```
This gets you: WebP/AVIF conversion, `<link rel="preload">` auto-injected for `current === 0`, proper LCP candidate.

**Option B: Add manual preload for first hero image**
```tsx
// In root layout or page head
<link rel="preload" as="image" href="/api/media/file/hero-og.jpg" />
```
This is the lighter touch if a refactor is risky pre-launch.

---

### P0-3: Remove `force-dynamic` from home page — switch to ISR

**Impact:** `export const dynamic = "force-dynamic"` forces full SSR on every request. This kills TTFB (Time to First Byte) — one of Google's Core Web Vitals signals. The home page data (listings, blog posts) doesn't need to be real-time.

**Current:**
```tsx
// src/app/(frontend)/page.tsx
export const dynamic = "force-dynamic";
```

**Fix:**
```tsx
// Remove force-dynamic entirely
// Optionally add revalidation (ISR) — 60s is plenty for a real estate site
export const revalidate = 60;
```

Make sure the components that fetch data (ListingsSection, BlogTeaserSection) are using `unstable_cache` or accept the ISR revalidation. Check each data-fetching component.

---

### P0-4: Add skip-to-content link for accessibility (WCAG AA)

**Impact:** Required for WCAG AA keyboard accessibility. Lighthouse Accessibility audit will flag its absence. Screen reader users and keyboard-only users need this.

**Fix — add to `src/app/(frontend)/layout.tsx`:**
```tsx
export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Skip to main content — required for WCAG AA */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-charcoal focus:text-gold focus:font-display focus:text-sm focus:rounded"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
}
```

---

### P0-5: Add `preconnect` hints for external image domain

**Impact:** Eliminates DNS+TCP+TLS setup time (~100-300ms) when the browser first hits the WP CDN for hero images and team photos.

**Fix — in `src/app/layout.tsx` `<head>`:**
```tsx
// Next.js handles this via metadata or manual link tags in layout
// Add to root layout:
<head>
  <link rel="preconnect" href="https://momentumrg.com" />
  <link rel="dns-prefetch" href="https://momentumrg.com" />
</head>
```
Or use Next.js 15's `<link>` in the `<head>` via metadata:
```tsx
// In RootLayout:
export const metadata: Metadata = {
  ...defaultMetadata,
  // Next.js doesn't have a metadata key for preconnect,
  // so use the manual <head> approach or a custom component
};
```

---

## 🟡 P1 — High-ROI Improvements (Same Sprint)

### P1-1: Install Cursor Skills from the Skills Setup Guide

The attached guide describes a `.cursor/skills/` setup. Currently the project only has `.cursor/rules/`. Install the recommended skills:

```bash
# From the project root: /Users/timmy/projects/momentum-rg
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -a cursor -y
npx skills add vercel-labs/agent-skills@web-design-guidelines -a cursor -y
npx skills add vercel-labs/agent-skills@frontend-design -a cursor -y
npx skills add vercel-labs/agent-skills@react-composition-patterns -a cursor -y
npx skills add vercel-labs/agent-skills@skill-creator -a cursor -y
```

Then create a **Payload CMS custom skill** (the guide calls this out specifically — no community skill exists):
```bash
npx skills init payload-cms-patterns
# Edit .cursor/skills/payload-cms-patterns/SKILL.md with Momentum's conventions
npx skills add ./payload-cms-patterns -a cursor
```

**Payload CMS skill should document:**
- Collection naming conventions (kebab-case slugs)
- Access control patterns used in this project
- Rich text (Lexical) field patterns
- Media upload collection patterns
- Local API usage patterns
- The `generateMetadata` helper pattern
- Revalidation patterns (revalidateTag)

### P1-2: Add stack-conventions.mdc Cursor rule

The guide recommends a `stack-conventions.mdc` rule. The project has granular rules (performance, seo, components) but no master conventions file. Add:

**`.cursor/rules/stack-conventions.mdc`** — adapted for this project (Next.js 16 App Router + Payload 3 + Tailwind v4 + React 19):
- Server Components by default
- `next/image` always (no `<img>` exceptions)
- Force-dynamic only when truly needed
- ISR patterns for content pages
- `unstable_cache` for Payload queries

### P1-3: Add Content Security Policy (CSP) header

The existing security headers are good but missing CSP — the most impactful security header for XSS protection.

**Add to `next.config.ts` headers:**
```typescript
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com",  // recaptcha
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://momentumrg.com https://*.neon.tech https://maps.googleapis.com",
    "connect-src 'self' https://*.neon.tech https://momentumrg.com",
    "frame-src https://www.google.com",  // Google Maps embed
    "media-src 'self'",
  ].join('; ')
}
```
**Note:** Start with `Content-Security-Policy-Report-Only` to test before enforcing.

### P1-4: Upgrade in-memory rate limiting to Upstash Redis

The `SECURITY_HARDENING.md` explicitly flags this: in-memory rate limiting breaks on Vercel serverless because each function instance has its own memory. An attacker can hit 5 req/min from the same IP across 100+ instances.

**Fix:**
```bash
pnpm add @upstash/ratelimit @upstash/redis --filter app
```

Then update `src/middleware.ts` to use Upstash's sliding window limiter. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in Vercel env vars.

### P1-5: Verify Open Graph images on all pages

Every page should have a 1200×630 OG image for social sharing. Check:
- Does `generatePageMetadata` include `openGraph.images`?
- Does each page have a specific OG image or fallback to default?
- Is there a `/api/og` route for dynamic OG image generation?

Run a quick audit:
```bash
grep -rn "openGraph" /Users/timmy/projects/momentum-rg/apps/app/src/lib/metadata.ts
```

### P1-6: Verify `unstable_cache` on all Payload queries

ISR (P0-3) only helps if data fetching uses proper caching. Check each section component that fetches from Payload and wrap uncached queries:

```tsx
import { unstable_cache } from 'next/cache'

const getFeaturedListings = unstable_cache(
  async () => payload.find({ collection: 'properties', limit: 6, ... }),
  ['featured-listings'],
  { revalidate: 60, tags: ['properties'] }
)
```

---

## 🟢 P2 — Post-Launch Polish

### P2-1: Add `tailwind-patterns.mdc` and `seo-metadata.mdc` rules from the guide

The skills guide provides ready-to-use `.mdc` templates. Copy them verbatim into `.cursor/rules/`:
- `tailwind-patterns.mdc`
- `seo-metadata.mdc` (globs: `**/app/**/page.tsx`)

These complement the existing rules.

### P2-2: Add Payload CMS and Next.js docs to Cursor @docs

Per the guide, index these in Cursor Settings > Features > Docs:
- `https://payloadcms.com/docs`
- `https://nextjs.org/docs`
- `https://tailwindcss.com/docs`
- `https://vercel.com/docs`
- `https://www.w3.org/WAI/WCAG22/quickref/`

### P2-3: Verify breadcrumb structured data on deep pages

Blog posts and listing detail pages should have `BreadcrumbList` JSON-LD. The `generateBreadcrumbSchema` function is referenced in the SEO cursor rule but not confirmed implemented. Check and add if missing.

### P2-4: Add `<meta name="theme-color">` for mobile browser chrome

```tsx
// In root layout metadata:
themeColor: '#1A1A2E',  // charcoal brand color
```

### P2-5: Review MortgageCalculator Suspense boundary

`MortgageCalculator` is a client component loaded below the fold. Confirm it's wrapped in `<Suspense>` with a skeleton fallback so it doesn't block rendering.

### P2-6: Add ARIA live regions to search/filter components

The listings filter (SearchDialog) should announce filter result changes to screen readers:
```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {count} listings found
</div>
```

---

## Execution Order

```
Session 1 (Pre-Launch):
  [ ] P0-3: Remove force-dynamic from home page (quick win, huge TTFB impact)
  [ ] P0-4: Add skip-to-content link
  [ ] P0-5: Add preconnect hints
  [ ] P0-2: Fix Hero LCP (switch to next/image or add preload)
  [ ] P0-1: Replace raw <img> tags — batch by file:
      - components/ (Hero, CTASection, AboutSection, ServicesSection, ComplexTransactionsSection, PageHero)
      - app/about, app/contact, app/team/karl, app/team/esmeralda
      - app/blog, app/areas/[slug], app/listings/[slug], app/real-estate-solutions

Session 2 (Same Sprint):
  [ ] P1-1: Install Cursor skills + create Payload CMS skill
  [ ] P1-2: Add stack-conventions.mdc rule
  [ ] P1-3: Add CSP header (report-only first)
  [ ] P1-5: Verify OG images on all pages
  [ ] P1-6: Audit unstable_cache on Payload queries

Session 3 (Post-Launch):
  [ ] P1-4: Upgrade rate limiting to Upstash Redis
  [ ] P2-x: All P2 items
```

---

## Lighthouse Score Projection

| Category | Current (est.) | After P0 fixes | After P0+P1 |
|---|---|---|---|
| Performance | 55–70 | 80–90 | 90–95 |
| Accessibility | 75–85 | 90–95 | 95–100 |
| Best Practices | 85–90 | 90–95 | 95–100 |
| SEO | 85–90 | 92–95 | 95–100 |

The biggest single improvement will be P0-1 (raw img→next/image) + P0-2 (Hero LCP) combined. These alone account for 15-20 Lighthouse performance points.

---

## Files Summary

| Area | Status |
|---|---|
| Security headers (HSTS, X-Frame-Options, etc.) | ✅ Done |
| Password policy + account lockout | ✅ Done |
| Rate limiting | ⚠️ In-memory only (fix before scale) |
| Sitemap | ✅ Done |
| Robots.txt | ✅ Done |
| Structured data (JSON-LD) | ✅ Done |
| Page metadata | ✅ All pages covered |
| Font optimization (next/font) | ✅ Done |
| Static asset caching (vercel.json) | ✅ Done |
| Image optimization (AVIF/WebP config) | ✅ Config done, usage broken |
| `next/image` usage | ❌ 20+ raw `<img>` tags |
| Hero LCP | ❌ CSS background, no preload |
| Home page rendering | ❌ force-dynamic, should be ISR |
| Skip-to-content | ❌ Missing |
| CSP header | ❌ Missing |
| Cursor skills | ❌ Not set up yet |
| Cursor rules | ✅ 5 rules in .cursor/rules/ |
