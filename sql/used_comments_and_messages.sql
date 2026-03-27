-- used_comments 테이블 생성
-- 실행: Supabase Dashboard → SQL Editor
-- NOTE: messages 테이블은 이미 존재하므로 여기서 생성하지 않음
-- 기존 messages 컬럼: id, from_user, to_user, topic, subject, body, is_read, created_at, extension, payload, event, private

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

-- ② messages 테이블은 이미 존재함 (CREATE TABLE 생략)
-- 기존 컬럼: id(uuid), from_user(text), to_user(text), topic(text), subject(text),
--            body(text), is_read(boolean), created_at(timestamp), extension(text),
--            payload(jsonb), event(text), private(boolean)
-- 쪽지 기능에서 사용하는 컬럼: from_user, to_user, subject, body, is_read, created_at
