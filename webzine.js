// webzine.js — 웹진
// ============================================================
// WEBZINE
// ============================================================
var WEBZINE_CATEGORIES = [
  { key:'all',       labelKey:'wz_cat_all',       icon:'📰', grad:'from-slate-400 to-slate-600' },
  { key:'implant',   labelKey:'wz_cat_implant',   icon:'🦷', grad:'from-blue-400 to-blue-700' },
  { key:'prosthetic',labelKey:'wz_cat_prosthetic', icon:'🔧', grad:'from-amber-400 to-amber-700' },
  { key:'review',    labelKey:'wz_cat_review',    icon:'⭐', grad:'from-purple-400 to-purple-700' },
  { key:'news',      labelKey:'wz_cat_news',      icon:'📢', grad:'from-cyan-400 to-cyan-700' },
  { key:'education', labelKey:'wz_cat_education', icon:'📚', grad:'from-teal-400 to-teal-700' },
];
var webzineArticles = [];
var webzineCatFilter = 'all';

function renderWebzine() {
  // 관리자 글쓰기 버튼 표시
  var adminBtn = document.getElementById('webzineAdminBtn');
  if (adminBtn) adminBtn.classList.toggle('hidden', !isAdmin());
  // 카테고리 탭
  var catBar = document.getElementById('webzineCatBar');
  if (catBar) {
    catBar.innerHTML = WEBZINE_CATEGORIES.map(function(c) {
      var active = webzineCatFilter === c.key;
      return '<button onclick="webzineCatTab(\'' + c.key + '\')" class="shrink-0 px-3 py-1.5 rounded-xl font-black text-[11px] transition ' +
        (active ? 'bg-[#001d4a] text-white shadow' : 'bg-white text-slate-500 border border-slate-200') + '">' +
        c.icon + ' ' + t(c.labelKey) + '</button>';
    }).join('');
  }
  // 필터링
  var filtered = webzineCatFilter === 'all'
    ? webzineArticles
    : webzineArticles.filter(function(a){ return a.category === webzineCatFilter; });
  var list = document.getElementById('webzineList');
  if (!list) return;
  if (!filtered.length) {
    list.innerHTML = '<div class="col-span-2 text-center py-16"><p class="text-4xl mb-3 opacity-30">📰</p><p class="font-black text-slate-400 text-sm mb-1">' + t('empty_webzine') + '</p><p class="text-xs text-slate-300">' + t('empty_webzine_sub') + '</p></div>';
    return;
  }
  list.innerHTML = filtered.map(function(a) {
    var catCfg = WEBZINE_CATEGORIES.find(function(c){ return c.key === a.category; }) || {};
    var thumb = a.thumbnail_url
      ? '<img src="' + a.thumbnail_url + '" class="w-full h-full object-cover" loading="lazy">'
      : '<div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ' + (catCfg.grad || 'from-slate-400 to-slate-600') + '"><span class="text-4xl mb-1 opacity-80">' + (catCfg.icon || '📰') + '</span><span class="text-[9px] font-bold text-white/60">' + (catCfg.key !== 'all' ? t(catCfg.labelKey) : '') + '</span></div>';
    var dateStr = a.date ? a.date.slice(0,10) : '';
    var aid = typeof a.id === 'string' ? "'" + a.id + "'" : a.id;
    return '<div class="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer active:scale-[.97] transition" onclick="openWebzineDetail(' + aid + ')">' +
      '<div class="aspect-[4/3] overflow-hidden">' + thumb + '</div>' +
      '<div class="p-3">' +
        '<span class="inline-block text-[8px] font-black px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 mb-1">' + (catCfg.icon || '') + ' ' + t(catCfg.labelKey || 'wz_cat_news') + '</span>' +
        '<p class="font-black text-slate-800 text-xs leading-snug line-clamp-2 mb-1">' + escHtml(a.title) + '</p>' +
        '<div class="flex items-center gap-1.5 text-[9px] text-slate-300 font-bold">' +
          '<span>' + dateStr + '</span>' +
          '<span>·</span>' +
          '<span>👁 ' + (a.views || 0) + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}
function webzineCatTab(cat) {
  webzineCatFilter = cat;
  renderWebzine();
}
function openWebzineDetail(id) {
  var article = webzineArticles.find(function(a){ return a.id === id; });
  if (!article) return;
  // 조회수 증가
  article.views = (article.views || 0) + 1;
  if (typeof id === 'string') {
    sbUpdateWebzineArticle(id, { views: article.views }).catch(function(){});
  }
  // 썸네일
  var thumbWrap = document.getElementById('wzd-thumbWrap');
  var thumbImg  = document.getElementById('wzd-thumb');
  if (article.thumbnail_url) {
    thumbImg.src = article.thumbnail_url;
    thumbWrap.classList.remove('hidden');
  } else {
    thumbWrap.classList.add('hidden');
  }
  // 카테고리 배지
  var catCfg = WEBZINE_CATEGORIES.find(function(c){ return c.key === article.category; }) || {};
  document.getElementById('wzd-catBadge').textContent = (catCfg.icon || '') + ' ' + t(catCfg.labelKey || 'wz_cat_news');
  document.getElementById('wzd-title').textContent = article.title;
  document.getElementById('wzd-author').textContent = article.author_id || '';
  document.getElementById('wzd-date').textContent = article.date ? article.date.slice(0,10) : '';
  document.getElementById('wzd-views').textContent = article.views;
  // 마크다운 본문 렌더링
  document.getElementById('wzd-body').innerHTML = _renderMarkdown(article.body_md || '');
  goDetailPage('webzine-detail', article.title, 'webzine');
}
function _sanitizeUrl(url) {
  // XSS 방지: javascript:, data:, vbscript: 등 위험한 프로토콜 차단
  var trimmed = url.replace(/^\s+/, '').toLowerCase();
  if (trimmed.indexOf('javascript:') === 0 || trimmed.indexOf('vbscript:') === 0 || trimmed.indexOf('data:text') === 0) return '';
  return url;
}
function _renderMarkdown(md) {
  // 간단한 마크다운 → HTML 변환
  var html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3 class="font-black text-slate-800 text-base mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-black text-slate-800 text-lg mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-black text-slate-800 text-xl mt-6 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function(_, alt, src) {
      var safe = _sanitizeUrl(src);
      return safe ? '<img src="' + safe + '" alt="' + alt + '" class="w-full rounded-xl my-3" loading="lazy">' : '';
    })
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(_, text, href) {
      var safe = _sanitizeUrl(href);
      return safe ? '<a href="' + safe + '" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">' + text + '</a>' : text;
    })
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-sm">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-sm">$2</li>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/\n/g, '<br>');
  return '<p class="mb-3">' + html + '</p>';
}
// 홈 웹진 프리뷰
function renderHomeWebzinePreview() {
  var el = document.getElementById('homeWebzinePreview');
  if (!el) return;
  var wrap = el.parentElement;
  var latest = webzineArticles.filter(function(a){ return a.title; }).slice(0, 3);
  if (!latest.length) {
    if (wrap) wrap.style.display = 'none';
    return;
  }
  if (wrap) wrap.style.display = '';
  el.innerHTML = latest.map(function(a) {
    var catCfg = WEBZINE_CATEGORIES.find(function(c){ return c.key === a.category; }) || {};
    var thumb = a.thumbnail_url
      ? '<img src="' + a.thumbnail_url + '" class="w-full h-full object-cover" loading="lazy">'
      : '<div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ' + (catCfg.grad || 'from-slate-400 to-slate-600') + '"><span class="text-3xl opacity-80">' + (catCfg.icon || '📰') + '</span></div>';
    var dateStr = a.date ? a.date.slice(5, 10).replace('-', '/') : '';
    var aid = typeof a.id === 'string' ? "'" + a.id + "'" : a.id;
    return '<div class="rounded-xl overflow-hidden bg-white shadow-sm cursor-pointer active:scale-[.97] transition" onclick="openWebzineDetail(' + aid + ')">' +
      '<div class="aspect-square overflow-hidden relative">' + thumb +
        '<span class="absolute top-1 left-1 text-[7px] font-black px-1.5 py-0.5 rounded-full bg-white/80 backdrop-blur-sm text-slate-600">' + (catCfg.icon || '📰') + ' ' + t(catCfg.labelKey || 'wz_cat_news') + '</span>' +
      '</div>' +
      '<div class="p-1.5">' +
        '<p class="font-black text-[9px] text-slate-700 leading-tight line-clamp-2 mb-0.5">' + escHtml(a.title) + '</p>' +
        '<p class="text-[8px] text-slate-300 font-bold">' + dateStr + '</p>' +
      '</div>' +
    '</div>';
  }).join('');
}
// 관리자 글쓰기 폼
function toggleWebzineForm() {
  var wrap = document.getElementById('webzineFormWrap');
  if (!wrap) return;
  if (wrap.classList.contains('hidden')) {
    var catOpts = WEBZINE_CATEGORIES.filter(function(c){ return c.key !== 'all'; }).map(function(c) {
      return '<option value="' + c.key + '">' + c.icon + ' ' + t(c.labelKey) + '</option>';
    }).join('');
    wrap.innerHTML =
      '<div class="bg-white rounded-2xl p-4 shadow-sm space-y-2">' +
        '<p class="font-black text-xs text-slate-700">' + t('wz_form_title') + '</p>' +
        '<input id="wz-title" type="text" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-400" placeholder="' + t('wz_title_ph') + '">' +
        '<select id="wz-cat" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-400">' + catOpts + '</select>' +
        '<div class="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center cursor-pointer active:bg-slate-50" onclick="document.getElementById(\'wz-thumb-input\').click()">' +
          '<div id="wz-thumb-preview" class="text-slate-300 text-xs font-bold">📷 ' + t('wz_thumb_ph') + '</div>' +
          '<input id="wz-thumb-input" type="file" accept="image/*" class="hidden" onchange="previewWebzineThumb()">' +
        '</div>' +
        '<textarea id="wz-body" rows="8" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-400 resize-none font-mono" placeholder="' + t('wz_body_ph') + '"></textarea>' +
        '<button onclick="submitWebzineArticle()" class="w-full py-2.5 bg-[#001d4a] text-white rounded-xl font-black text-xs active:scale-95 transition">' + t('wz_submit_btn') + '</button>' +
      '</div>';
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
  }
}
var _wzThumbUrl = null;
function previewWebzineThumb() {
  var file = document.getElementById('wz-thumb-input').files[0];
  if (!file) return;
  var preview = document.getElementById('wz-thumb-preview');
  // 먼저 Supabase Storage 업로드 시도
  var fileName = 'wz_' + Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9._-]/g, '');
  fetch(SUPABASE_URL + '/storage/v1/object/webzine/' + fileName, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Content-Type': file.type,
      'x-upsert': 'true'
    },
    body: file
  }).then(function(res) {
    if (res.ok) {
      _wzThumbUrl = SUPABASE_URL + '/storage/v1/object/public/webzine/' + fileName;
      preview.innerHTML = '<img src="' + _wzThumbUrl + '" class="w-full h-32 object-cover rounded-lg">';
    } else {
      // 스토리지 실패 시 base64 폴백
      var reader = new FileReader();
      reader.onload = function(e) {
        _wzThumbUrl = e.target.result;
        preview.innerHTML = '<img src="' + _wzThumbUrl + '" class="w-full h-32 object-cover rounded-lg">';
      };
      reader.readAsDataURL(file);
    }
  }).catch(function() {
    var reader = new FileReader();
    reader.onload = function(e) {
      _wzThumbUrl = e.target.result;
      preview.innerHTML = '<img src="' + _wzThumbUrl + '" class="w-full h-32 object-cover rounded-lg">';
    };
    reader.readAsDataURL(file);
  });
}
async function submitWebzineArticle() {
  var title = (document.getElementById('wz-title').value || '').trim();
  var cat   = (document.getElementById('wz-cat').value || 'news');
  var body  = (document.getElementById('wz-body').value || '').trim();
  if (!title || !body) { showToast(t('wz_fill_alert'), 'warning'); return; }
  var article = {
    category:      cat,
    title:         title,
    body_md:       body,
    thumbnail_url: _wzThumbUrl || null,
    author_id:     currentUser.nickname || '',
    is_published:  true,
  };
  try {
    var saved = await sbSaveWebzineArticle(article);
    if (saved) {
      webzineArticles.unshift({
        id: saved.id, category: saved.category, title: saved.title,
        body_md: saved.body_md, thumbnail_url: saved.thumbnail_url,
        author_id: saved.author_id, views: 0, date: saved.created_at,
      });
    }
  } catch(e) { handleSupabaseError(e, 'Webzine Save'); }
  _wzThumbUrl = null;
  document.getElementById('webzineFormWrap').classList.add('hidden');
  renderWebzine();
  renderHomeWebzinePreview();
}
// 관리자 패널: 웹진 관리
function renderAdminWebzine() {
  var list = document.getElementById('adminTabWebzine');
  if (!list) return;
  if (!webzineArticles.length) {
    list.innerHTML = '<p class="text-center text-slate-400 text-sm py-8 font-bold">' + t('wz_empty') + '</p>';
    return;
  }
  list.innerHTML = webzineArticles.map(function(a) {
    var aid = typeof a.id === 'string' ? "'" + a.id + "'" : a.id;
    var catCfg = WEBZINE_CATEGORIES.find(function(c){ return c.key === a.category; }) || {};
    return '<div class="bg-white rounded-xl p-3 mb-2 shadow-sm flex items-center gap-3">' +
      (a.thumbnail_url ? '<img src="' + a.thumbnail_url + '" class="w-12 h-12 rounded-lg object-cover shrink-0" loading="lazy">' : '<div class="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center shrink-0"><span class="text-xl">📰</span></div>') +
      '<div class="flex-1 min-w-0">' +
        '<p class="font-black text-xs text-slate-800 truncate">' + escHtml(a.title) + '</p>' +
        '<p class="text-[9px] text-slate-400">' + (catCfg.icon || '') + ' ' + t(catCfg.labelKey || '') + ' · 👁 ' + (a.views || 0) + '</p>' +
      '</div>' +
      '<button onclick="adminDeleteWebzine(' + aid + ')" class="shrink-0 px-3 py-1.5 bg-red-50 text-red-500 rounded-xl font-black text-[10px]">' + t('forum_delete') + '</button>' +
    '</div>';
  }).join('');
}
async function adminDeleteWebzine(id) {
  if (!confirm(t('wz_delete_confirm'))) return;
  webzineArticles = webzineArticles.filter(function(a){ return a.id !== id; });
  if (typeof id === 'string') {
    try { await sbDeleteWebzineArticle(id); } catch(e) { console.error('[Webzine Delete]', e); }
  }
  renderAdminWebzine();
  renderWebzine();
  renderHomeWebzinePreview();
}
