-- ============================================================
-- credits.sql — 크레딧 시스템
-- ============================================================

-- 1) licenses 테이블에 credits 컬럼 추가
ALTER TABLE public.licenses ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0;

-- 2) credit_history 테이블 생성
CREATE TABLE IF NOT EXISTS public.credit_history (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT        NOT NULL,
  amount      INTEGER     NOT NULL,
  type        TEXT        NOT NULL DEFAULT 'charge',  -- 'charge' | 'use'
  description TEXT        DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.credit_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "credit_history_select" ON public.credit_history FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "credit_history_insert" ON public.credit_history FOR INSERT WITH CHECK (true);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_credit_history_user ON public.credit_history(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_history_created ON public.credit_history(created_at DESC);
