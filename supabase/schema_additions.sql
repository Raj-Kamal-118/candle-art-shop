-- ============================================================
-- Schema Additions – Run AFTER base schema.sql
-- Paste into the Supabase SQL Editor and execute
-- ============================================================

-- ── Feature 1: Hero Section Settings ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hero_settings (
  id                    TEXT PRIMARY KEY DEFAULT 'main',
  badge_text            TEXT NOT NULL DEFAULT 'Handcrafted with love',
  h1_text               TEXT NOT NULL DEFAULT 'Light Your World',
  h1_highlighted_text   TEXT NOT NULL DEFAULT 'With Art',
  h1_text_color         TEXT NOT NULL DEFAULT '#e85d4a',
  description           TEXT NOT NULL DEFAULT 'Discover our collection of handcrafted candles, clay art, and creative crafts. Each piece is made with intention, using the finest natural ingredients and artistic craftsmanship.',
  buttons               JSONB NOT NULL DEFAULT '[{"text":"Shop Collection","link":"/products","icon":"arrow-right","variant":"primary"},{"text":"Custom Orders","link":"/categories/custom-artwork","icon":"","variant":"secondary"}]',
  background_type       TEXT NOT NULL DEFAULT 'gradient' CHECK (background_type IN ('gradient', 'color', 'image', 'video')),
  background_value      TEXT,
  show_images           BOOLEAN NOT NULL DEFAULT TRUE,
  images                JSONB NOT NULL DEFAULT '[{"url":"https://picsum.photos/seed/hero1/400/550","name":"Hand-poured Candles","link":"/categories/scented-candles","offerType":"Special Offer","offerText":"Free shipping on orders over ₹999"},{"url":"https://picsum.photos/seed/hero3/400/400","name":"Clay Art","link":"/categories/custom-artwork"},{"url":"https://picsum.photos/seed/hero2/400/400","name":"Gift Sets","link":"/gift-sets"},{"url":"https://picsum.photos/seed/hero4/400/550","name":"Home Decor","link":"/products"}]'::jsonb,
  show_stats            BOOLEAN NOT NULL DEFAULT TRUE,
  stats                 JSONB NOT NULL DEFAULT '[{"value":"500+","label":"Happy Customers"},{"value":"100%","label":"Natural Ingredients"},{"value":"11","label":"Signature Products"}]',
  floating_badge_text   TEXT DEFAULT 'Free shipping on Orders over ₹999',
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO hero_settings (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;

-- Ensure existing installations update the array type to JSONB
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_settings' AND column_name = 'images' AND data_type = 'ARRAY'
  ) THEN
    ALTER TABLE hero_settings ALTER COLUMN images DROP DEFAULT;
    ALTER TABLE hero_settings ALTER COLUMN images TYPE JSONB USING to_jsonb(images);
    ALTER TABLE hero_settings ALTER COLUMN images SET DEFAULT '[{"url":"https://picsum.photos/seed/hero1/400/550","name":"Hand-poured Candles","link":"/categories/scented-candles","offerType":"Special Offer","offerText":"Free shipping on orders over ₹999"},{"url":"https://picsum.photos/seed/hero3/400/400","name":"Clay Art","link":"/categories/custom-artwork"},{"url":"https://picsum.photos/seed/hero2/400/400","name":"Gift Sets","link":"/gift-sets"},{"url":"https://picsum.photos/seed/hero4/400/550","name":"Home Decor","link":"/products"}]'::jsonb;
  END IF;
END $$;

ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;

-- ── Feature 2: Category Banner Fields ─────────────────────────────────────────
ALTER TABLE categories ADD COLUMN IF NOT EXISTS banner_title       TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS banner_description TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS banner_image       TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS banner_bg_color    TEXT DEFAULT '#f5f0eb';
ALTER TABLE categories ADD COLUMN IF NOT EXISTS banner_buttons     JSONB DEFAULT '[]';
ALTER TABLE categories ADD COLUMN IF NOT EXISTS show_in_homepage   BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS magazine_items     JSONB DEFAULT '[]';

-- ── Feature 3: Product Variant Pricing ────────────────────────────────────────
-- variant_pricing is a JSON map: { "Option1Val|Option2Val": price_in_paise }
-- customization_options gains two new optional fields per option:
--   "id": string  (unique identifier for the option, used as key)
--   "affects_price": boolean  (when true, this option participates in variant pricing)
ALTER TABLE products ADD COLUMN IF NOT EXISTS variant_pricing JSONB NOT NULL DEFAULT '{}';

-- ── Feature 4: Users & OTP ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  phone       TEXT UNIQUE,
  name        TEXT,
  email       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS otp_sessions (
  id          TEXT PRIMARY KEY,
  phone       TEXT NOT NULL,
  otp         TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  verified    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id        TEXT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;

ALTER TABLE users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_sessions ENABLE ROW LEVEL SECURITY;

-- Ensure phone is no longer required (if table was created prior to email/Google auth)
ALTER TABLE IF EXISTS users ALTER COLUMN phone DROP NOT NULL;

-- ── Supabase Auth Sync Trigger ────────────────────────────────────────────────
-- Automatically sync users created via Supabase Auth (Google/Email) to the custom users table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone, created_at, updated_at)
  VALUES (
    new.id::text,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(public.users.name, EXCLUDED.name);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_otp_sessions_phone      ON otp_sessions(phone);
CREATE INDEX IF NOT EXISTS idx_otp_sessions_expires_at ON otp_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_orders_user_id          ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_users_phone             ON users(phone);

-- ── Product content extensions ────────────────────────────────────────────────
-- Additional rich-text sections below description, characteristics badges
-- (e.g. Burn time / Wick / Wax), and extra CTA buttons under Add to Cart.
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS additional_sections JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS characteristics     JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS extra_buttons       JSONB NOT NULL DEFAULT '[]';

-- ── Feature 5: Enhanced Reviews ───────────────────────────────────────────────
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS product_id TEXT REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_reviewed BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS rating INTEGER;
