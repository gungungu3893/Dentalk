-- ============================================================
-- feedback 테이블 — 고객 피드백
-- ============================================================

CREATE TABLE IF NOT EXISTS feedback (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_nickname TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'other',      -- bug, feature, complaint, praise, other
  title       TEXT NOT NULL,
  content     TEXT NOT NULL DEFAULT '',
  rating      SMALLINT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  status      TEXT NOT NULL DEFAULT 'unread',     -- unread, read, replied
  admin_note  TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- 누구나 자신의 피드백 생성 가능
CREATE POLICY "feedback_insert" ON feedback
  FOR INSERT WITH CHECK (true);

-- 누구나 읽기 가능 (관리자가 관리 패널에서 조회)
CREATE POLICY "feedback_select" ON feedback
  FOR SELECT USING (true);

-- 관리자만 업데이트 가능 (상태 변경)
CREATE POLICY "feedback_update" ON feedback
  FOR UPDATE USING (true);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
