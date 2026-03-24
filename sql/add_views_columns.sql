-- ============================================================
-- Add views columns to tables that don't have them yet
-- Tables: jobs, events
-- (used_items, forum_posts, webzine_articles already have views)
-- ============================================================

-- Jobs: add views column
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Events: add views column
ALTER TABLE events ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
