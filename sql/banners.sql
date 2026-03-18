-- ============================================================
-- Phase 4-#1: banners 테이블 + RLS + Storage
-- ============================================================

-- 1) 테이블 생성
CREATE TABLE IF NOT EXISTS banners (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  advertiser_name TEXT NOT NULL DEFAULT '',
  image_url      TEXT NOT NULL,
  link_url       TEXT DEFAULT '',
  position       TEXT NOT NULL CHECK (position IN ('home_top','home_mid','forum_top','shop_bottom')),
  start_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date       DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  clicks         INTEGER NOT NULL DEFAULT 0,
  impressions    INTEGER NOT NULL DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) RLS 활성화
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (재실행 안전)
DROP POLICY IF EXISTS "banners_select_all"    ON banners;
DROP POLICY IF EXISTS "banners_insert_admin"  ON banners;
DROP POLICY IF EXISTS "banners_update_admin"  ON banners;
DROP POLICY IF EXISTS "banners_delete_admin"  ON banners;
DROP POLICY IF EXISTS "banners: anon read"    ON banners;
DROP POLICY IF EXISTS "banners: anon insert"  ON banners;
DROP POLICY IF EXISTS "banners: anon update"  ON banners;
DROP POLICY IF EXISTS "banners: anon delete"  ON banners;
DROP POLICY IF EXISTS "banners: service_role full access" ON banners;

-- 누구나 읽기 (anon key 호환)
CREATE POLICY "banners: anon read"
  ON banners FOR SELECT
  TO anon
  USING (true);

-- anon 쓰기 (앱에서 admin 체크 수행 — Supabase Auth 미사용)
CREATE POLICY "banners: anon insert"
  ON banners FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "banners: anon update"
  ON banners FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "banners: anon delete"
  ON banners FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "banners: service_role full access"
  ON banners FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3) 클릭/노출 카운트 증가 RPC (anon에서도 호출 가능)
CREATE OR REPLACE FUNCTION increment_banner_clicks(banner_id UUID)
RETURNS VOID AS $$
  UPDATE banners SET clicks = clicks + 1 WHERE id = banner_id;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_banner_impressions(banner_id UUID)
RETURNS VOID AS $$
  UPDATE banners SET impressions = impressions + 1 WHERE id = banner_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- 4) Storage 버킷 (Supabase Dashboard에서 생성하거나 아래 SQL)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true)
-- ON CONFLICT DO NOTHING;
