-- LINE Webhook Integration: line_user_id 컬럼 추가 + 매칭 대기 테이블
-- 실행: Supabase Dashboard → SQL Editor

-- ① licenses 테이블에 line_user_id 컬럼 추가
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS line_user_id TEXT UNIQUE;

-- 인덱스 추가 (빠른 조회)
CREATE INDEX IF NOT EXISTS idx_licenses_line_user_id ON licenses(line_user_id);

-- ② LINE 매칭 대기 테이블 (닉네임 매칭이 안 된 LINE 유저)
CREATE TABLE IF NOT EXISTS line_pending_users (
  id BIGSERIAL PRIMARY KEY,
  line_user_id TEXT NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 정책: line_pending_users
ALTER TABLE line_pending_users ENABLE ROW LEVEL SECURITY;

-- Worker(anon key)가 INSERT/SELECT/DELETE 가능
CREATE POLICY "line_pending_insert" ON line_pending_users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "line_pending_select" ON line_pending_users
  FOR SELECT USING (true);

CREATE POLICY "line_pending_delete" ON line_pending_users
  FOR DELETE USING (true);

-- ③ licenses 테이블 RLS: line_user_id 업데이트 허용
-- Worker가 anon key로 PATCH 요청 시 line_user_id 컬럼 업데이트 가능하도록
CREATE POLICY "allow_line_user_id_update" ON licenses
  FOR UPDATE USING (true) WITH CHECK (true);

-- ④ 코멘트
COMMENT ON COLUMN licenses.line_user_id IS 'LINE userId — Webhook follow/message 이벤트에서 자동 저장';
COMMENT ON TABLE line_pending_users IS 'LINE 친구 추가했지만 아직 앱 계정과 매칭 안 된 유저 목록';
