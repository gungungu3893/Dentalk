-- ============================================================
-- Dentalk — 전체 테이블 RLS 정책 수정 (한 번에 실행)
-- Supabase SQL Editor에 붙여넣기 후 실행하세요.
-- ※ 재실행 안전 (idempotent): 기존 정책 자동 삭제 후 재생성
-- ※ 이 앱은 Supabase Auth 미사용 → anon key 기반 REST API
-- ============================================================

-- ── 1. forum_posts ──────────────────────────────────────────
ALTER TABLE IF EXISTS public.forum_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "forum_posts: public read"              ON public.forum_posts;
DROP POLICY IF EXISTS "forum_posts: anon insert"              ON public.forum_posts;
DROP POLICY IF EXISTS "forum_posts: anon update own"          ON public.forum_posts;
DROP POLICY IF EXISTS "forum_posts: anon delete own"          ON public.forum_posts;
DROP POLICY IF EXISTS "forum_posts: service_role full access"  ON public.forum_posts;

CREATE POLICY "forum_posts: public read"
  ON public.forum_posts FOR SELECT TO anon USING (true);
CREATE POLICY "forum_posts: anon insert"
  ON public.forum_posts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "forum_posts: anon update own"
  ON public.forum_posts FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "forum_posts: anon delete own"
  ON public.forum_posts FOR DELETE TO anon USING (true);
CREATE POLICY "forum_posts: service_role full access"
  ON public.forum_posts FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 2. events ───────────────────────────────────────────────
ALTER TABLE IF EXISTS public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "events: public read"              ON public.events;
DROP POLICY IF EXISTS "events: anon insert"              ON public.events;
DROP POLICY IF EXISTS "events: anon update"              ON public.events;
DROP POLICY IF EXISTS "events: anon delete"              ON public.events;
DROP POLICY IF EXISTS "events: service_role full access"  ON public.events;

CREATE POLICY "events: public read"
  ON public.events FOR SELECT TO anon USING (true);
CREATE POLICY "events: anon insert"
  ON public.events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "events: anon update"
  ON public.events FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "events: anon delete"
  ON public.events FOR DELETE TO anon USING (true);
CREATE POLICY "events: service_role full access"
  ON public.events FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 3. webzine_articles ─────────────────────────────────────
ALTER TABLE IF EXISTS public.webzine_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "webzine: public read"              ON public.webzine_articles;
DROP POLICY IF EXISTS "webzine: anon insert"              ON public.webzine_articles;
DROP POLICY IF EXISTS "webzine: anon update"              ON public.webzine_articles;
DROP POLICY IF EXISTS "webzine: anon delete"              ON public.webzine_articles;
DROP POLICY IF EXISTS "webzine: service_role full access"  ON public.webzine_articles;

CREATE POLICY "webzine: public read"
  ON public.webzine_articles FOR SELECT TO anon USING (true);
CREATE POLICY "webzine: anon insert"
  ON public.webzine_articles FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "webzine: anon update"
  ON public.webzine_articles FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "webzine: anon delete"
  ON public.webzine_articles FOR DELETE TO anon USING (true);
CREATE POLICY "webzine: service_role full access"
  ON public.webzine_articles FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 4. used_items ───────────────────────────────────────────
ALTER TABLE IF EXISTS public.used_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "used_items: public read"              ON public.used_items;
DROP POLICY IF EXISTS "used_items: anon insert"              ON public.used_items;
DROP POLICY IF EXISTS "used_items: anon update own"          ON public.used_items;
DROP POLICY IF EXISTS "used_items: anon delete own"          ON public.used_items;
DROP POLICY IF EXISTS "used_items: service_role full access"  ON public.used_items;

CREATE POLICY "used_items: public read"
  ON public.used_items FOR SELECT TO anon USING (true);
CREATE POLICY "used_items: anon insert"
  ON public.used_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "used_items: anon update own"
  ON public.used_items FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "used_items: anon delete own"
  ON public.used_items FOR DELETE TO anon USING (true);
CREATE POLICY "used_items: service_role full access"
  ON public.used_items FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 5. jobs ─────────────────────────────────────────────────
ALTER TABLE IF EXISTS public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "jobs: public read"              ON public.jobs;
DROP POLICY IF EXISTS "jobs: anon insert"              ON public.jobs;
DROP POLICY IF EXISTS "jobs: anon update"              ON public.jobs;
DROP POLICY IF EXISTS "jobs: anon delete"              ON public.jobs;
DROP POLICY IF EXISTS "jobs: service_role full access"  ON public.jobs;

CREATE POLICY "jobs: public read"
  ON public.jobs FOR SELECT TO anon USING (true);
CREATE POLICY "jobs: anon insert"
  ON public.jobs FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "jobs: anon update"
  ON public.jobs FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "jobs: anon delete"
  ON public.jobs FOR DELETE TO anon USING (true);
