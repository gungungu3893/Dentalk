-- ============================================================
-- Dentalk — Role Migration
-- licenses 테이블에서 admin 계정 role 설정
-- ※ 재실행 가능 (idempotent)
-- ============================================================

-- 1. role 컬럼이 없으면 추가 (이미 있으면 무시)
alter table public.licenses
  add column if not exists role text not null default 'user';

-- 2. 모든 기존 계정의 role을 'user'로 초기화 (null인 경우만)
update public.licenses
set role = 'user'
where role is null;

-- 3. admin 계정 지정
--    ↓ 실제 admin 닉네임으로 변경하세요
update public.licenses
set role = 'admin'
where nickname = 'admin'
   or nickname = '관리자';

-- 결과 확인
select nickname, role, is_active from public.licenses order by created_at;
