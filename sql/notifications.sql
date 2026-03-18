-- ============================================================
-- Phase 5-3: Notifications (알림) 테이블 + RLS
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'info',
  title       TEXT NOT NULL,
  body        TEXT DEFAULT '',
  link        TEXT DEFAULT '',
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 인덱스: 사용자별 조회 + 읽지 않은 알림 빠른 조회
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications (user_id, is_read, created_at DESC);

-- RLS 활성화
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 정책: anon 키로 모든 작업 허용 (앱 내부에서 사용자별 필터링)
CREATE POLICY "Allow anon select notifications"
  ON notifications FOR SELECT
  TO anon USING (true);

CREATE POLICY "Allow anon insert notifications"
  ON notifications FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "Allow anon update notifications"
  ON notifications FOR UPDATE
  TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon delete notifications"
  ON notifications FOR DELETE
  TO anon USING (true);
