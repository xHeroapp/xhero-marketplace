# Backend Implementation Documentation

## 2026-02-10 - Dynamic Marketing Banners

**Feature:** Dynamic Marketing Banners (Home Hero, CTA, Coupon)

**Description:**
Migrated hardcoded marketing banners to a Supabase table `marketing_banners`. This enables dynamic updates from the Admin Panel.
Created `marketing_banners` table with `meta_data` JSONB column for component-specific styles (gradients, colors).

**SQL / Backup Codes:**
```sql
-- Create Enum Type
DO $$ BEGIN
    CREATE TYPE banner_location AS ENUM ('home_hero', 'home_mid_cta', 'home_bottom_coupon', 'category_header');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Table
CREATE TABLE IF NOT EXISTS marketing_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location banner_location NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  button_text TEXT DEFAULT 'Buy Now',
  meta_data JSONB DEFAULT '{}'::jsonb,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

## 2026-02-20 - Fix Wallet Payment Error (Ambiguous Function Overload)

**Feature:** Fix `process_vendor_order` wallet payment failure

**Description:**
Every marketplace wallet payment was failing with a generic error. Root cause: PostgREST returned HTTP 300 (Multiple Choices) because there were 4 overloaded versions of `process_vendor_order` with overlapping signatures. PostgREST could not resolve which function to call. Fix: dropped the 3 legacy overloads, keeping only the latest version (with `p_delivery_location_id` support). Also fixed a secondary bug where `validators.assert_org_active(v_organization_id)` was called before `v_organization_id` was populated from the employee lookup (moved it after the employee context query).

**SQL / Backup Codes:**
```sql
-- Migration 1: Drop legacy overloads
DROP FUNCTION IF EXISTS public.process_vendor_order(uuid, jsonb, numeric, numeric);
DROP FUNCTION IF EXISTS public.process_vendor_order(uuid, jsonb, text, text);
DROP FUNCTION IF EXISTS public.process_vendor_order(uuid, jsonb, numeric, numeric, text, text);

