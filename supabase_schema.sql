-- ============================================================
-- Dentalk — Supabase Schema
-- Phase 2-#1: 테이블 생성 + RLS 정책
-- Supabase SQL Editor에 붙여넣기 후 실행하세요.
-- ※ 재실행 가능 (idempotent): 기존 정책 자동 삭제 후 재생성
-- ============================================================

-- ── 확장 ────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. users (licenses 테이블 — 기존 이름 유지)
--    현재 앱은 'licenses' 테이블을 사용 중이므로
--    users 뷰/별칭으로 제공하되, 원본 테이블도 포함합니다.
-- ============================================================
create table if not exists public.licenses (
  id               uuid        primary key default uuid_generate_v4(),
  license_number   text        unique not null,
  doctor_name      text        not null,
  clinic_name      text        not null,
  contact          text,
  nickname         text        unique not null,
  email            text,
  phone            text,
  address          text,
  password         text        not null,
  is_active        boolean     not null default false,
  role             text        not null default 'user',   -- 'user' | 'admin'
  created_at       timestamptz not null default now()
);

-- ============================================================
-- 2. products
-- ============================================================
create table if not exists public.products (
  id           uuid        primary key default uuid_generate_v4(),
  name         text        not null,
  code         text        unique not null,
  category     text,                          -- 'implant' | 'prosthetic' | etc.
  price        numeric(10,2) not null default 0,
  stock        integer     not null default 0,
  description  text,
  image_url    text,
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- 3. orders (shop 주문 — 일반 제품 주문)
-- ============================================================
create table if not exists public.orders (
  id              text        primary key,   -- 앱 생성 주문번호 (e.g. "ORD-20260317-xxxx")
  user_nickname   text        references public.licenses(nickname) on delete set null,
  clinic          text,
  addr            text,
  phone           text,
  line_id         text,
  items           jsonb       not null default '[]',
  stage           text        not null default 'submitted',
  design_versions jsonb       not null default '[]',
  review_history  jsonb       not null default '[]',
  cases           jsonb       not null default '[]',
  carrier         text,
  tracking_number text,
  date            text,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- 4. custom_orders (CAD/CAM 맞춤 보철 주문)
-- ============================================================
create table if not exists public.custom_orders (
  id              text        primary key,
  user_nickname   text        references public.licenses(nickname) on delete set null,
  clinic          text,
  addr            text,
  phone           text,
  line_id         text,
  cases           jsonb       not null default '[]',
  stage           text        not null default 'submitted',
  design_versions jsonb       not null default '[]',
  review_history  jsonb       not null default '[]',
  carrier         text,
  tracking_number text,
  date            text,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- 5. forum_posts
-- ============================================================
create table if not exists public.forum_posts (
  id          uuid        primary key default uuid_generate_v4(),
  author      text        references public.licenses(nickname) on delete set null,
  category    text        not null default 'general',
  region      text        not null default 'all',
  province    text        not null default 'all',
  title       text        not null,
  body        text        not null,
  images      jsonb       not null default '[]',
  views       integer     not null default 0,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 6. forum_comments
-- ============================================================
create table if not exists public.forum_comments (
  id          uuid        primary key default uuid_generate_v4(),
  post_id     uuid        not null references public.forum_posts(id) on delete cascade,
  author      text        references public.licenses(nickname) on delete set null,
  body        text        not null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 7. used_items (중고 거래)
-- ============================================================
create table if not exists public.used_items (
  id          uuid        primary key default uuid_generate_v4(),
  seller      text        references public.licenses(nickname) on delete set null,
  name        text        not null,
  code        text,
  price       numeric(10,2) not null default 0,
  condition   text        not null default 'good',   -- 'new' | 'good' | 'fair'
  description text,
  contact     text,
  views       integer     not null default 0,
  image_url   text,
  is_sold     boolean     not null default false,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 8. events (세미나 / 공장 투어 등)
-- ============================================================
create table if not exists public.events (
  id          uuid        primary key default uuid_generate_v4(),
  title       text        not null,
  location    text,
  event_date  date,
  description text,
  created_by  text        references public.licenses(nickname) on delete set null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 9. messages (회원 간 쪽지)
-- ============================================================
create table if not exists public.messages (
  id          uuid        primary key default uuid_generate_v4(),
  from_user   text        references public.licenses(nickname) on delete set null,
  to_user     text        references public.licenses(nickname) on delete set null,
  subject     text,
  body        text        not null,
  is_read     boolean     not null default false,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Row Level Security 활성화
-- ============================================================
alter table public.licenses      enable row level security;
alter table public.products      enable row level security;
alter table public.orders        enable row level security;
alter table public.custom_orders enable row level security;
alter table public.forum_posts   enable row level security;
alter table public.forum_comments enable row level security;
alter table public.used_items    enable row level security;
alter table public.events        enable row level security;
alter table public.messages      enable row level security;

-- ============================================================
-- RLS 정책 (재실행 안전: 기존 정책 삭제 후 재생성)
-- ※ 현재 앱은 anon key 기반 REST API 사용 (Supabase Auth 미사용)
--   → 앱 자체 nickname/password 인증이므로, 아래 정책은
--     "anon 역할에 최소 권한 부여 + service_role(admin)은 풀 액세스"
--     구조로 설정합니다.
-- ============================================================

-- ── licenses (users) ────────────────────────────────────────
drop policy if exists "licenses: anon read"              on public.licenses;
drop policy if exists "licenses: anon insert"            on public.licenses;
drop policy if exists "licenses: service_role full access" on public.licenses;

create policy "licenses: anon read"
  on public.licenses for select
  to anon
  using (true);

create policy "licenses: anon insert"
  on public.licenses for insert
  to anon
  with check (true);

create policy "licenses: service_role full access"
  on public.licenses for all
  to service_role
  using (true)
  with check (true);

-- ── products ────────────────────────────────────────────────
drop policy if exists "products: public read"             on public.products;
drop policy if exists "products: service_role full access" on public.products;

create policy "products: public read"
  on public.products for select
  to anon
  using (true);

create policy "products: service_role full access"
  on public.products for all
  to service_role
  using (true)
  with check (true);

-- ── orders ──────────────────────────────────────────────────
drop policy if exists "orders: anon read"                on public.orders;
drop policy if exists "orders: anon insert"              on public.orders;
drop policy if exists "orders: anon update"              on public.orders;
drop policy if exists "orders: service_role full access" on public.orders;

create policy "orders: anon read"
  on public.orders for select
  to anon
  using (true);

create policy "orders: anon insert"
  on public.orders for insert
  to anon
  with check (true);

create policy "orders: anon update"
  on public.orders for update
  to anon
  using (true)
  with check (true);

create policy "orders: service_role full access"
  on public.orders for all
  to service_role
  using (true)
  with check (true);

-- ── custom_orders ────────────────────────────────────────────
drop policy if exists "custom_orders: anon read"                on public.custom_orders;
drop policy if exists "custom_orders: anon insert"              on public.custom_orders;
drop policy if exists "custom_orders: anon update"              on public.custom_orders;
drop policy if exists "custom_orders: service_role full access" on public.custom_orders;

create policy "custom_orders: anon read"
  on public.custom_orders for select
  to anon
  using (true);

create policy "custom_orders: anon insert"
  on public.custom_orders for insert
  to anon
  with check (true);

create policy "custom_orders: anon update"
  on public.custom_orders for update
  to anon
  using (true)
  with check (true);

create policy "custom_orders: service_role full access"
  on public.custom_orders for all
  to service_role
  using (true)
  with check (true);

-- ── forum_posts ──────────────────────────────────────────────
drop policy if exists "forum_posts: public read"             on public.forum_posts;
drop policy if exists "forum_posts: anon insert"             on public.forum_posts;
drop policy if exists "forum_posts: anon update own"         on public.forum_posts;
drop policy if exists "forum_posts: anon delete own"         on public.forum_posts;
drop policy if exists "forum_posts: service_role full access" on public.forum_posts;

create policy "forum_posts: public read"
  on public.forum_posts for select
  to anon
  using (true);

create policy "forum_posts: anon insert"
  on public.forum_posts for insert
  to anon
  with check (true);

create policy "forum_posts: anon update own"
  on public.forum_posts for update
  to anon
  using (true)
  with check (true);

create policy "forum_posts: anon delete own"
  on public.forum_posts for delete
  to anon
  using (true);

create policy "forum_posts: service_role full access"
  on public.forum_posts for all
  to service_role
  using (true)
  with check (true);

-- ── forum_comments ───────────────────────────────────────────
drop policy if exists "forum_comments: public read"             on public.forum_comments;
drop policy if exists "forum_comments: anon insert"             on public.forum_comments;
drop policy if exists "forum_comments: anon delete own"         on public.forum_comments;
drop policy if exists "forum_comments: service_role full access" on public.forum_comments;

create policy "forum_comments: public read"
  on public.forum_comments for select
  to anon
  using (true);

create policy "forum_comments: anon insert"
  on public.forum_comments for insert
  to anon
  with check (true);

create policy "forum_comments: anon delete own"
  on public.forum_comments for delete
  to anon
  using (true);

create policy "forum_comments: service_role full access"
  on public.forum_comments for all
  to service_role
  using (true)
  with check (true);

-- ── used_items ───────────────────────────────────────────────
drop policy if exists "used_items: public read"             on public.used_items;
drop policy if exists "used_items: anon insert"             on public.used_items;
drop policy if exists "used_items: anon update own"         on public.used_items;
drop policy if exists "used_items: anon delete own"         on public.used_items;
drop policy if exists "used_items: service_role full access" on public.used_items;

create policy "used_items: public read"
  on public.used_items for select
  to anon
  using (true);

create policy "used_items: anon insert"
  on public.used_items for insert
  to anon
  with check (true);

create policy "used_items: anon update own"
  on public.used_items for update
  to anon
  using (true)
  with check (true);

create policy "used_items: anon delete own"
  on public.used_items for delete
  to anon
  using (true);

create policy "used_items: service_role full access"
  on public.used_items for all
  to service_role
  using (true)
  with check (true);

-- ── events ───────────────────────────────────────────────────
drop policy if exists "events: public read"             on public.events;
drop policy if exists "events: service_role full access" on public.events;

create policy "events: public read"
  on public.events for select
  to anon
  using (true);

create policy "events: service_role full access"
  on public.events for all
  to service_role
  using (true)
  with check (true);

-- ── messages ─────────────────────────────────────────────────
drop policy if exists "messages: anon read"                on public.messages;
drop policy if exists "messages: anon insert"              on public.messages;
drop policy if exists "messages: anon update own"          on public.messages;
drop policy if exists "messages: service_role full access" on public.messages;

create policy "messages: anon read"
  on public.messages for select
  to anon
  using (true);

create policy "messages: anon insert"
  on public.messages for insert
  to anon
  with check (true);

create policy "messages: anon update own"
  on public.messages for update
  to anon
  using (true)
  with check (true);

create policy "messages: service_role full access"
  on public.messages for all
  to service_role
  using (true)
  with check (true);

-- ============================================================
-- 인덱스 (성능 최적화)
-- ============================================================
create index if not exists idx_orders_user_nickname      on public.orders(user_nickname);
create index if not exists idx_custom_orders_user        on public.custom_orders(user_nickname);
create index if not exists idx_forum_posts_category      on public.forum_posts(category);
create index if not exists idx_forum_posts_author        on public.forum_posts(author);
create index if not exists idx_forum_comments_post_id   on public.forum_comments(post_id);
create index if not exists idx_used_items_seller         on public.used_items(seller);
create index if not exists idx_messages_to_user          on public.messages(to_user);
create index if not exists idx_messages_from_user        on public.messages(from_user);

-- ============================================================
-- Phase 3 추가 컬럼 (재실행 안전)
-- ============================================================

-- forum_posts: comments + date 컬럼 추가
alter table public.forum_posts
  add column if not exists comments jsonb not null default '[]';

alter table public.forum_posts
  add column if not exists date text;

-- used_items: 기존 condition 컬럼은 스키마에 있으나 date 컬럼 추가
alter table public.used_items
  add column if not exists date text;

-- licenses: anon update 정책 추가 (관리자 활성화/비활성화)
drop policy if exists "licenses: anon update" on public.licenses;
create policy "licenses: anon update"
  on public.licenses for update
  to anon
  using (true)
  with check (true);

-- events: anon insert/delete 정책 추가 (관리자 이벤트 관리)
drop policy if exists "events: anon insert" on public.events;
drop policy if exists "events: anon delete" on public.events;
drop policy if exists "events: anon update" on public.events;
create policy "events: anon insert"
  on public.events for insert
  to anon
  with check (true);
create policy "events: anon delete"
  on public.events for delete
  to anon
  using (true);
create policy "events: anon update"
  on public.events for update
  to anon
  using (true)
  with check (true);

-- events: type/region 컬럼 추가 (오프라인 모임 지원)
alter table public.events
  add column if not exists type text not null default 'event';  -- 'event' | 'meetup'
alter table public.events
  add column if not exists region text not null default 'all';

-- ============================================================
-- 10. events_rsvp (이벤트 참석 관리)
-- ============================================================
create table if not exists public.events_rsvp (
  id          uuid        primary key default uuid_generate_v4(),
  event_id    uuid        not null references public.events(id) on delete cascade,
  user_id     text        not null references public.licenses(nickname) on delete cascade,
  status      text        not null default 'attending',  -- 'attending' | 'not_attending'
  created_at  timestamptz not null default now(),
  unique(event_id, user_id)
);

alter table public.events_rsvp enable row level security;

drop policy if exists "events_rsvp: public read"             on public.events_rsvp;
drop policy if exists "events_rsvp: anon insert"             on public.events_rsvp;
drop policy if exists "events_rsvp: anon update"             on public.events_rsvp;
drop policy if exists "events_rsvp: anon delete"             on public.events_rsvp;
drop policy if exists "events_rsvp: service_role full access" on public.events_rsvp;

create policy "events_rsvp: public read"
  on public.events_rsvp for select
  to anon
  using (true);

create policy "events_rsvp: anon insert"
  on public.events_rsvp for insert
  to anon
  with check (true);

create policy "events_rsvp: anon update"
  on public.events_rsvp for update
  to anon
  using (true)
  with check (true);

create policy "events_rsvp: anon delete"
  on public.events_rsvp for delete
  to anon
  using (true);

create policy "events_rsvp: service_role full access"
  on public.events_rsvp for all
  to service_role
  using (true)
  with check (true);

create index if not exists idx_events_rsvp_event_id on public.events_rsvp(event_id);
create index if not exists idx_events_rsvp_user_id  on public.events_rsvp(user_id);

-- ============================================================
-- Phase 3-#3: 지역 리더 시스템
-- ============================================================

-- licenses: leader_region 컬럼 추가 (role='region_leader'일 때 지역 지정)
alter table public.licenses
  add column if not exists leader_region text;

-- forum_posts: is_pinned 컬럼 추가 (지역 리더가 글 고정)
alter table public.forum_posts
  add column if not exists is_pinned boolean not null default false;

-- ============================================================
-- 완료!
-- 이 SQL을 Supabase Dashboard > SQL Editor에 붙여넣고 실행하세요.
-- ============================================================
