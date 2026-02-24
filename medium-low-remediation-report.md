# Medium + Low Findings Remediation Report

Date: 2026-02-24

## Scope Completed

Implemented:
- All previously listed **Medium Severity** findings (items 4-8)
- **Low Severity / Best Practice** findings:
  - 10: stale vendor query key
  - 11: missing query enable guard

Included:
- A concrete implementation plan for finding 12 (CSS bloat)

## Implemented Changes

### 1) React Query client recreation fixed (Medium #4)
- File: `src/Provider/Provider.tsx`
- Change:
  - Replaced per-render `new QueryClient()` with stable initialization via `useState(() => new QueryClient())`.
- Impact:
  - Prevents cache resets and unnecessary refetches on provider re-renders.

### 2) Unified orders infinite pagination fixed (Medium #5)
- File: `src/queries/orders.queries.ts`
- Change:
  - Reworked `useGetUnifiedUserOrders` pagination:
    - returns `rawCount` (number of ungrouped rows fetched)
    - `getNextPageParam` now uses `lastPage.rawCount === limit ? pages.length : undefined`
  - Removed placeholder/infinite pagination logic that always returned `pages.length`.
- Impact:
  - Stops unbounded pagination fetch behavior.

### 3) Build safety restored (Medium #6)
- File: `next.config.mjs`
- Change:
  - Removed:
    - `eslint.ignoreDuringBuilds: true`
    - `typescript.ignoreBuildErrors: true`
- Impact:
  - Build now fails correctly on lint/type violations instead of shipping silently.

### 4) Query performance hardening (Medium #7)
- Files:
  - `src/queries/orders.queries.ts`
  - `src/queries/products.queries.ts`
  - `src/queries/vendors.queries.ts`
  - `src/queries/wishlist.queries.ts`
  - `src/queries/notifications.queries.ts`
- Changes:
  - Replaced wildcard selects with explicit field selection where safe and clear:
    - orders/service/unified order views
    - notifications list
    - product categories and related products
    - vendors list
  - Removed expensive exact-count work from list queries where count was not needed:
    - product items, vendors list, vendor product list, wishlist list
  - Kept `count: "exact"` where currently used by UI behavior (e.g., notifications/order totals).
- Impact:
  - Reduced payload size and DB count overhead on high-frequency list queries.

### 5) Sensitive/debug logging cleanup (Medium #8)
- Files:
  - `src/queries/auth.queries.ts`
  - `src/components/auth/callback/AuthCallback.tsx`
  - `src/services/processRewardOrder.service.ts`
  - `src/app/sign-in-magic-link/route.ts`
- Changes:
  - Removed debug `console.log` statements exposing auth/session/payload data.
  - Retained error-path logging where operationally useful.
- Impact:
  - Lowers risk of sensitive data leakage in logs.

### 6) Vendor query key and enable guard fixed (Low #10)
- File: `src/queries/vendors.queries.ts`
- Change:
  - Updated query key from `["get-vendor"]` to `["get-vendor", id]`
  - Added `enabled: !!id`
- Impact:
  - Prevents stale cache collisions and avoids invalid fetches.

### 7) User query enable guard restored (Low #11)
- File: `src/queries/auth.queries.ts`
- Change:
  - Enabled `enabled: !!user?.id` in `useGetUser`
- Impact:
  - Prevents avoidable user fetches before identity is available.

## Validation

Command run:
- `npm run lint`

Result:
- Fails due to existing project-wide lint issues not introduced by this patch (many pre-existing `no-img-element`, `react/no-unescaped-entities`, and hook dependency warnings/errors).
- No runtime test suite was executed in this pass.

## Finding #12: CSS Bloat Plan (Implementation Plan)

### Goal
Reduce CSS payload and render-blocking style cost without visual regressions.

### Phase 1: Measure and Inventory (1 day)
- Capture baseline:
  - CSS bundle size by route
  - Largest contentful paint (LCP), first contentful paint (FCP), and transfer size
- Inventory global imports:
  - `src/app/layout.tsx`
  - `src/styles/style.css`
  - `src/styles/style.scss`
  - `public/assets/css/*.css`

### Phase 2: De-duplicate and Remove Dead Imports (1-2 days)
- Remove duplicate bootstrap loading (`bootstrap.scss` + `bootstrap.min.css` both imported).
- Keep one source of truth:
  - Prefer Sass source if customization is needed, otherwise compiled CSS only.
- Remove unused vendor CSS files from global imports (migrate only required ones).

### Phase 3: Route/Feature-Level CSS Splitting (2-3 days)
- Move feature-specific styles from global bundle into component/route-scoped modules.
- Keep only reset/base/tokens globally.
- Lazy-load rare feature styles where possible (e.g., modal/review/support features).

### Phase 4: Purge + Minify Strategy (1-2 days)
- Add safe CSS purging strategy (PurgeCSS/Tailwind-style content scan equivalent for current stack).
- Ensure class safelist for dynamic classes.
- Verify production minification and compression (gzip/brotli) at deploy layer.

### Phase 5: Regression Guardrails (ongoing)
- Add CI budget checks:
  - Max CSS per route
  - Max global CSS bundle
- Add Lighthouse checks for key routes (`/home`, `/shop-grid`, `/product/[id]`).

### Expected Outcome
- Lower initial CSS bytes
- Faster first render/LCP on mobile
- Reduced style recalculation cost on route transitions