-- Migration 2: Fix assert_org_active ordering in remaining overload
-- (Moved validators.assert_org_active(v_organization_id) to AFTER the employee context
-- lookup that populates v_organization_id)
CREATE OR REPLACE FUNCTION public.process_vendor_order(
  p_vendor_id uuid,
  p_items jsonb,
  p_payment_method text,
  p_reference text DEFAULT NULL::text,
  p_delivery_location_id text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  v_employee_id uuid := auth.uid();
  v_order_id uuid := gen_random_uuid();
  v_vendor_order_id uuid := gen_random_uuid();
  v_reference_final text := coalesce(p_reference, gen_random_uuid()::text);
  v_subtotal numeric := 0;
  v_total numeric := 0;
  v_discount numeric := 0;
  v_delivery_fee numeric := 0;
  v_delivery_fee_type delivery_fee_type := 'fixed';
  v_delivery_location_name text;
  v_wallet_balance numeric;
  v_organization_id uuid;
  v_department_id uuid;
begin
  if v_employee_id is null then raise exception 'Unauthorized'; end if;
  perform validators.assert_system_enabled('marketplace_checkout');
  perform validators.assert_system_enabled('wallet_debit');
  perform validators.assert_user_active(v_employee_id);
  perform validators.assert_vendor_active(p_vendor_id);
  if jsonb_array_length(p_items) = 0 then raise exception 'Order must contain at least one item'; end if;
  if p_payment_method not in ('wallet', 'bank_transfer') then raise exception 'Invalid payment method'; end if;
  select organization_id, department_id into v_organization_id, v_department_id from employees where user_id = v_employee_id;
  if v_organization_id is null then raise exception 'Employee organization not found'; end if;
  perform validators.assert_org_active(v_organization_id); -- FIXED: moved after employee context
  select delivery_fee, delivery_fee_type, matched_location_name into v_delivery_fee, v_delivery_fee_type, v_delivery_location_name from calculate_vendor_delivery_fee(p_vendor_id, p_delivery_location_id);
  if v_delivery_fee is null then v_delivery_fee := 0; end if;
  select sum(coalesce((item->>'override_price')::numeric, vp.price) * (item->>'quantity')::int),
         sum(case when (item->>'override_price') is null and vp.discount_value is not null and (vp.discount_expires_at is null or vp.discount_expires_at > now())
                  then case when vp.discount_type = 'percentage' then vp.price * (item->>'quantity')::int * vp.discount_value / 100 else vp.discount_value * (item->>'quantity')::int end else 0 end)
  into v_subtotal, v_discount from jsonb_array_elements(p_items) item join vendor_products vp on vp.id = (item->>'vendor_product_id')::uuid where vp.vendor_id = p_vendor_id;
  if v_subtotal is null or v_subtotal = 0 then raise exception 'Invalid products for vendor'; end if;
  v_total := v_subtotal + v_delivery_fee - v_discount;
  if v_total < 0 then v_total := 0; end if;
  if p_payment_method = 'wallet' then
    select points_balance into v_wallet_balance from employees where user_id = v_employee_id for update;
    if v_wallet_balance < v_total then raise exception 'Insufficient wallet balance'; end if;
  end if;
  insert into orders (id, user_id, total_amount, status, reference, created_at) values (v_order_id, v_employee_id, v_total, 'pending'::order_status, v_reference_final, now());
  insert into vendor_orders (id, order_id, vendor_id, customer_id, total_amount, status, reference, created_at, delivery_fee, delivery_fee_type, delivery_location_id)
    values (v_vendor_order_id, v_order_id, p_vendor_id, v_employee_id, v_total, case when p_payment_method = 'wallet' then 'paid' else 'pending' end, v_reference_final, now(), v_delivery_fee, v_delivery_fee_type, p_delivery_location_id);
  insert into vendor_order_items (id, vendor_order_id, vendor_product_id, quantity, price_at_order, order_id)
    select gen_random_uuid(), v_vendor_order_id, (item->>'vendor_product_id')::uuid, (item->>'quantity')::int, vp.price, v_order_id from jsonb_array_elements(p_items) item join vendor_products vp on vp.id = (item->>'vendor_product_id')::uuid;
  insert into transactions (type, reference, organization_id, department_id, employee_id, vendor_id, amount_points, status)
    values (case when p_payment_method = 'wallet' then 'EMP_ODR_WALLET_DBT' else 'EMP_ODR_BANK_TRF' end, v_reference_final, v_organization_id, v_department_id, v_employee_id, p_vendor_id, v_total, case when p_payment_method = 'wallet' then 'success' else 'pending' end);
  if p_payment_method = 'wallet' then update employees set points_balance = points_balance - v_total where user_id = v_employee_id; end if;
  return v_order_id;
exception when others then raise;
end;
$function$;
```

## 2026-02-20 - Realtime Wallet Balance Sync (Supabase Realtime)

**Feature:** Live wallet balance updates via Supabase Realtime

**Description:**
Wallet balance in the sidebar (`Offcanvas.tsx`) was stale after backend-only changes (e.g., order cancellations by Superadmin, HR sending cash rewards). This was because `useGetUser` cached employee data for 5 minutes (`staleTime`). Fix: created a `RealtimeBalanceSync` component (`src/hooks/useRealtimeBalance.ts`) that subscribes to Supabase Realtime `postgres_changes` on the `employees` table, filtered to the current user's row. When `points_balance` changes on the backend, the Zustand auth store is patched instantly. Mounted globally in `Provider.tsx`. Also removed redundant `useGetUser().refetch()` calls from `CheckoutWallet.tsx`, `CheckoutServiceWallet.tsx`, and `CheckoutFlashSaleWallet.tsx`.

**SQL / Backup Codes:**
```sql
-- No database changes needed. The `employees` table was already in the
-- supabase_realtime publication alongside `notifications` and `chat_messages`.
-- Verification query:
-- SELECT schemaname, tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

## 2026-02-20 - Image Optimization (3-Phase)

**Feature:** Marketplace-wide Image Optimization

**Description:**
Phase 1: Refactored `ImageWithFallback` component from raw `<img>` to Next.js `<Image>` with `fill` mode. Removed the eager `useEffect` pre-load that defeated lazy loading. All 20+ consumer components now automatically get WebP/AVIF conversion, responsive `srcSet`, and proper lazy loading via Next.js image optimizer. `next.config.mjs` already had Supabase remote patterns configured.

Phase 2: Created `src/utils/optimizeImageUrl.ts` utility that appends Supabase image transformation parameters (`?width=1200&quality=75`) to storage URLs. Applied to all 4 banner components (`HeroSlider.tsx`, `CtaArea.tsx`, `DiscountCouponCard.tsx`, `Category.tsx`). Non-Supabase URLs pass through unchanged.

Phase 3: Added `browser-image-compression` to the avatar upload flow in `UseUploadProfileImage` (`auth.queries.ts`). Compresses images to max 200KB / 500×500 / WebP before uploading to Supabase. Updated `EditProfile.tsx` pre-compression size guard from 5MB to 10MB.

**SQL / Backup Codes:**
```sql
-- No database changes needed. This was a frontend-only optimization.
-- No schema changes, no RPC changes, no table modifications.
```

## 2026-02-20 - Home Post-Featured Banner

**Feature:** New Marketing Banner Location (`home_post_featured`)

**Description:**
Added a new promotional banner location to the home page, specifically situated below the "Featured Products" section. Displayed using a new `PostFeaturedBanner` component that matches the styling of other banners (full width, clickable background image, leveraging the custom `optimizeImageUrl` utility).

**SQL / Backup Codes:**
```sql
ALTER TYPE banner_location ADD VALUE IF NOT EXISTS 'home_post_featured';
```

## 2026-02-21 - Realtime Banner Sync (Supabase Realtime)

**Feature:** Live marketing banner updates via Supabase Realtime

**Description:**
Deleted or updated marketing banners were briefly flashing ("ghost banner") on the marketplace before fresh data loaded. This was caused by React Query's stale-while-revalidate cache strategy — the browser showed cached banners instantly, then swapped them in the background. Fix: added `marketing_banners` to the `supabase_realtime` Postgres publication and created a `RealtimeBannerSync` component (`src/hooks/useRealtimeBanners.ts`) that subscribes to all `postgres_changes` events (INSERT, UPDATE, DELETE) on the `marketing_banners` table. When a superadmin changes any banner, the React Query cache is instantly invalidated. Mounted globally in `Provider.tsx` alongside `RealtimeBalanceSync`.

**SQL / Backup Codes:**
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE marketing_banners;
-- SELECT schemaname, tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

## 2026-02-21 - Category Selection Glitch Fix

**Feature:** Category selection stability in the Product Category slider

**Description:**
Fixed a bug where clicking a category in the `Category.tsx` image slider caused the active filter to briefly glitch and display products for the first category in the array (e.g., Beauty & Wellness). This occurred because the slider's `Link` only passed `category_id` to the URL. When the URL updated, local state read a `null` `category_name`, hitting a fallback condition (`else if (sortedCategories.length > 0)`) that forcibly selected the first category. Fixed by appending `&category_name=${item.name}` to the slider's `<Link>`, perfectly matching the URL format used by the Home page.

**SQL / Backup Codes:**
```sql
-- No SQL changes required. Frontend bug only.
```

## 2026-02-21 - Fix Missing Service Orders on Unified Orders Page

**Feature:** Fix `process_service_order` RPC + `all_orders_unified_view`

**Description:**
Service orders placed via the marketplace were invisible on the unified Orders page. Root cause: the `process_service_order` RPC inserted into `service_orders` and `transactions` but never created a parent row in the `orders` table. The `all_orders_unified_view` uses `orders` as the driving table (`FROM orders o LEFT JOIN service_orders s ON o.id = s.id AND o.order_type = 'service'`), so any service order without a matching `orders` row was excluded.

Fix (3 parts):
1. **Backfilled** orphaned service orders into `orders` with `order_type = 'service'`.
2. **Updated `process_service_order` RPC** to insert a parent row into `orders` (with `order_type = 'service'`) *before* inserting into `service_orders`. Also moved the employee context lookup above the validator calls to fix assertion ordering.
3. **Recreated `all_orders_unified_view`** so the `status` column reads from the correct source per order type: `service_orders.status` for services, `voucher_orders.status` for vouchers, `orders.status` for goods (previously hardcoded to `orders.status` for all types, which wouldn't reflect service/voucher status changes).

**SQL / Backup Codes:**
```sql
-- Backfill orphaned service orders into orders table
INSERT INTO orders (id, user_id, total_amount, status, reference, created_at, order_type)
SELECT so.id, so.user_id, so.total_amount, 'pending'::order_status, so.reference, so.created_at, 'service'
FROM service_orders so LEFT JOIN orders o ON o.id = so.id WHERE o.id IS NULL;

-- Updated process_service_order RPC (key addition: INSERT INTO orders before INSERT INTO service_orders)
CREATE OR REPLACE FUNCTION process_service_order(
  p_vendor_product_id uuid, p_service_mode text, p_start_date date, p_payment_method text,
  p_end_date date default null, p_start_time time default null, p_duration_minutes integer default null,
  p_note text default null, p_reference text default null
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER AS $$
declare
  v_user_id uuid := auth.uid();
  v_service_order_id uuid := gen_random_uuid();
  v_reference_final text := coalesce(p_reference, gen_random_uuid()::text);
  v_price numeric; v_vendor_id uuid; v_wallet_balance numeric; v_organization_id uuid; v_department_id uuid;
begin
  if v_user_id is null then raise exception 'Unauthorized'; end if;
  select organization_id, department_id into v_organization_id, v_department_id from employees where user_id = v_user_id;
  if v_organization_id is null then raise exception 'Employee organization not found'; end if;
  perform validators.assert_system_enabled('marketplace_checkout');
  perform validators.assert_system_enabled('wallet_debit');
  perform validators.assert_department_active(v_department_id);
  perform validators.assert_user_active(v_user_id);
  perform validators.assert_org_active(v_organization_id);
  if p_payment_method not in ('wallet', 'bank_transfer') then raise exception 'Invalid payment method'; end if;
  select vp.price, vp.vendor_id into v_price, v_vendor_id from vendor_products vp where vp.id = p_vendor_product_id and vp.type = 'service';
  if v_price is null or v_price <= 0 then raise exception 'Invalid service product'; end if;
  if p_service_mode not in ('one_time', 'multi_day', 'time_based') then raise exception 'Invalid service mode'; end if;
  if p_service_mode = 'one_time' and p_end_date is not null then raise exception 'One-time service cannot have end date'; end if;
  if p_service_mode = 'multi_day' and p_end_date is null then raise exception 'Multi-day service requires end date'; end if;
  if p_service_mode = 'time_based' then
    if p_duration_minutes is null or p_start_time is null then raise exception 'Time-based service requires start time and duration'; end if;
  end if;
  if exists (select 1 from service_orders so where so.vendor_product_id = p_vendor_product_id and so.status in ('pending','confirmed')
    and ((so.service_mode='multi_day' and p_service_mode='multi_day' and so.start_date<=coalesce(p_end_date,p_start_date) and so.end_date>=p_start_date)
    or (so.service_mode='one_time' and p_service_mode='one_time' and so.start_date=p_start_date and (so.start_time is null or p_start_time is null or so.start_time=p_start_time))
    or (so.service_mode='time_based' and p_service_mode='time_based' and so.start_date=p_start_date and so.start_time<(p_start_time+(p_duration_minutes||' minutes')::interval) and (so.start_time+(so.duration_minutes||' minutes')::interval)>p_start_time)))
  then raise exception 'Service is not available for the selected date/time'; end if;
  if p_payment_method = 'wallet' then
    select points_balance into v_wallet_balance from employees where user_id = v_user_id for update;
    if v_wallet_balance < v_price then raise exception 'Insufficient wallet balance'; end if;
  end if;
  -- NEW: Parent row in orders table
  insert into orders (id, user_id, total_amount, status, reference, created_at, order_type)
    values (v_service_order_id, v_user_id, v_price, 'pending'::order_status, v_reference_final, now(), 'service');
  insert into service_orders (id, user_id, vendor_id, vendor_product_id, service_mode, start_date, end_date, start_time, duration_minutes, total_amount, note, reference, created_at)
    values (v_service_order_id, v_user_id, v_vendor_id, p_vendor_product_id, p_service_mode, p_start_date, p_end_date, p_start_time, p_duration_minutes, v_price, p_note, v_reference_final, now());
  insert into transactions (type, reference, organization_id, department_id, employee_id, vendor_id, amount_points, status)
    values (case when p_payment_method='wallet' then 'EMP_SVC_WALLET_DBT' else 'EMP_SVC_BANK_TRF' end, v_reference_final, v_organization_id, v_department_id, v_user_id, v_vendor_id, v_price, case when p_payment_method='wallet' then 'success' else 'pending' end);
  if p_payment_method = 'wallet' then update employees set points_balance = points_balance - v_price where user_id = v_user_id; end if;
  return v_service_order_id;
end;
$$;

-- Recreated unified view with per-type status logic
DROP VIEW IF EXISTS all_orders_unified_view;
CREATE VIEW all_orders_unified_view AS
SELECT o.id AS order_id, o.order_type AS type, o.reference, o.total_amount,
  CASE WHEN o.order_type='service' THEN s.status::text WHEN o.order_type='voucher' THEN v.status::text ELSE o.status::text END AS status,
  o.created_at, o.user_id, e.full_name AS employee_name, e.email AS employee_email, e.avatar_url AS employee_avatar, e.phone AS employee_phone, e.delivery_address,
  COALESCE(vendor_g.name, vendor_s.name, vendor_v.name) AS vendor_name,
  COALESCE(vendor_g.avatar_url, vendor_s.avatar_url, vendor_v.avatar_url) AS vendor_logo,
  COALESCE(vendor_g.address, vendor_s.address, vendor_v.address) AS vendor_address,
  COALESCE(pi.product_name, p_svc.name, p_vch.name, 'Unknown Item') AS item_name,
  COALESCE(pi.product_img_url, (SELECT image_url FROM product_images WHERE product_id=p_svc.id LIMIT 1), (SELECT image_url FROM product_images WHERE product_id=p_vch.id LIMIT 1)) AS item_image,
  pi.quantity, pi.price_at_order AS price, pi.vendor_status AS payment_status,
  s.start_date AS service_start_date, v.recipient_email AS voucher_recipient, s.service_mode, s.note AS order_note,
  COALESCE(vo_fee.delivery_fee, 0) AS delivery_fee, (pi.vendor_order_id)::text AS vendor_order_id,
  COALESCE((pi.order_item_id)::text, (o.id)::text) AS unique_track_id, o.readable_id
FROM orders o
  LEFT JOIN employees e ON o.user_id = e.user_id
  LEFT JOIN order_items_view pi ON o.id = pi.order_id AND o.order_type = 'goods'
  LEFT JOIN vendor_orders vo_fee ON pi.vendor_order_id = vo_fee.id
  LEFT JOIN vendors vendor_g ON pi.vendor_id = vendor_g.id
  LEFT JOIN service_orders s ON o.id = s.id AND o.order_type = 'service'
  LEFT JOIN vendor_products vp_svc ON s.vendor_product_id = vp_svc.id
  LEFT JOIN products p_svc ON vp_svc.product_id = p_svc.id
  LEFT JOIN vendors vendor_s ON s.vendor_id = vendor_s.id
  LEFT JOIN voucher_orders v ON o.id = v.id AND o.order_type = 'voucher'
  LEFT JOIN vendor_products vp_vch ON v.vendor_product_id = vp_vch.id
  LEFT JOIN products p_vch ON vp_vch.product_id = p_vch.id
  LEFT JOIN vendors vendor_v ON v.vendor_id = vendor_v.id;
```

## 2026-02-27 - Markup Display Price Integration

**Feature:** Markup Display Price — Marketplace Frontend Integration

**Description:**
The backend `vendor_products_view` now exposes a computed `display_price` column that applies the vendor's markup fee. For markup vendors, `display_price = price × (1 + fee_percentage/100)`. For all other vendors, `display_price = price`. Both checkout RPCs (`process_vendor_order`, `process_service_order`) now accept an optional `p_expected_total` parameter for price-drift protection.

Frontend changes:
1. **Query layer** — Added `display_price` to the explicit `select()` in `useGetRelatedProducts` (`products.queries.ts`). All other queries use `select("*")` and pick it up automatically.
2. **Cart store** — `getVendorTotal()` in `cartStore.ts` now uses `item.display_price ?? item.price` for subtotal calculation (fallback covers items persisted in localStorage before this deploy).
3. **UI components (9 files)** — All product price rendering swapped from `price` to `display_price ?? price`: `ProductsGrid.tsx`, `VendorShop.tsx`, `SingleProductArea.tsx`, `TopProducts.tsx`, `WeeklyBestSellers.tsx`, `FeaturedProducts.tsx`, `CartArea.tsx`, `Checkout.tsx`, `WishList.tsx`.
4. **Checkout summary** — `CheckoutWallet.tsx` payment summary redesigned: shows Order Amount + Delivery Fee + Total (removed redundant Wallet Balance / Balance After Payment rows since the wallet card above already displays the balance).
5. **RPC protection** — `useHandlePayment.ts` now passes `p_expected_total: orderAmount.total` in the RPC payload. If the server detects a price mismatch, the error handler shows the toast and redirects the employee to `/cart` to see updated prices.

**SQL / Backup Codes:**
```sql
-- No database changes needed. The display_price column and p_expected_total
-- parameter were already added to the backend prior to this frontend integration.
-- Verification: SELECT display_price FROM vendor_products_view LIMIT 1;
```
