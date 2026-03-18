// ============================================================
// Service Worker — Phase 5-2 캐싱 전략 개선
// 정적 파일: Cache First / API 호출: Network First
// ============================================================

const CACHE_VERSION = 'dentalk-v5';
const STATIC_ASSETS = [
  './',
  './index.html',
  './app.js',
  './lang.js',
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
];

// ── Install: 정적 자산 프리캐시 ──
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(function(cache) { return cache.addAll(STATIC_ASSETS); })
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
