-- Inspire Decor inventory foundation.
-- Safe to run repeatedly: all DDL is additive and uses IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS inventory_items (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  base_price numeric(12, 2),
  pricing_unit text NOT NULL DEFAULT 'each',
  total_stock integer CHECK (total_stock IS NULL OR total_stock >= 0),
  reserved_stock integer NOT NULL DEFAULT 0 CHECK (reserved_stock >= 0),
  out_on_hire_stock integer NOT NULL DEFAULT 0 CHECK (out_on_hire_stock >= 0),
  damaged_stock integer NOT NULL DEFAULT 0 CHECK (damaged_stock >= 0),
  missing_stock integer NOT NULL DEFAULT 0 CHECK (missing_stock >= 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_variants (
  id text PRIMARY KEY,
  inventory_item_id text NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  variant_name text NOT NULL,
  stock_quantity integer CHECK (stock_quantity IS NULL OR stock_quantity >= 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (inventory_item_id, variant_name)
);

ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS reserved_stock integer NOT NULL DEFAULT 0;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS out_on_hire_stock integer NOT NULL DEFAULT 0;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS damaged_stock integer NOT NULL DEFAULT 0;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS missing_stock integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS stock_movements (
  id text PRIMARY KEY,
  inventory_item_id text NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
  variant_id text REFERENCES inventory_variants(id) ON DELETE RESTRICT,
  movement_type text NOT NULL CHECK (movement_type IN (
    'INITIAL_STOCK', 'STOCK_ADJUSTMENT', 'RESERVED', 'RELEASED',
    'CHECKED_OUT', 'RETURNED', 'DAMAGED', 'MISSING', 'CORRECTION'
  )),
  quantity integer NOT NULL CHECK (quantity >= 0),
  reference_type text,
  reference_id text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inventory_items_category_idx ON inventory_items(category);
CREATE INDEX IF NOT EXISTS inventory_items_active_idx ON inventory_items(active);
CREATE INDEX IF NOT EXISTS inventory_variants_item_idx ON inventory_variants(inventory_item_id);
CREATE INDEX IF NOT EXISTS stock_movements_item_created_idx ON stock_movements(inventory_item_id, created_at DESC);
CREATE INDEX IF NOT EXISTS stock_movements_variant_created_idx ON stock_movements(variant_id, created_at DESC);
