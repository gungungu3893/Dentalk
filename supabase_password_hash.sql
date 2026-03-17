-- ============================================================
-- Dentalk — Phase 2-#3: bcrypt 비밀번호 해시화
-- pgcrypto 사용 (서버사이드 해시/검증)
-- ※ 재실행 안전 (idempotent)
-- Supabase Dashboard > SQL Editor에서 실행하세요.
-- ============================================================

-- ── 1. pgcrypto 확장 활성화 ─────────────────────────────────
create extension if not exists pgcrypto;

-- ============================================================
-- 2. 비밀번호 자동 해시 트리거
--    INSERT / UPDATE 시 평문 비밀번호를 bcrypt로 자동 변환
--    이미 bcrypt 해시인 경우($2a$/$2b$ 시작) 그대로 유지
-- ============================================================
create or replace function public.hash_password_trigger_fn()
returns trigger as $$
begin
  -- bcrypt 해시가 아닌 평문만 해시화 (재실행 안전)
  if new.password is not null
    and new.password not like '$2a$%'
    and new.password not like '$2b$%'
  then
    new.password := crypt(new.password, gen_salt('bf', 10));
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists hash_password_trigger on public.licenses;
create trigger hash_password_trigger
  before insert or update of password
  on public.licenses
  for each row
  execute function public.hash_password_trigger_fn();

-- ============================================================
-- 3. 로그인 RPC 함수
--    nickname + 평문 비밀번호 → 서버에서 bcrypt 비교 → 유저 정보 반환
--    SECURITY DEFINER: RLS 우회, 비밀번호 컬럼 클라이언트 미노출
-- ============================================================
create or replace function public.login_user(
  p_nickname text,
  p_password text
)
returns table(
  license_number text,
  doctor_name    text,
  clinic_name    text,
  nickname       text,
  email          text,
  phone          text,
  address        text,
  role           text,
  is_active      boolean
)
language plpgsql
security definer
as $$
begin
  return query
  select
    l.license_number,
    l.doctor_name,
    l.clinic_name,
    l.nickname,
    l.email,
    l.phone,
    l.address,
    l.role,
    l.is_active
  from public.licenses l
  where l.nickname = p_nickname
    and l.password = crypt(p_password, l.password);
end;
$$;

-- anon 역할에 실행 권한 부여
grant execute on function public.login_user(text, text) to anon;

-- ============================================================
-- 4. 기존 평문 비밀번호 마이그레이션
--    현재 DB에 저장된 평문 비밀번호를 bcrypt로 일괄 해시화
--    이미 해시된 경우 건너뜀
-- ============================================================
update public.licenses
set password = crypt(password, gen_salt('bf', 10))
where password is not null
  and password not like '$2a$%'
  and password not like '$2b$%';

-- ============================================================
-- 확인 쿼리 (결과에 $2a$ 또는 $2b$로 시작하면 성공)
-- ============================================================
-- select nickname, left(password, 7) as pw_prefix from public.licenses;

-- ============================================================
-- 완료!
-- 실행 후 "Success. X rows affected" 메시지 확인
-- password 컬럼이 $2a$10$... 형태로 바뀌었으면 성공
-- ============================================================
