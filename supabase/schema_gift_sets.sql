-- ============================================================
-- Gift Sets feature schema
-- Run in Supabase SQL Editor after schema.sql and schema_additions.sql
-- ============================================================

-- Premade gift sets
CREATE TABLE IF NOT EXISTS gift_sets (
  id          TEXT PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  tagline     TEXT,
  description TEXT,
  occasions   TEXT[] NOT NULL DEFAULT '{}',  -- ['birthday', 'diwali', etc.]
  price       INTEGER NOT NULL,              -- in paise (bundle price)
  saving      INTEGER NOT NULL DEFAULT 0,   -- bundle discount vs. sum of individual prices
  image       TEXT,
  accent      TEXT NOT NULL DEFAULT 'var(--amber-600)',
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('live','draft','archived')),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Junction: which products are in each gift set
CREATE TABLE IF NOT EXISTS gift_set_products (
  gift_set_id  TEXT NOT NULL REFERENCES gift_sets(id) ON DELETE CASCADE,
  product_id   TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (gift_set_id, product_id)
);

-- RLS
ALTER TABLE gift_sets         ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_set_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read gift_sets"         ON gift_sets;
DROP POLICY IF EXISTS "Public read gift_set_products" ON gift_set_products;

CREATE POLICY "Public read gift_sets"         ON gift_sets         FOR SELECT USING (true);
CREATE POLICY "Public read gift_set_products" ON gift_set_products FOR SELECT USING (true);

-- ============================================================
-- Seed data — 6 premade gift sets (items must reference real
-- product IDs from your products table; update IDs below to
-- match your actual product IDs after inserting products).
-- ============================================================
INSERT INTO gift_sets (id, slug, name, tagline, description, occasions, price, saving, image, accent, status, sort_order) VALUES
  ('set-quiet','the-quiet-evening','The Quiet Evening',
    'A small ritual for after 9pm.',
    'Made for people who turn their phones off. A curated collection of our most calming pieces.',
    ARRAY['selfcare','housewarm'],
    178000, 22000,
    'https://picsum.photos/seed/set-quiet/800/900',
    'var(--amber-600)', 'live', 1),

  ('set-cheer','the-housewarming','The Housewarming',
    'A little of everything for a new home.',
    'The basics, but considered. Perfect for anyone moving into a new space.',
    ARRAY['housewarm','wedding'],
    154000, 14000,
    'https://picsum.photos/seed/set-cheer/800/900',
    'var(--coral-600)', 'live', 2),

  ('set-reader','the-reader','The Reader',
    'For the one who finishes every book.',
    'A pairing of scent, warmth, and quiet ritual — for those who read until the candle burns out.',
    ARRAY['birthday','thank'],
    118000, 10000,
    'https://picsum.photos/seed/set-reader/800/900',
    'var(--forest-700)', 'live', 3),

  ('set-diwali','diwali-glow','Diwali Glow',
    'A festival in a box.',
    'Everything you need to light up the season. Warm, celebratory, and deeply considered.',
    ARRAY['diwali'],
    168000, 18000,
    'https://picsum.photos/seed/set-diwali/800/900',
    'var(--gold-600)', 'live', 4),

  ('set-desk','the-desk-companion','The Desk Companion',
    'For the person who works from home.',
    'A collection of small beautiful things for the desk. Because the space you work in matters.',
    ARRAY['newjob'],
    162000, 16000,
    'https://picsum.photos/seed/set-desk/800/900',
    'var(--forest-600)', 'live', 5),

  ('set-luxe','the-luxe','The Luxe',
    'Our most-gifted set.',
    'The full expression of the Artisan House universe. For the person who deserves the very best.',
    ARRAY['anni','wedding'],
    248000, 26000,
    'https://picsum.photos/seed/set-luxe/800/900',
    'var(--brown-800)', 'live', 6)
ON CONFLICT (id) DO NOTHING;

-- NOTE: Add product IDs to gift_set_products after seeding gift sets.
-- Example (replace product IDs with real ones from your products table):
--
-- INSERT INTO gift_set_products (gift_set_id, product_id, sort_order) VALUES
--   ('set-quiet', 'your-candle-product-id', 1),
--   ('set-quiet', 'your-magnet-product-id', 2)
-- ON CONFLICT DO NOTHING;
