# CLAUDE.md

## Vision
Dentalk — Premium digital dental implant parts ordering system for clinics in Thailand.
B2B marketplace + community platform for BIOTEM × BIOPLANT implant components.
Multilingual PWA with LINE integration, regional community, and admin management.

## Tech Stack
- **Frontend**: Vanilla JS (ES5+), Tailwind CSS (CDN), HTML5 Single-Page App
- **Backend**: Supabase (PostgreSQL + REST API + RLS)
- **Notifications**: LINE Messaging API via Cloudflare Worker proxy
- **PWA**: Service Worker (Cache First / Network First), installable
- **Auth**: Custom nickname + bcrypt password via Supabase RPC (no Supabase Auth)
- **i18n**: lang.js — 6 languages (en, ko, zh, th, vi, es)

## Key Constants
```
SUPABASE_URL    = https://ikdlgnpjcmwbsrxvoxvd.supabase.co
LINE_PROXY_URL  = https://dentalk-line.gungungu.workers.dev
LINE_USER_ID    = U6265c5810e5592b820c224588433c247
LOCKED_PAGES    = ['shop', 'forum', 'custom']
IMPLANT_BRANDS  = 11 (BIOTEM N/R, Osstem US/TS, Straumann BL/TL, Nobel Active/Replace, Zimmer TSV, Dentium SuperLine, etc.)
TOOTH_COLORS    = 14 VITA shades (A1-A4, B1-B3, C1-C3, D2, D3, BL Bleach)
ORDER_STAGES    = submitted → confirmed → design_ready → approved → milling → shipped → done
SW_CACHE_VER    = dentalk-v28
```

## Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Dark | #001220, #001d4a | Backgrounds, nav |
| Primary | #0a1e3d, #0a3072, #0d3880 | Buttons, headers |
| Accent Gold | #D4AF37, #b8952e | Highlights, hover |
| Neutral | slate-50/100 (#f8fafc/#f1f5f9) | Cards, backgrounds |
| Text | slate-800 (#1e293b), slate-500 | Body, secondary |
| Status Done | #2563eb (blue) | Completed stages |
| Status Current | #f59e0b (amber) | Active stages |
| LINE Green | #06C755 | LINE buttons |

## File Structure
```
Dentalk/
├── index.html          — SPA markup (all pages/modals)
├── app.js              — Core: nav, state, constants, regions, search, notifications, i18n
├── auth.js             — Login, registration, session, privacy policy
├── shop.js             — Product catalog, cart, checkout, orders, reviews
├── custom.js           — CNC custom abutment 5-step wizard, used market
├── forum.js            — Forum posts, comments, region/category filters, leaders
├── admin.js            — Admin panel: 11 tabs (orders, users, products, stats, ads...)
├── jobs.js             — Job board with type/region filtering
├── webzine.js          — Articles with markdown, categories
├── events.js           — Events & meetups, RSVP system
├── ads.js              — Banner management, click/impression tracking
├── lang.js             — i18n translations (6 languages)
├── supabase.js         — Supabase REST API client helpers
├── sw.js               — Service Worker (Phase 5-5 deployment)
├── cloudflare-worker.js— LINE Messaging API proxy
├── manifest.json       — PWA manifest
├── icon.svg/png        — App icons (192, 512)
├── supabase_schema.sql — DB schema + RLS policies
├── supabase_migrate_roles.sql — Role migration
├── supabase_password_hash.sql — Password hash setup
└── sql/
    ├── banners.sql, notifications.sql, reviews.sql
    ├── fix_missing_columns.sql, fix_rls_all_tables.sql
    ├── insert_test_banners.sql, performance_indexes.sql
```

## Pages & Features
| Page | ID | Login | Description |
|------|----|-------|-------------|
| Home | page-home | No | Hero, stats, product preview, forum feed, events, webzine |
| Shop | page-shop | Yes | 7 product categories |
| Shop Items | page-shop-items | Yes | Category-filtered product list |
| Shop Product | page-shop-product | Yes | Detail, specs, cart, reviews |
| CNC Custom | page-custom | Yes | 5-step wizard (teeth → brand → shade → STL → confirm) |
| Used Market | page-used | No | Buy/sell used parts |
| Forum | page-forum | Yes | 11 categories, region/province filter, leader badges |
| Forum Detail | page-forum-detail | Yes | Post, comments, images, pin/delete (leader) |
| Jobs | page-jobs | No | 3 types (dentist/staff/equipment), region filter |
| Webzine | page-webzine | No | Articles, 6 categories, markdown |
| Events | page-events | No | Events + meetups, RSVP |
| Factory | page-factory | Admin | Admin panel |
| Settings | page-settings | Yes | Profile, language, dark mode |
| My Activity | page-myactivity | Yes | Messages, posts, orders, used items |

## User Roles
| Role | Access |
|------|--------|
| **user** | Shop, forum, events, webzine, jobs, custom orders |
| **admin** | Full access: admin panel (Factory), all moderation, user approval, statistics |
| **region_leader** | Pin/delete forum posts in region, manage events; has leader_region + leader_title |

**Leader Titles**: National (president, vice_president, secretary, director, auditor) · Regional (president, secretary) · Provincial (representative)

## Product Data (7 Categories)
| Category | ID | Price (THB) | Notes |
|----------|----|-------------|-------|
| Scan Body | scan-body | 3,500–4,000 | Intra-Oral / Model / GeoMedi |
| Q-Base | q-base | 4,500 | Zirconia abutment H=7mm 3° taper |
| Ready Made | ready-made | 5,000 | Ø3.0 N · Ø4.5/5.5/6.5 R |
| Ti-Base | ti-base | 3,800 | CAD/CAM Ti+Zr H=4mm |
| Pre-Milled | pre-milled | 6,000 | N·H10 / R·H10, milling compatible |
| Multi Unit | multi-unit | 5,500 | All-on-X (MUA, Scan-Body, Ti-base, 3D Analog) |
| 3D Analog | 3d-analog | 3,200 | GeoMedi Stone & 3D printed model |

## Supabase DB Tables
| Table | Purpose | Key Fields |
|-------|---------|------------|
| licenses | Users & auth | license_number (PK), nickname (unique), email, phone, password, is_active, role, leader_region, leader_title |
| orders | Shop orders | user_nickname, clinic, addr, items (JSONB), stage, carrier, tracking_number |
| custom_orders | CNC orders | user_nickname, clinic, cases (JSONB), stage, design_versions, review_history |
| forum_posts | Discussions | author, category, region, province, title, body, images (JSONB), is_pinned |
| forum_comments | Comments | post_id, author, body |
| used_items | Used market | seller, name, price, condition, contact, image_url, is_sold |
| events | Events/meetups | title, location, event_date, description, created_by |
| events_rsvp | RSVP tracking | event_id, user_id, status |
| webzine_articles | Articles | category, title, body_md, author_id, thumbnail_url |
| jobs | Job listings | type, region, province, title, user_id, salary_range |
| messages | DM system | from_user, to_user, subject, body, is_read |
| banners | Ad campaigns | title, image_url, link_url, clicks, impressions, is_active |
| notifications | Alerts | user_id, type, related_order, is_read |
| reviews | Product reviews | user_id, product_id, rating (1-5), comment, verified_purchase |

## Thai Regions (6 groups, 77 provinces)
- **All** 🌏 — national
- **North** 🏔 — 9 provinces (Chiang Mai, Chiang Rai, Lampang, Lamphun, Mae Hong Son, Nan, Phayao, Phrae, Uttaradit)
- **Northeast** 🌾 — 20 provinces (Khon Kaen, Nakhon Ratchasima, Udon Thani, Ubon Ratchathani...)
- **East** 🌊 — 7 provinces (Chon Buri, Rayong, Chanthaburi, Trat...)
- **South** 🏝 — 14 provinces (Phuket, Songkhla, Surat Thani, Krabi...)
- **Central** 🏙 — 27 provinces (Bangkok, Nonthaburi, Pathum Thani, Ayutthaya...)

## Rules

### Git Rules
- Git 저장소: https://github.com/gungungu3893/Dentalk
- 작업 브랜치: claude/admin-supabase-integration-icvNm
- 모든 작업은 반드시 claude/admin-supabase-integration-icvNm 브랜치에서만 진행하고 푸시한다.
- 새로운 브랜치를 만들거나 다른 브랜치로 전환하지 마라.
- git push는 항상 origin claude/admin-supabase-integration-icvNm 로만 한다.

### General Rules
- README.md는 절대 수정하지 않는다.
- CLAUDE.md는 명시적 요청이 있을 때만 수정한다.

## Completed Roadmap
- Phase 3: Supabase full integration (REST client, dashboard, data sync)
- Phase 5-5: PWA deployment prep (Service Worker, caching, offline)
- All major features implemented: shop, custom orders, forum, jobs, webzine, events, ads, admin panel, LINE notifications, dark mode, i18n (6 langs), reviews, search, infinite scroll, notifications

## Phase 5+ Notes
- Latest marker: "Phase 5-5 배포 준비" in sw.js
- No explicit Phase 6 plans found in codebase
