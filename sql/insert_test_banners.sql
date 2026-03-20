-- ============================================================
-- 테스트 광고 배너 데이터 삽입
-- Supabase SQL Editor에서 실행
-- ============================================================

-- Step 1: position CHECK 제약조건 업데이트 (mobile_bottom, mobile_mid 추가)
ALTER TABLE banners DROP CONSTRAINT IF EXISTS banners_position_check;
ALTER TABLE banners ADD CONSTRAINT banners_position_check
  CHECK (position IN ('home_top','home_mid','forum_top','shop_bottom','mobile_bottom','mobile_mid'));

-- Step 2: 기존 테스트 배너 삭제 (중복 방지)
DELETE FROM banners WHERE advertiser_name IN ('BIOPLANT','BIOPLANT Mobile','BIOTEM Promo','Dental Expo 2026','CNC Custom Sale');

-- Step 3: 테스트 배너 삽입
INSERT INTO banners (advertiser_name, image_url, link_url, position, start_date, end_date, is_active, clicks, impressions)
VALUES
  ('BIOPLANT',
   'https://placehold.co/728x90/001d4a/D4AF37?text=BIOPLANT',
   '#', 'home_top',
   CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days',
   true, 0, 0),

  ('BIOPLANT Mobile',
   'https://placehold.co/320x50/001d4a/D4AF37?text=Mobile+Ad',
   '#', 'mobile_bottom',
   CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days',
   true, 0, 0),

  ('BIOTEM Promo',
   'https://placehold.co/300x250/001d4a/D4AF37?text=BIOTEM+Promo',
   '#', 'mobile_mid',
   CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days',
   true, 0, 0),

  ('Dental Expo 2026',
   'https://placehold.co/728x90/2563eb/ffffff?text=Dental+Expo',
   '#', 'forum_top',
   CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days',
   true, 0, 0),

  ('CNC Custom Sale',
   'https://placehold.co/728x90/16a34a/ffffff?text=CNC+Sale',
   '#', 'shop_bottom',
   CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days',
   true, 0, 0);
