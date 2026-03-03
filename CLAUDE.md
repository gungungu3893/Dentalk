# CLAUDE.md — Dentalk

## Project Overview

**Dentalk** is a dental implant parts ordering platform for clinics in Thailand and Southeast Asia. It connects dental professionals with BIOTEM (Korean implant manufacturer) and BIOPLANT (Bangkok manufacturing center) products and services.

Key capabilities: implant parts shop, CNC custom abutment ordering with multi-stage workflow, used parts marketplace, clinical discussion forum, private messaging, and multi-language support.

## Architecture

**Static SPA** — No build system, no bundler, no framework. Pure HTML + vanilla JavaScript served directly via GitHub Pages.

```
index.html          — UI structure: 11 pages + 13 modals (639 lines)
app.js              — All application logic (1,751 lines)
lang.js             — i18n translations for 6 languages (216 lines)
cloudflare-worker.js — LINE Messaging API CORS proxy (37 lines)
.github/workflows/deploy.yml — GitHub Pages deployment
```

Script loading order (both deferred):
1. `lang.js` — defines `LANG` object and `t()`/`tf()` functions
2. `app.js` — all application state, logic, and rendering

## External Services

| Service | Purpose | Config Location |
|---------|---------|----------------|
| **Supabase** | User auth, profile data (`licenses` table) | `app.js` lines 21-22 (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) |
| **LINE Messaging API** | Order notifications to customers | `cloudflare-worker.js` (channel token), `app.js` line 17 (`LINE_PROXY_URL`) |
| **Cloudflare Workers** | CORS proxy for LINE API | `dentalk-line.gungungu.workers.dev` |
| **Tailwind CSS** | Styling (CDN) | `index.html` line 8 |
| **Google Fonts** | Nunito font family | `index.html` line 7 |
| **QR Server API** | Payment QR code generation | `api.qrserver.com` |
| **GitHub Pages** | Static hosting | `.github/workflows/deploy.yml` |

## Development

### No Build Step

Files are served as-is. Edit and reload in browser. No `npm install`, no compilation.

### Deployment

GitHub Pages deploys on push to the configured branch via `.github/workflows/deploy.yml`. The workflow checks out the branch, uploads all files as artifacts, and deploys to Pages. No build step runs.

### Testing

There are no automated tests. Changes should be verified manually in a browser. Key areas to check after changes:
- Page navigation and modal open/close behavior
- Login/registration flow against Supabase
- i18n string rendering across all 6 languages
- Cart and order submission flow
- Admin panel features (login as "Admin" nickname)

## Code Conventions

### State Management

All state lives in global `let` variables at the top of `app.js` (lines 26-53):
- `currentPage`, `currentLang` — UI state
- `currentUser` — authenticated user object
- `cart`, `usedItems`, `posts`, `customOrders`, `messages` — data collections
- `sessionEnd`, `sessionTimer` — 30-minute session timer

### Page/Modal Pattern

Pages use `.page` / `.page.active` CSS classes. Modals use `.modal` / `.modal.open`:
```javascript
goPage('shop');           // activate a page
openModal('loginModal');  // show a modal
closeModal('loginModal'); // hide a modal
```

### Rendering Pattern

All dynamic UI uses string-based HTML building:
```javascript
function renderSomething() {
  var container = document.getElementById('some-container');
  var html = '';
  data.forEach(function(item) {
    html += '<div>...</div>';
  });
  container.innerHTML = html;
}
```

Re-render is called after data changes, page navigation, or language switches.

### Function Naming

- `open*()` / `close*()` — modal/UI control
- `render*()` — build and inject HTML
- `submit*()` — form submission handlers
- `go*()` — navigation
- `is*()` — boolean checks (e.g., `isLoggedIn()`, `isAdmin()`)
- `handle*()` — event handlers

### i18n System

**lang.js** exports a `LANG` object with keys for 6 languages: `en`, `ko`, `zh`, `th`, `vi`, `es`.

Translation lookup:
```javascript
t('key')              // returns translated string
tf('key', arg1, arg2) // returns translated string with % placeholders replaced
```

HTML integration via data attributes:
```html
<span data-i18n="login_btn">LOGIN</span>        <!-- textContent -->
<input data-i18n-ph="login_ph" placeholder="..."> <!-- placeholder -->
```

`applyLang()` walks all `[data-i18n]` and `[data-i18n-ph]` elements to update text.

Key naming prefixes: `nav_`, `pt_`, `login_`, `reg_`, `shop_`, `custom_`, `used_`, `forum_`, `settings_`, `profile_`, `stage_`, `err_`, `tooth_`.

**When adding new user-facing strings**: add the key to all 6 language variants in `lang.js`, use `data-i18n` in HTML or `t()`/`tf()` in JS.

### Supabase Integration

REST API calls use `fetch()` with URL query parameters:
```javascript
const url = SUPABASE_URL + '/rest/v1/licenses?nickname=eq.' + encodeURIComponent(value);
const res = await fetch(url, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
  }
});
```

localStorage acts as a fallback cache for profile data (`dentalk_profile_<licenseNum>`).

### Admin Detection

```javascript
const ADMIN_NICKNAMES = ['Admin', '관리자', 'admin'];
function isAdmin() { return ADMIN_NICKNAMES.includes(currentUser.nickname?.trim()); }
```

Admin users see additional features: custom order management, design upload, order stage progression.

### Session Management

30-minute session timer starts on login. Extension prompt appears at 5 minutes remaining. `isLoggedIn()` checks `sessionEnd && Date.now() < sessionEnd`.

### CSS & Design

- **Tailwind CSS** via CDN — utility classes used throughout
- **Custom CSS** in `index.html` `<style>` block for animations, page/modal visibility, nav states
- **Color scheme**: Navy `#001d4a` (primary), Gold `#D4AF37` (accent), Blue `#2563eb` (actions)
- **Font**: Nunito (700, 800, 900 weights)
- **Z-index layers**: `z-[500]`–`z-[900]` for modal stacking
- Mobile-first responsive design

### Feature Locks

```javascript
const LOCKED = ['shop', 'forum', 'custom'];
```

These pages require login. Navigating to a locked page while logged out triggers the login modal.

## Key User Flows

1. **Shop ordering**: Browse categories → add to cart → enter delivery info → generate QR for payment
2. **CNC custom abutment**: Add cases with tooth chart → select implant brand/size/color → submit → admin confirms → design review → approval → milling → shipping (7-stage pipeline)
3. **Used marketplace**: List parts with photo/price/condition → other users browse and contact seller
4. **Forum**: Create posts with images under Implant or Prosthetic categories → comment system
5. **Registration**: Fill form with dental license → PDPA consent → admin approves within 24h

## Important Notes

- **No package.json** — this is not a Node.js project
- **No TypeScript** — all code is vanilla ES6 JavaScript (uses `var` and `let` interchangeably)
- **Comments are in Korean** — section headers and code comments use Korean (`// 상수 & 데이터`, `// 세션 관리`, etc.)
- **Inline event handlers** — HTML elements use `onclick="functionName()"` pattern
- **All logic in one file** — `app.js` contains everything; no module system
- **Order IDs** use `CA` prefix format (e.g., `CA-20260303-001`)
- **Tooth numbering** uses FDI notation (11–17 upper right, 21–27 upper left, etc.)
- **Currency** is Thai Baht (THB)
- **Privacy compliance** follows Thailand PDPA (Personal Data Protection Act B.E. 2562)
