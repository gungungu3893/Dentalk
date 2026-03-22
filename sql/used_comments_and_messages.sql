-- used_comments + messages 테이블 생성
-- 실행: Supabase Dashboard → SQL Editor

-- ① used_comments 테이블 (중고마켓 댓글)
CREATE TABLE IF NOT EXISTS used_comments (
  id BIGSERIAL PRIMARY KEY,
  used_item_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_used_comments_item ON used_comments(used_item_id);
CREATE INDEX IF NOT EXISTS idx_used_comments_created ON used_comments(created_at DESC);

-- RLS 활성화
ALTER TABLE used_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "used_comments_select" ON used_comments
  FOR SELECT USING (true);

CREATE POLICY "used_comments_insert" ON used_comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "used_comments_delete" ON used_comments
  FOR DELETE USING (true);

COMMENT ON TABLE used_comments IS '중고마켓 게시물 댓글';

-- ② messages 테이블 (쪽지 시스템)
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- RLS 활성화
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_select" ON messages
  FOR SELECT USING (true);

CREATE POLICY "messages_insert" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "messages_update" ON messages
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "messages_delete" ON messages
  FOR DELETE USING (true);

COMMENT ON TABLE messages IS '유저간 쪽지(DM) 시스템';
COMMENT ON COLUMN messages.sender_id IS '보낸 사람 닉네임';
COMMENT ON COLUMN messages.receiver_id IS '받는 사람 닉네임';
