-- ============================================================
-- 테스트 광고 배너 데이터 삽입
-- Supabase SQL Editor에서 실행
-- ============================================================

INSERT INTO banners (advertiser_name, image_url, link_url, position, start_date, end_date, is_active, clicks, impressions)
VALUES
  -- 1) HOME TOP
  ('BIOPLANT',
   'https://placehold.co/728x90/001d4a/D4AF37?text=BIOPLANT+Premium+Parts',
   '#',
   'home_top',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '3 months',
   true, 0, 0),

  -- 2) MOBILE BOTTOM
  ('BIOPLANT Mobile',
   'https://placehold.co/320x50/001d4a/D4AF37?text=BIOPLANT+Mobile+Ad',
   '#',
   'mobile_bottom',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '3 months',
   true, 0, 0),

  -- 3) MOBILE MID
  ('BIOTEM Promo',
   'https://placehold.co/300x250/001d4a/D4AF37?text=BIOTEM+Special+Offer',
   '#',
   'mobile_mid',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '3 months',
   true, 0, 0),

  -- 4) FORUM TOP
  ('Dental Expo 2026',
   'https://placehold.co/728x90/2563eb/ffffff?text=Dental+Expo+2026',
   '#',
   'forum_top',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '3 months',
   true, 0, 0),

  -- 5) SHOP BOTTOM
  ('CNC Custom Sale',
   'https://placehold.co/728x90/16a34a/ffffff?text=CNC+Custom+50%25+OFF',
   '#',
   'shop_bottom',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '3 months',
   true, 0, 0);
