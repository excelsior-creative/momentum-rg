---
name: Build Performance Fixes
overview: Build bottleneck is NOT compilation (7.2s) -- it's Neon Postgres cold starts and connection overhead during Vercel builds. 13 build workers each initialize Payload and open a new DB connection. Combined with the migration step, this accounts for ~6 min of the 6.5 min build.
todos:
  - id: upgrade-payload
    content: Upgrade all Payload CMS packages from 3.69.0 to 3.77.0 and Next.js to 16.1.6
    status: completed
  - id: separate-migration
    content: Remove payload migrate from the build script — run it separately via Vercel deploy hook or build command override
    status: completed
  - id: remove-unused-deps
    content: Remove @tabler/icons-react, replicate, @google/genai, and graphql from package.json and clean up next.config.ts
    status: completed
  - id: optimize-imports
    content: Add recharts to optimizePackageImports in next.config.ts
    status: completed
  - id: verify-build
    content: Run build and verify everything works after changes
    status: completed
isProject: false
---

# Build Performance Analysis and Fixes

## Updated Diagnosis (post-upgrade to Payload 3.77.0)

After upgrading Payload from 3.69.0 to 3.77.0 and Next.js from 16.1.1 to 16.1.6, the build is still 6m30s. But the build output reveals the real bottleneck:

- **Turbopack compilation: 7.2s** -- fast
- **Static page generation: 1.5s** -- fast
- **CPU usage: 16%** (52s user / 6m36s wall) -- the build is IO-bound, NOT CPU-bound
- **Total: 6m30s** -- ~6 minutes is spent waiting on network

### The Real Bottleneck: Neon Postgres from Vercel Build

The build runs `payload migrate --force-accept-warning && next build`. During `next build`:

1. **Migration step** opens a cold connection to Neon Postgres (cold start penalty)
2. **13 build workers** each independently initialize Payload, each opening a NEW connection to Neon
3. Dynamic pages (`force-dynamic`) still require Payload initialization during the "Collecting page data" phase
4. Neon's serverless Postgres has **cold start latency of 1-5 seconds per connection**
5. With 13+ connections being established serially/in-parallel waves = ~6 min of waiting

## Proposed Fixes (updated, ranked by impact)

### Fix 1: Separate migration from build (HIGH impact, easy)

The `payload migrate` step adds a full cold DB connection + migration table check before `next build` even starts. Change in `[apps/app/package.json](apps/app/package.json)`:

```json
"build": "next build",
"db:migrate:prod": "payload migrate --force-accept-warning"
```

On Vercel, override the build command to `pnpm run db:migrate:prod && pnpm run build` only when migrations exist, or run migrations as a separate deploy step.

### Fix 2: Remove unused dependencies (MEDIUM impact, easy)

These packages are installed but never imported in source code:

- `@tabler/icons-react` -- **121MB** on disk, zero imports
- `replicate` -- zero imports
- `@google/genai` -- zero imports
- `graphql` -- zero imports (Payload bundles its own)

Removing them speeds up `pnpm install` and reduces the install footprint, which matters on Vercel where install time counts toward build time.

Also remove `@tabler/icons-react` from `optimizePackageImports` in `[apps/app/next.config.ts](apps/app/next.config.ts)`.

### Fix 3: Add recharts to optimizePackageImports (LOW impact, easy)

In `[apps/app/next.config.ts](apps/app/next.config.ts)`, add `recharts` to the list.

### Fix 4: Consider Neon connection pooling (MEDIUM impact, config change)

If not already using it, switch the `DATABASE_URL` to Neon's pooled connection string (port 6543 instead of 5432). This uses PgBouncer and avoids cold-start latency for each new connection.

### Fix 5: Reduce build-time DB connections (HIGH impact, moderate effort)

The `force-dynamic` pages still trigger Payload initialization during "Collecting page data". Options:

- Ensure build-time page data collection doesn't need DB access for dynamic pages
- Consider if some pages (privacy, terms, blog listing) could be ISR instead of `force-dynamic`, reducing build-time DB queries

