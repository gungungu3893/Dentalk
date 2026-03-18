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

-- 누구나 읽기
CREATE POLICY "banners_select_all" ON banners
  FOR SELECT USING (true);

-- admin만 생성
CREATE POLICY "banners_insert_admin" ON banners
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM licenses WHERE nickname = current_setting('request.jwt.claims', true)::json->>'sub' AND role = 'admin')
  );

-- admin만 수정
CREATE POLICY "banners_update_admin" ON banners
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM licenses WHERE nickname = current_setting('request.jwt.claims', true)::json->>'sub' AND role = 'admin')
  );

-- admin만 삭제
CREATE POLICY "banners_delete_admin" ON banners
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM licenses WHERE nickname = current_setting('request.jwt.claims', true)::json->>'sub' AND role = 'admin')
  );

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
