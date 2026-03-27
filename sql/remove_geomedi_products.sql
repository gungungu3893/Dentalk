-- ============================================================
-- Remove all GeoMedi products from Supabase products table
-- Run this after deploying the code changes that remove GeoMedi
-- from PRODUCTS constant in shop.js
-- ============================================================

-- Delete GeoMedi products by matching name
DELETE FROM products
WHERE name ILIKE '%GeoMedi%';

-- Also clean up any orders referencing GeoMedi product IDs
-- (items is JSONB array — this query finds orders containing GeoMedi items)
-- NOTE: This is informational only. Orders are historical records
-- and should generally NOT be deleted. Uncomment if needed.
--
-- SELECT id, user_nickname, items
-- FROM orders
-- WHERE items::text ILIKE '%GeoMedi%';
