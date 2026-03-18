-- ============================================================
-- Phase 5-2: 성능 최적화 인덱스
-- 자주 조회/필터링되는 컬럼에 인덱스 추가
-- ============================================================

-- custom_orders: 사용자별 조회, 날짜 정렬
CREATE INDEX IF NOT EXISTS idx_custom_orders_user_nickname ON custom_orders (user_nickname);
CREATE INDEX IF NOT EXISTS idx_custom_orders_date_desc ON custom_orders (date DESC);
CREATE INDEX IF NOT EXISTS idx_custom_orders_stage ON custom_orders (stage);

-- orders: 사용자별 조회, 생성일 정렬
CREATE INDEX IF NOT EXISTS idx_orders_user_nickname ON orders (user_nickname);
CREATE INDEX IF NOT EXISTS idx_orders_created_at_desc ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_stage ON orders (stage);

-- used_items: 생성일 정렬, 판매자별 조회
CREATE INDEX IF NOT EXISTS idx_used_items_created_at_desc ON used_items (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_used_items_seller ON used_items (seller);

-- forum_posts: 생성일 정렬, 카테고리/지역 필터
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at_desc ON forum_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts (category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_region ON forum_posts (region);

-- events: 날짜 정렬, 타입/지역 필터
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events (event_date ASC);
CREATE INDEX IF NOT EXISTS idx_events_type ON events (type);
CREATE INDEX IF NOT EXISTS idx_events_region ON events (region);

-- events_rsvp: 이벤트별 조회, 복합 인덱스
CREATE INDEX IF NOT EXISTS idx_events_rsvp_event_id ON events_rsvp (event_id);
CREATE INDEX IF NOT EXISTS idx_events_rsvp_event_status ON events_rsvp (event_id, status);

-- webzine_articles: 공개 여부 + 생성일 정렬
CREATE INDEX IF NOT EXISTS idx_webzine_published_date ON webzine_articles (is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webzine_category ON webzine_articles (category);

-- jobs: 활성 여부 + 생성일 정렬
CREATE INDEX IF NOT EXISTS idx_jobs_active_date ON jobs (is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs (type);
CREATE INDEX IF NOT EXISTS idx_jobs_region ON jobs (region);

-- banners: 활성 배너 위치별 조회, 날짜 범위
CREATE INDEX IF NOT EXISTS idx_banners_active_position ON banners (is_active, position);
CREATE INDEX IF NOT EXISTS idx_banners_date_range ON banners (start_date, end_date);

-- licenses: 닉네임 조회 (로그인), 역할 필터
CREATE INDEX IF NOT EXISTS idx_licenses_nickname ON licenses (nickname);
CREATE INDEX IF NOT EXISTS idx_licenses_role ON licenses (role);
CREATE INDEX IF NOT EXISTS idx_licenses_is_active ON licenses (is_active);
