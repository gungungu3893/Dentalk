-- ============================================================
-- Phase 5-4: Reviews (리뷰/평점) 테이블 + RLS
-- ============================================================

CREATE TABLE IF NOT EXISTS reviews (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     TEXT NOT NULL,
  product_id  TEXT NOT NULL,
  rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews (product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_product ON reviews (user_id, product_id);

-- RLS 활성화
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon select reviews"
  ON reviews FOR SELECT
  TO anon USING (true);

CREATE POLICY "Allow anon insert reviews"
  ON reviews FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "Allow anon update reviews"
  ON reviews FOR UPDATE
  TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon delete reviews"
  ON reviews FOR DELETE
  TO anon USING (true);
