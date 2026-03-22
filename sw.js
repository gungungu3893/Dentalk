// ============================================================
// Service Worker — Phase 5-5 배포 준비
// 정적 파일: Cache First / API 호출: Network First
// 오프라인 폴백 페이지 개선
// ============================================================

const CACHE_VERSION = 'dentalk-v28';
const STATIC_ASSETS = [
  './',
  './index.html',
  './app.js',
  './auth.js',
  './shop.js',
  './custom.js',
  './forum.js',
  './admin.js',
  './jobs.js',
  './webzine.js',
  './events.js',
  './ads.js',
  './lang.js',
  './lang-en.js',
  './lang-ko.js',
  './lang-zh.js',
  './lang-th.js',
  './lang-vi.js',
  './lang-es.js',
  './lang-tr.js',
  './supabase.js',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './manifest.json',
];

// API/동적 요청 패턴
const API_PATTERNS = [
  'supabase.co',
  'googleapis.com',
  'cdn.tailwindcss.com',
  'cdn.jsdelivr.net',
  'api.qrserver.com',
];

// 오프라인 폴백 페이지 HTML
const OFFLINE_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Dentalk — Offline</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:#001d4a;color:white;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:2rem}
.wrap{max-width:360px}
h1{font-size:2.5rem;font-weight:900;margin-bottom:.5rem;letter-spacing:-1px}
h1 span{color:#D4AF37}
p{font-size:.85rem;opacity:.6;margin-bottom:2rem;line-height:1.6}
button{background:#D4AF37;color:#001d4a;border:none;padding:14px 32px;border-radius:16px;font-weight:900;font-size:.85rem;cursor:pointer}
button:active{transform:scale(.96)}
.icon{font-size:4rem;margin-bottom:1.5rem}
</style>
</head>
<body>
<div class="wrap">
<div class="icon">📡</div>
<h1>den<span>t</span>alk</h1>
<p>You are currently offline.<br>Please check your internet connection and try again.</p>
<button onclick="location.reload()">Try Again</button>
</div>
</body>
</html>`;

// ── Install: 정적 자산 프리캐시 + 오프라인 페이지 ──
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(function(cache) {
        // 오프라인 폴백 페이지 저장
        cache.put(new Request('/_offline'), new Response(OFFLINE_PAGE, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }));
        return cache.addAll(STATIC_ASSETS);
      })
      .then(function() { return self.skipWaiting(); })
  );
});

// ── Activate: 이전 버전 캐시 삭제 ──
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_VERSION; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

// ── Fetch: 전략 분리 ──
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;

  var url = e.request.url;

  // API/외부 요청 → Network First
  var isApi = API_PATTERNS.some(function(p) { return url.indexOf(p) !== -1; });
  if (isApi) {
    e.respondWith(networkFirst(e.request));
    return;
  }

  // 네비게이션 요청 (HTML 페이지) → Network First + 오프라인 폴백
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE_VERSION).then(function(cache) { cache.put(e.request, clone); });
          }
          return response;
        })
        .catch(function() {
          return caches.match(e.request)
            .then(function(cached) {
              return cached || caches.match('/_offline');
            });
        })
    );
    return;
  }

  // 정적 자산 → Cache First
  e.respondWith(cacheFirst(e.request));
});

// ── Cache First 전략: 캐시 우선, 없으면 네트워크 ──
function cacheFirst(request) {
  return caches.match(request).then(function(cached) {
    if (cached) return cached;
    return fetch(request).then(function(response) {
      if (response && response.status === 200) {
        var clone = response.clone();
        caches.open(CACHE_VERSION).then(function(cache) {
          cache.put(request, clone);
        });
      }
      return response;
    }).catch(function() {
      // 이미지 요청 실패 시 빈 응답 반환
      if (request.destination === 'image') {
        return new Response('', { status: 200, headers: { 'Content-Type': 'image/svg+xml' } });
      }
      return caches.match('./index.html');
    });
  });
}

// ── Network First 전략: 네트워크 우선, 실패 시 캐시 ──
function networkFirst(request) {
  return fetch(request).then(function(response) {
    if (response && response.status === 200) {
      var clone = response.clone();
      caches.open(CACHE_VERSION).then(function(cache) {
        cache.put(request, clone);
      });
    }
    return response;
  }).catch(function() {
    return caches.match(request);
  });
}
