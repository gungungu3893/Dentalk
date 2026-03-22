-- ============================================================
-- Dentalk — 누락 컬럼 추가 마이그레이션 (재실행 안전)
-- Supabase SQL Editor에 붙여넣기 후 실행하세요.
-- HTTP 400 에러 원인: 코드에서 조회하는 컬럼이 테이블에 없음
-- ============================================================

-- ── orders 테이블 ───────────────────────────────────────────
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_nickname   TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS clinic          TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS addr            TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS phone           TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS line_id         TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items           JSONB NOT NULL DEFAULT '[]';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stage           TEXT NOT NULL DEFAULT 'submitted';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS design_versions JSONB NOT NULL DEFAULT '[]';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS review_history  JSONB NOT NULL DEFAULT '[]';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS cases           JSONB NOT NULL DEFAULT '[]';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS carrier         TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS date            TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS created_at      TIMESTAMPTZ NOT NULL DEFAULT now();

-- ── custom_orders 테이블 ────────────────────────────────────
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS user_nickname   TEXT;
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS clinic          TEXT;
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS addr            TEXT;
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS phone           TEXT;
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS line_id         TEXT;
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS cases           JSONB NOT NULL DEFAULT '[]';
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS stage           TEXT NOT NULL DEFAULT 'submitted';
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS design_versions JSONB NOT NULL DEFAULT '[]';
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS review_history  JSONB NOT NULL DEFAULT '[]';
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS carrier         TEXT;
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS date            TEXT;
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS created_at      TIMESTAMPTZ NOT NULL DEFAULT now();

-- ── forum_posts 테이블 ──────────────────────────────────────
ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS comments  JSONB NOT NULL DEFAULT '[]';
ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS date      TEXT;
ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS region    TEXT NOT NULL DEFAULT 'all';
ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS province  TEXT NOT NULL DEFAULT 'all';

-- ── events 테이블 ───────────────────────────────────────────
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS type   TEXT NOT NULL DEFAULT 'event';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS region TEXT NOT NULL DEFAULT 'all';

-- ── used_items 테이블 ───────────────────────────────────────
ALTER TABLE public.used_items ADD COLUMN IF NOT EXISTS date      TEXT;
ALTER TABLE public.used_items ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.used_items ADD COLUMN IF NOT EXISTS is_sold   BOOLEAN NOT NULL DEFAULT false;

-- ── licenses 테이블 ─────────────────────────────────────────
ALTER TABLE public.licenses ADD COLUMN IF NOT EXISTS leader_region TEXT;
ALTER TABLE public.licenses ADD COLUMN IF NOT EXISTS leader_title  TEXT;
ALTER TABLE public.licenses ADD COLUMN IF NOT EXISTS phone         TEXT;
ALTER TABLE public.licenses ADD COLUMN IF NOT EXISTS address       TEXT;

-- ── banners 테이블 ──────────────────────────────────────────
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS advertiser_name TEXT NOT NULL DEFAULT '';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS link_url        TEXT DEFAULT '';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS clicks          INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS impressions     INTEGER NOT NULL DEFAULT 0;

-- ============================================================
-- 완료! 모든 누락 컬럼이 추가되었습니다.
-- 이 SQL은 IF NOT EXISTS를 사용하므로 이미 있는 컬럼은 건너뜁니다.
-- ============================================================
