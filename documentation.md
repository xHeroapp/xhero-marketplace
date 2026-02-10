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
