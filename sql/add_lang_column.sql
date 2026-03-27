-- Add lang column to licenses table for per-user language preference
-- Used for sending LINE notifications in the user's preferred language
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS lang TEXT DEFAULT 'th';
