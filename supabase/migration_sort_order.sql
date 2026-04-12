-- Migration: Add sort_order to categories and products
-- Run this in the Supabase SQL Editor

-- Add sort_order to categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order INTEGER;

-- Initialise existing rows with a stable order based on created_at
UPDATE categories
SET sort_order = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS rn
  FROM categories
) sub
WHERE categories.id = sub.id;

-- Make sort_order NOT NULL with a default after backfill
ALTER TABLE categories ALTER COLUMN sort_order SET DEFAULT 0;

-- Add sort_order to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INTEGER;

-- Initialise existing rows: order within each category by created_at
UPDATE products
SET sort_order = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY created_at ASC) AS rn
  FROM products
) sub
WHERE products.id = sub.id;

ALTER TABLE products ALTER COLUMN sort_order SET DEFAULT 0;

-- Indexes for efficient ORDER BY queries
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories (sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products (category_id, sort_order ASC);
