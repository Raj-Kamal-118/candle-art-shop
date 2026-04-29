-- ============================================================
-- Candle Art Shop – Supabase Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  image         TEXT,
  product_count INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id                     TEXT PRIMARY KEY,
  name                   TEXT NOT NULL,
  slug                   TEXT UNIQUE NOT NULL,
  description            TEXT,
  price                  INTEGER NOT NULL,           -- stored in paise/cents
  compare_at_price       INTEGER,
  category_id            TEXT REFERENCES categories(id) ON DELETE SET NULL,
  images                 TEXT[]   NOT NULL DEFAULT '{}',
  tags                   TEXT[]   NOT NULL DEFAULT '{}',
  in_stock               BOOLEAN  NOT NULL DEFAULT TRUE,
  stock_count            INTEGER  NOT NULL DEFAULT 0,
  featured               BOOLEAN  NOT NULL DEFAULT FALSE,
  customizable           BOOLEAN  NOT NULL DEFAULT FALSE,
  customization_options  JSONB    NOT NULL DEFAULT '[]',
  visible_on_storefront  BOOLEAN  NOT NULL DEFAULT TRUE,
  is_upsell              BOOLEAN  NOT NULL DEFAULT FALSE,
  upsell_message         TEXT,
  upsell_rules           JSONB    NOT NULL DEFAULT '{}',
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Discounts
CREATE TABLE IF NOT EXISTS discounts (
  id                TEXT PRIMARY KEY,
  code              TEXT UNIQUE NOT NULL,
  type              TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value             NUMERIC NOT NULL,
  min_order_amount  NUMERIC NOT NULL DEFAULT 0,
  max_uses          INTEGER NOT NULL DEFAULT 100,
  used_count        INTEGER NOT NULL DEFAULT 0,
  expires_at        TIMESTAMPTZ,
  active            BOOLEAN NOT NULL DEFAULT TRUE,
  one_use_per_customer BOOLEAN NOT NULL DEFAULT FALSE
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id               TEXT PRIMARY KEY,
  status           TEXT NOT NULL DEFAULT 'pending',
  items            JSONB NOT NULL DEFAULT '[]',
  subtotal         NUMERIC NOT NULL,
  discount         NUMERIC NOT NULL DEFAULT 0,
  shipping         NUMERIC NOT NULL DEFAULT 0,
  total            NUMERIC NOT NULL,
  discount_code    TEXT,
  shipping_address JSONB,
  billing_address  JSONB,
  payment_method   TEXT,
  payment_reference TEXT,
  refund_status    TEXT NOT NULL DEFAULT 'none' CHECK (refund_status IN ('none', 'pending', 'partial', 'full')),
  refunded_amount  NUMERIC NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id             TEXT PRIMARY KEY,
  order_id       TEXT,
  product_name   TEXT,
  customer_name  TEXT NOT NULL,
  location       TEXT,
  rating         INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text           TEXT NOT NULL,
  image_url      TEXT,
  approved       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Row-Level Security: disable public access, allow service role
-- ============================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews     ENABLE ROW LEVEL SECURITY;

-- Add columns safely if tables already exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS visible_on_storefront BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_upsell BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS upsell_message TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS upsell_rules JSONB NOT NULL DEFAULT '{}';
ALTER TABLE discounts ADD COLUMN IF NOT EXISTS one_use_per_customer BOOLEAN NOT NULL DEFAULT FALSE;

-- Service role bypasses RLS automatically, so no policies needed
-- for the server-side Next.js app. Public (anon) access is blocked.

-- ============================================================
-- Seed: categories
-- ============================================================
INSERT INTO categories (id, name, slug, description, image, product_count, created_at) VALUES
  ('cat-1', 'Scented Candles',  'scented-candles',  'Handcrafted candles with premium fragrance oils',  'https://picsum.photos/seed/cat1/800/600', 4, NOW()),
  ('cat-2', 'Art Candles',      'art-candles',       'Decorative candles that double as art pieces',     'https://picsum.photos/seed/cat2/800/600', 3, NOW()),
  ('cat-3', 'Candle Holders',   'candle-holders',    'Beautiful holders to showcase your candles',       'https://picsum.photos/seed/cat3/800/600', 2, NOW()),
  ('cat-4', 'Gift Sets',        'gift-sets',         'Curated sets perfect for gifting',                 'https://picsum.photos/seed/cat4/800/600', 2, NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Seed: products
-- ============================================================
INSERT INTO products (id, name, slug, description, price, compare_at_price, category_id, images, tags, in_stock, stock_count, featured, customizable, customization_options, created_at, updated_at) VALUES
  ('prod-1', 'Lavender Dreams Candle', 'lavender-dreams-candle',
   'A soothing blend of lavender and vanilla that fills your space with calming energy.',
   2999, 3999, 'cat-1',
   ARRAY['https://picsum.photos/seed/p1a/800/800','https://picsum.photos/seed/p1b/800/800'],
   ARRAY['lavender','vanilla','relaxing','scented'],
   TRUE, 24, TRUE, TRUE,
   '[{"label":"Scent Intensity","type":"select","options":["Light","Medium","Strong"]},{"label":"Custom Label","type":"text"}]'::jsonb,
   NOW(), NOW()),

  ('prod-2', 'Rose & Sandalwood Pillar', 'rose-sandalwood-pillar',
   'Elegant pillar candle with a romantic rose and woody sandalwood fragrance.',
   3499, NULL, 'cat-1',
   ARRAY['https://picsum.photos/seed/p2a/800/800','https://picsum.photos/seed/p2b/800/800'],
   ARRAY['rose','sandalwood','romantic','pillar'],
   TRUE, 18, TRUE, FALSE, '[]'::jsonb,
   NOW(), NOW()),

  ('prod-3', 'Geometric Art Candle', 'geometric-art-candle',
   'A stunning geometric candle that serves as both decor and fragrance source.',
   4999, 5999, 'cat-2',
   ARRAY['https://picsum.photos/seed/p3a/800/800','https://picsum.photos/seed/p3b/800/800'],
   ARRAY['geometric','modern','art','decorative'],
   TRUE, 12, TRUE, TRUE,
   '[{"label":"Color","type":"color"},{"label":"Fragrance","type":"select","options":["Citrus","Floral","Woody","Unscented"]}]'::jsonb,
   NOW(), NOW()),

  ('prod-4', 'Marble Effect Candle', 'marble-effect-candle',
   'Luxurious marble-effect candle that looks as good as it smells.',
   3999, NULL, 'cat-2',
   ARRAY['https://picsum.photos/seed/p4a/800/800'],
   ARRAY['marble','luxury','decorative'],
   TRUE, 8, FALSE, FALSE, '[]'::jsonb,
   NOW(), NOW()),

  ('prod-5', 'Crystal Candle Holder', 'crystal-candle-holder',
   'Hand-cut crystal holder that creates beautiful light patterns.',
   5999, 7499, 'cat-3',
   ARRAY['https://picsum.photos/seed/p5a/800/800','https://picsum.photos/seed/p5b/800/800'],
   ARRAY['crystal','holder','light','luxury'],
   TRUE, 15, TRUE, FALSE, '[]'::jsonb,
   NOW(), NOW()),

  ('prod-6', 'Luxury Gift Set', 'luxury-gift-set',
   'A curated set of 3 premium candles and a crystal holder – perfect for gifting.',
   9999, 12999, 'cat-4',
   ARRAY['https://picsum.photos/seed/p6a/800/800','https://picsum.photos/seed/p6b/800/800'],
   ARRAY['gift','luxury','set','premium'],
   TRUE, 10, TRUE, TRUE,
   '[{"label":"Gift Message","type":"text"},{"label":"Ribbon Color","type":"select","options":["Gold","Silver","Red","White"]}]'::jsonb,
   NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Seed: discounts
-- ============================================================
INSERT INTO discounts (id, code, type, value, min_order_amount, max_uses, used_count, expires_at, active, one_use_per_customer) VALUES
  ('disc-1', 'WELCOME10',  'percentage', 10,  0,    100, 0, NOW() + INTERVAL '1 year', TRUE, TRUE),
  ('disc-2', 'SAVE500',    'fixed',      500, 2000, 50,  0, NOW() + INTERVAL '6 months', TRUE, FALSE),
  ('disc-3', 'FESTIVE20',  'percentage', 20,  5000, 200, 0, NOW() + INTERVAL '3 months', TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Seed: reviews
-- ============================================================
INSERT INTO reviews (id, product_name, customer_name, location, rating, text, image_url, approved, created_at) VALUES
  ('rev-1', 'Amber Rose Soy Candle', 'Sarah M.', 'New York, NY', 5, 'The Amber Rose candle is absolutely divine. The scent fills my entire apartment without being overwhelming, and it burns so evenly. I''ve already ordered three more as gifts!', 'https://picsum.photos/seed/rev1/400/400', TRUE, NOW()),
  ('rev-2', 'Botanical Press Candle Art', 'James L.', 'San Francisco, CA', 5, 'I ordered the Botanical Press Candle Art as a birthday gift and the recipient was speechless. The craftsmanship is extraordinary — it''s truly a work of art that also functions as a candle.', 'https://picsum.photos/seed/rev2/400/400', TRUE, NOW() - INTERVAL '1 day'),
  ('rev-3', 'The Solstice Gift Collection', 'Emma T.', 'London, UK', 5, 'The Solstice Gift Collection was the perfect Christmas gift for my mother. Beautiful packaging, gorgeous scents, and the wooden box is something she''s kept on display. Worth every penny.', NULL, TRUE, NOW() - INTERVAL '2 days'),
  ('rev-4', 'Vanilla Bourbon Luxury Candle', 'Michael R.', 'Austin, TX', 4, 'Love the crackling wooden wick! The scent is very warm and cozy.', NULL, TRUE, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;
