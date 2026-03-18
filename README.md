# Dentalk — BIOTEM × BIOPLANT

Premium digital dental implant parts ordering system for clinics in Thailand.

## Features

- **Shop** — Browse and order dental implant parts (scan bodies, ti-bases, Q-bases, pre-milled, multi-unit, 3D analogs)
- **CNC Custom Abutment** — Order custom abutments with STL upload, tooth selection wizard, and multi-case support
- **Clinical Discussion Forum** — Region-based forum with categories, image attachments, comments, and pinned posts
- **Webzine** — Admin-published articles on implant cases, prosthetics, product reviews, and education
- **Jobs Board** — Post and browse dental job listings with regional filtering
- **Used Market** — Buy/sell used dental parts with photo upload
- **Events & Meetups** — Community events with RSVP system
- **Notification Center** — Real-time notifications for orders, comments, RSVPs, and announcements
- **Unified Search** — Search across all content types simultaneously
- **Review/Rating System** — Star ratings and reviews on products (purchase-verified)
- **Admin Panel** — Order management, user approval, content moderation, ad management, statistics dashboard
- **Multi-language** — English, Korean, Chinese, Thai, Vietnamese, Spanish
- **PWA** — Installable progressive web app with offline support
- **LINE Integration** — Order notifications and status updates via LINE Messaging API

## Tech Stack

- **Frontend**: Vanilla JS, Tailwind CSS (CDN), HTML5
- **Backend**: Supabase (PostgreSQL + REST API + RLS)
- **Notifications**: LINE Messaging API via Cloudflare Worker proxy
- **3D Viewer**: Three.js for STL file preview
- **PWA**: Service Worker with Cache First / Network First strategies

## Project Structure

```
Dentalk/
├── index.html          # Single-page app (all views)
├── app.js              # Application logic, rendering, event handlers
├── supabase.js         # Supabase REST API client helpers
├── lang.js             # i18n translations (6 languages)
├── sw.js               # Service Worker (caching + offline)
├── manifest.json       # PWA manifest
├── icon.svg            # App icon (SVG)
├── icon-192.png        # App icon 192×192
├── icon-512.png        # App icon 512×512
├── sql/
│   ├── notifications.sql   # Notifications table + RLS
│   └── reviews.sql         # Reviews table + RLS
└── README.md
```

## Setup

### Prerequisites

- A [Supabase](https://supabase.com) project
- (Optional) Cloudflare Worker for LINE Messaging API proxy

### 1. Supabase Database Setup

Create the following tables in your Supabase SQL Editor. Required tables:

- `licenses` — User registration and authentication
- `products` — Product catalog
- `orders` — Shop orders
- `custom_orders` — CNC custom abutment orders
- `forum_posts` — Forum posts and comments
- `events` — Events and meetups
- `used_items` — Used market listings
- `webzine_articles` — Webzine articles
- `jobs` — Job listings
- `banners` — Ad banners
- `notifications` — User notifications (`sql/notifications.sql`)
- `reviews` — Product reviews (`sql/reviews.sql`)

Run the SQL files in `sql/` directory to create the notifications and reviews tables with proper RLS policies.

### 2. Configuration

Edit `supabase.js` and update:

```javascript
const SUPABASE_URL      = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

Edit `app.js` and update LINE integration (optional):

```javascript
const LINE_PROXY_URL = 'https://your-worker.workers.dev';
const LINE_USER_ID   = 'YOUR_LINE_USER_ID';
```

### 3. Deployment

This is a static site — deploy to any static hosting:

**Cloudflare Pages:**
```bash
# Connect your repo or drag & drop the folder
# Build command: (none)
# Output directory: ./
```

**Netlify:**
```bash
# Drag & drop the folder or connect repo
# No build step needed
```

**Vercel:**
```bash
npx vercel --prod
```

**GitHub Pages:**
```bash
# Push to gh-pages branch or enable Pages in repo settings
```

### 4. Post-Deployment Checklist

- [ ] Run `sql/notifications.sql` in Supabase SQL Editor
- [ ] Run `sql/reviews.sql` in Supabase SQL Editor
- [ ] Verify RLS policies are enabled on all tables
- [ ] Update `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `supabase.js`
- [ ] Update OG meta image URL in `index.html` to your domain
- [ ] Update `canonical` URL in `index.html` to your domain
- [ ] Test PWA installation on mobile devices
- [ ] Verify LINE webhook integration (if using)

## Security Notes

- Only the Supabase **anon key** is used client-side (safe by design with RLS)
- All tables have Row Level Security (RLS) enabled
- User input is escaped with `escHtml()` before rendering
- No server-side secrets are exposed in client code

## License

Proprietary — BIOTEM × BIOPLANT. All rights reserved.
