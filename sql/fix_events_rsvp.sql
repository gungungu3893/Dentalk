-- ============================================================
-- fix_events_rsvp.sql — RSVP 테이블 점검 및 수정
-- ============================================================

-- 1) 테이블이 없으면 생성
CREATE TABLE IF NOT EXISTS public.events_rsvp (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID        NOT NULL,
  user_id     TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'attending',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) unique constraint 확인 — upsert (on_conflict)에 필수
-- 이미 존재하면 무시됨
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.events_rsvp'::regclass
      AND contype = 'u'
      AND array_length(conkey, 1) = 2
  ) THEN
    ALTER TABLE public.events_rsvp
      ADD CONSTRAINT events_rsvp_event_user_unique UNIQUE (event_id, user_id);
  END IF;
END $$;

-- 3) RLS 활성화
ALTER TABLE public.events_rsvp ENABLE ROW LEVEL SECURITY;

-- 4) RLS 정책 — anon 역할로 CRUD 허용 (앱이 anon key 사용)
DROP POLICY IF EXISTS "events_rsvp_select" ON public.events_rsvp;
DROP POLICY IF EXISTS "events_rsvp_insert" ON public.events_rsvp;
DROP POLICY IF EXISTS "events_rsvp_update" ON public.events_rsvp;
DROP POLICY IF EXISTS "events_rsvp_delete" ON public.events_rsvp;

CREATE POLICY "events_rsvp_select" ON public.events_rsvp FOR SELECT USING (true);
CREATE POLICY "events_rsvp_insert" ON public.events_rsvp FOR INSERT WITH CHECK (true);
CREATE POLICY "events_rsvp_update" ON public.events_rsvp FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "events_rsvp_delete" ON public.events_rsvp FOR DELETE USING (true);

-- 5) 인덱스
CREATE INDEX IF NOT EXISTS idx_events_rsvp_event_id ON public.events_rsvp(event_id);
CREATE INDEX IF NOT EXISTS idx_events_rsvp_user_id ON public.events_rsvp(user_id);
CREATE INDEX IF NOT EXISTS idx_events_rsvp_event_status ON public.events_rsvp(event_id, status);
