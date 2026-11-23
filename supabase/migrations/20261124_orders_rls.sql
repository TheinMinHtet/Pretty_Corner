-- Reference Migration: Row Level Security (RLS) Policies for Pretty Corner
-- Apply these policies in Supabase SQL Editor for your project (e.g. delosykfbjvkjggldxxz / vbcdopdttqmplwnknppl)

-- 1. Enable Row Level Security (RLS) on sensitive orders and audit tables
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS inventory_adjustments ENABLE ROW LEVEL SECURITY;

-- 2. Restrict all orders operations exclusively to service_role (Next.js server-side backend)
DROP POLICY IF EXISTS "Service role manages orders" ON orders;
CREATE POLICY "Service role manages orders" 
ON orders FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages order items" ON order_items;
CREATE POLICY "Service role manages order items" 
ON order_items FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages inventory adjustments" ON inventory_adjustments;
CREATE POLICY "Service role manages inventory adjustments" 
ON inventory_adjustments FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- 3. Ensure the anonymous role (anon) has zero access to orders by default
REVOKE ALL ON orders FROM anon;
REVOKE ALL ON order_items FROM anon;
REVOKE ALL ON inventory_adjustments FROM anon;

-- 4. Enable public read access ONLY for active catalog products and categories
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" 
ON products FOR SELECT 
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public read categories" 
ON categories FOR SELECT 
TO anon, authenticated
USING (is_active = true);

-- 5. Service role maintains full management access over catalog tables
DROP POLICY IF EXISTS "Service role manages products" ON products;
CREATE POLICY "Service role manages products" 
ON products FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages categories" ON categories;
CREATE POLICY "Service role manages categories" 
ON categories FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);