CREATE POLICY "jobs: service_role full access"
  ON public.jobs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 6. banners ──────────────────────────────────────────────
ALTER TABLE IF EXISTS public.banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "banners_select_all"    ON public.banners;
DROP POLICY IF EXISTS "banners_insert_admin"  ON public.banners;
DROP POLICY IF EXISTS "banners_update_admin"  ON public.banners;
DROP POLICY IF EXISTS "banners_delete_admin"  ON public.banners;
DROP POLICY IF EXISTS "banners: anon read"    ON public.banners;
DROP POLICY IF EXISTS "banners: anon insert"  ON public.banners;
DROP POLICY IF EXISTS "banners: anon update"  ON public.banners;
DROP POLICY IF EXISTS "banners: anon delete"  ON public.banners;
DROP POLICY IF EXISTS "banners: service_role full access" ON public.banners;

CREATE POLICY "banners: anon read"
  ON public.banners FOR SELECT TO anon USING (true);
CREATE POLICY "banners: anon insert"
  ON public.banners FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "banners: anon update"
  ON public.banners FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "banners: anon delete"
  ON public.banners FOR DELETE TO anon USING (true);
CREATE POLICY "banners: service_role full access"
  ON public.banners FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 7. 추가 테이블 (notifications, reviews, events_rsvp, licenses, orders, custom_orders) ──
ALTER TABLE IF EXISTS public.licenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "licenses: anon read"   ON public.licenses;
DROP POLICY IF EXISTS "licenses: anon insert" ON public.licenses;
DROP POLICY IF EXISTS "licenses: anon update" ON public.licenses;
DROP POLICY IF EXISTS "licenses: service_role full access" ON public.licenses;
CREATE POLICY "licenses: anon read"   ON public.licenses FOR SELECT TO anon USING (true);
CREATE POLICY "licenses: anon insert" ON public.licenses FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "licenses: anon update" ON public.licenses FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "licenses: service_role full access" ON public.licenses FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "orders: anon read"   ON public.orders;
DROP POLICY IF EXISTS "orders: anon insert" ON public.orders;
DROP POLICY IF EXISTS "orders: anon update" ON public.orders;
DROP POLICY IF EXISTS "orders: service_role full access" ON public.orders;
CREATE POLICY "orders: anon read"   ON public.orders FOR SELECT TO anon USING (true);
CREATE POLICY "orders: anon insert" ON public.orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "orders: anon update" ON public.orders FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "orders: service_role full access" ON public.orders FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE IF EXISTS public.custom_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "custom_orders: anon read"   ON public.custom_orders;
DROP POLICY IF EXISTS "custom_orders: anon insert" ON public.custom_orders;
DROP POLICY IF EXISTS "custom_orders: anon update" ON public.custom_orders;
DROP POLICY IF EXISTS "custom_orders: service_role full access" ON public.custom_orders;
CREATE POLICY "custom_orders: anon read"   ON public.custom_orders FOR SELECT TO anon USING (true);
CREATE POLICY "custom_orders: anon insert" ON public.custom_orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "custom_orders: anon update" ON public.custom_orders FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "custom_orders: service_role full access" ON public.custom_orders FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon select notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow anon insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow anon update notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow anon delete notifications" ON public.notifications;
CREATE POLICY "Allow anon select notifications" ON public.notifications FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert notifications" ON public.notifications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update notifications" ON public.notifications FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete notifications" ON public.notifications FOR DELETE TO anon USING (true);

ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon select reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow anon insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow anon update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow anon delete reviews" ON public.reviews;
CREATE POLICY "Allow anon select reviews" ON public.reviews FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert reviews" ON public.reviews FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update reviews" ON public.reviews FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete reviews" ON public.reviews FOR DELETE TO anon USING (true);

ALTER TABLE IF EXISTS public.events_rsvp ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "events_rsvp: public read"              ON public.events_rsvp;
DROP POLICY IF EXISTS "events_rsvp: anon insert"              ON public.events_rsvp;
DROP POLICY IF EXISTS "events_rsvp: anon update"              ON public.events_rsvp;
DROP POLICY IF EXISTS "events_rsvp: anon delete"              ON public.events_rsvp;
DROP POLICY IF EXISTS "events_rsvp: service_role full access"  ON public.events_rsvp;
CREATE POLICY "events_rsvp: public read"   ON public.events_rsvp FOR SELECT TO anon USING (true);
CREATE POLICY "events_rsvp: anon insert"   ON public.events_rsvp FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "events_rsvp: anon update"   ON public.events_rsvp FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "events_rsvp: anon delete"   ON public.events_rsvp FOR DELETE TO anon USING (true);
CREATE POLICY "events_rsvp: service_role full access" ON public.events_rsvp FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- 완료! 모든 테이블의 RLS 정책이 anon SELECT를 허용합니다.
-- ============================================================
