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
  images                TEXT[] NOT NULL DEFAULT ARRAY[
    'https://picsum.photos/seed/hero1/400/550',
    'https://picsum.photos/seed/hero3/400/400',
    'https://picsum.photos/seed/hero2/400/400',
    'https://picsum.photos/seed/hero4/400/550'
  ],
  show_stats            BOOLEAN NOT NULL DEFAULT TRUE,
  stats                 JSONB NOT NULL DEFAULT '[{"value":"500+","label":"Happy Customers"},{"value":"100%","label":"Natural Ingredients"},{"value":"11","label":"Signature Products"}]',
  floating_badge_text   TEXT DEFAULT 'Free shipping on Orders over ₹999',
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO hero_settings (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;

ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;

-- ── Feature 2: Category Banner Fields ─────────────────────────────────────────
ALTER TABLE categories ADD COLUMN IF NOT EXISTS banner_title       TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS banner_description TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS banner_image       TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS banner_bg_color    TEXT DEFAULT '#f5f0eb';
ALTER TABLE categories ADD COLUMN IF NOT EXISTS banner_buttons     JSONB DEFAULT '[]';
ALTER TABLE categories ADD COLUMN IF NOT EXISTS show_in_homepage   BOOLEAN NOT NULL DEFAULT TRUE;

-- ── Feature 3: Product Variant Pricing ────────────────────────────────────────
-- variant_pricing is a JSON map: { "Option1Val|Option2Val": price_in_paise }
-- customization_options gains two new optional fields per option:
--   "id": string  (unique identifier for the option, used as key)
--   "affects_price": boolean  (when true, this option participates in variant pricing)
ALTER TABLE products ADD COLUMN IF NOT EXISTS variant_pricing JSONB NOT NULL DEFAULT '{}';

-- ── Feature 4: Users & OTP ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  phone       TEXT UNIQUE NOT NULL,
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

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_otp_sessions_phone      ON otp_sessions(phone);
CREATE INDEX IF NOT EXISTS idx_otp_sessions_expires_at ON otp_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_orders_user_id          ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_users_phone             ON users(phone);
