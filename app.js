// app.js — 코어: 유틸리티, PWA, 상수, 상태, 메뉴, 페이지전환, 언어, 홈, 검색, 알림, 무한스크롤, 초기화
// ============================================================
// 유틸리티 — XSS 방지 HTML 이스케이핑 + 토스트 알림 + 로딩 스피너
// ============================================================
function dtLoaderHtml(text) {
  return '<div class="dt-loader">' +
    '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M24 4 C24 4 28 6 28 10 L28 14 C29.5 14.5 30.8 15.2 32 16 L35 14 C35 14 38 13 40 16 C42 19 40 22 40 22 L37 24 C37.3 25.3 37.3 26.7 37 28 L40 30 C40 30 42 32 40 35 C38 38 35 37 35 37 L32 35 C30.8 35.8 29.5 36.5 28 37 L28 40 C28 40 28 44 24 44 C20 44 20 40 20 40 L20 37 C18.5 36.5 17.2 35.8 16 35 L13 37 C13 37 10 38 8 35 C6 32 8 30 8 30 L11 28 C10.7 26.7 10.7 25.3 11 24 L8 22 C8 22 6 19 8 16 C10 13 13 14 13 14 L16 16 C17.2 15.2 18.5 14.5 20 14 L20 10 C20 10 20 4 24 4Z" stroke="#D4AF37" stroke-width="2.5" fill="none"/>' +
      '<circle cx="24" cy="24" r="7" stroke="#D4AF37" stroke-width="2" fill="none"/>' +
    '</svg>' +
    '<span class="dt-loader-text">' + (text || t('loading_text')) + '</span>' +
  '</div>';
}
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function showToast(msg, type) {
  var existing = document.getElementById('dtToast');
  if (existing) existing.remove();
  var colors = {
    error:   'bg-red-600',
    success: 'bg-green-600',
    warning: 'bg-amber-500',
    info:    'bg-blue-600',
  };
  var bg = colors[type] || colors.info;
  var toast = document.createElement('div');
  toast.id = 'dtToast';
  toast.className = 'fixed top-16 left-1/2 -translate-x-1/2 z-[9999] ' + bg + ' text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs max-w-[90vw] text-center';
  toast.style.cssText = 'animation:fadeUp .3s ease;';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(function() { if (toast.parentNode) toast.remove(); }, 3500);
}

function handleSupabaseError(e, context) {
  console.error('[Supabase:' + context + ']', e);
  var msg = e && e.message ? e.message : String(e);
  if (msg.indexOf('Failed to fetch') !== -1 || msg.indexOf('NetworkError') !== -1 || msg.indexOf('Load failed') !== -1) {
    showToast(t('err_network'), 'error');
  } else if (msg.indexOf('JWT') !== -1 || msg.indexOf('token') !== -1) {
    showToast(t('err_session_expired'), 'error');
  } else if (msg.indexOf('401') !== -1 || msg.indexOf('403') !== -1) {
    showToast(t('err_auth'), 'error');
  } else {
    // 구체적인 HTTP 상태 코드를 콘솔에 출력하여 디버깅 용이
    console.warn('[Supabase:' + context + '] Detail:', msg);
    showToast(t('err_generic'), 'error');
  }
}

// ============================================================
// PWA — 홈 화면에 바로가기 추가 안내
// ============================================================
function triggerInstall() {
  var existing = document.getElementById('installGuidePopup');
  if (existing) existing.remove();
  var popup = document.createElement('div');
  popup.id = 'installGuidePopup';
  popup.innerHTML =
    '<div class="fixed inset-0 z-[999] flex items-end" style="background:rgba(0,0,0,.6)" onclick="document.getElementById(\'installGuidePopup\').remove()">' +
    '<div class="bg-white rounded-t-3xl w-full p-6 pb-10" onclick="event.stopPropagation()">' +
      '<p class="text-center text-base font-black text-slate-800 mb-6">' + t('install_title') + '</p>' +
      '<div class="grid grid-cols-4 gap-3 mb-6">' +
        '<button onclick="showInstallGuide(\'android\')" class="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 active:bg-slate-200">' +
          '<svg viewBox="0 0 24 24" class="w-10 h-10" fill="#3DDC84"><path d="M17.523 15.341a.676.676 0 0 1-.676-.676V9.382a.676.676 0 0 1 1.352 0v5.283a.676.676 0 0 1-.676.676zm-11.046 0a.676.676 0 0 1-.676-.676V9.382a.676.676 0 0 1 1.352 0v5.283a.676.676 0 0 1-.676.676zM8.6 17.6a.6.6 0 0 0 .6.6h.9v2.124a.676.676 0 0 0 1.352 0V18.2h1.096v2.124a.676.676 0 0 0 1.352 0V18.2h.9a.6.6 0 0 0 .6-.6V9H8.6v8.6zM14.863 4.487l.807-1.44a.17.17 0 0 0-.298-.163l-.817 1.456A5.3 5.3 0 0 0 12 3.9a5.3 5.3 0 0 0-2.555.44L8.628 2.884a.17.17 0 0 0-.298.163l.807 1.44A5.2 5.2 0 0 0 6.6 8.8h10.8a5.2 5.2 0 0 0-2.537-4.313zM10.5 7a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm3 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z"/></svg>' +
          '<span class="text-[10px] font-black text-slate-700">Android</span>' +
        '</button>' +
        '<button onclick="showInstallGuide(\'ios\')" class="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 active:bg-slate-200">' +
          '<svg viewBox="0 0 24 24" class="w-10 h-10" fill="#000"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>' +
          '<span class="text-[10px] font-black text-slate-700">iOS</span>' +
        '</button>' +
        '<button onclick="showInstallGuide(\'windows\')" class="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 active:bg-slate-200">' +
          '<svg viewBox="0 0 24 24" class="w-10 h-10" fill="#0078D4"><path d="M3 12V6.75l6-1.32v6.57H3zm17-9v8.75h-7V4.68L20 3zM3 13h6v6.43l-6-1.29V13zm17 .25V22l-7-1.23V13.25H20z"/></svg>' +
          '<span class="text-[10px] font-black text-slate-700">Windows</span>' +
        '</button>' +
        '<button onclick="showInstallGuide(\'mac\')" class="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 active:bg-slate-200">' +
          '<svg viewBox="0 0 24 24" class="w-10 h-10" fill="#555"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>' +
          '<span class="text-[10px] font-black text-slate-700">Mac</span>' +
        '</button>' +
      '</div>' +
      '<button onclick="document.getElementById(\'installGuidePopup\').remove()" class="w-full py-3 bg-slate-100 text-slate-600 font-black rounded-2xl text-sm">' + t('install_cancel') + '</button>' +
    '</div></div>';
  document.body.appendChild(popup);
}
function showInstallGuide(type) {
  var existing = document.getElementById('installGuidePopup');
  if (existing) existing.remove();
  var guides = {
    android: {
      icon: '<svg viewBox="0 0 24 24" class="w-8 h-8 mx-auto mb-2" fill="#3DDC84"><path d="M17.523 15.341a.676.676 0 0 1-.676-.676V9.382a.676.676 0 0 1 1.352 0v5.283a.676.676 0 0 1-.676.676zm-11.046 0a.676.676 0 0 1-.676-.676V9.382a.676.676 0 0 1 1.352 0v5.283a.676.676 0 0 1-.676.676zM8.6 17.6a.6.6 0 0 0 .6.6h.9v2.124a.676.676 0 0 0 1.352 0V18.2h1.096v2.124a.676.676 0 0 0 1.352 0V18.2h.9a.6.6 0 0 0 .6-.6V9H8.6v8.6zM14.863 4.487l.807-1.44a.17.17 0 0 0-.298-.163l-.817 1.456A5.3 5.3 0 0 0 12 3.9a5.3 5.3 0 0 0-2.555.44L8.628 2.884a.17.17 0 0 0-.298.163l.807 1.44A5.2 5.2 0 0 0 6.6 8.8h10.8a5.2 5.2 0 0 0-2.537-4.313zM10.5 7a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm3 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z"/></svg>',
      title: t('install_android_title'),
      steps: t('install_android_steps')
    },
    ios: {
      icon: '<svg viewBox="0 0 24 24" class="w-8 h-8 mx-auto mb-2" fill="#000"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
      title: t('install_ios_title'),
      steps: t('install_ios_steps')
    },
    windows: {
      icon: '<svg viewBox="0 0 24 24" class="w-8 h-8 mx-auto mb-2" fill="#0078D4"><path d="M3 12V6.75l6-1.32v6.57H3zm17-9v8.75h-7V4.68L20 3zM3 13h6v6.43l-6-1.29V13zm17 .25V22l-7-1.23V13.25H20z"/></svg>',
      title: t('install_win_title'),
      steps: t('install_win_steps')
    },
    mac: {
      icon: '<svg viewBox="0 0 24 24" class="w-8 h-8 mx-auto mb-2" fill="#555"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
      title: t('install_mac_title'),
      steps: t('install_mac_steps')
    }
  };
  var g = guides[type];
  var popup = document.createElement('div');
  popup.id = 'installGuidePopup';
  popup.innerHTML =
    '<div class="fixed inset-0 z-[999] flex items-end" style="background:rgba(0,0,0,.6)" onclick="document.getElementById(\'installGuidePopup\').remove()">' +
    '<div class="bg-white rounded-t-3xl w-full p-6 pb-10" onclick="event.stopPropagation()">' +
      '<div class="text-center mb-4">' + g.icon + '<p class="text-base font-black text-slate-800">' + g.title + '</p></div>' +
      '<p class="text-sm text-slate-700 leading-relaxed mb-6 bg-slate-50 rounded-2xl p-4">' + g.steps + '</p>' +
      '<div class="flex gap-3">' +
        '<button onclick="triggerInstall()" class="flex-1 py-3 bg-slate-100 text-slate-600 font-black rounded-2xl text-sm">' + t('install_back') + '</button>' +
        '<button onclick="document.getElementById(\'installGuidePopup\').remove()" class="flex-1 py-3 bg-[#001d4a] text-white font-black rounded-2xl text-sm">' + t('install_ok') + '</button>' +
      '</div>' +
    '</div></div>';
  document.body.appendChild(popup);
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js');
  });
}

// ============================================================
// 상수 & 데이터
// ============================================================
const LOCKED = ['shop','forum','custom'];
const IMPLANT_BRANDS = ['BIOTEM N','BIOTEM R','Osstem US','Osstem TS','Straumann BL','Straumann TL','Nobel Active','Nobel Replace','Zimmer TSV','Dentium SuperLine','기타'];
const TOOTH_COLORS   = ['A1','A2','A3','A3.5','A4','B1','B2','B3','C1','C2','C3','D2','D3','BL (Bleach)'];
const ORDER_STAGES   = [
  {key:'submitted',   icon:'①'},
  {key:'confirmed',   icon:'②'},
  {key:'design_ready',icon:'③'},
  {key:'approved',    icon:'④'},
  {key:'milling',     icon:'⑤'},
  {key:'shipped',     icon:'⑥'},
  {key:'done',        icon:'⑦'},
];
// ADMIN_NICKNAMES 제거 — isAdmin()은 role='admin' 기준으로 판별 (supabase.js)
const LINE_PROXY_URL = 'https://dentalk-line.gungungu.workers.dev';
const LINE_USER_ID   = 'U6265c5810e5592b820c224588433c247';
// ── Supabase 상수는 supabase.js에서 정의됩니다 ──────────────────
// ============================================================
// 상태
// ============================================================
let currentPage  = 'home';
let prevPage     = 'home';
let currentLang  = 'th';
let pendingLang  = null; // 저장 전 선택된 언어
let currentUser  = { licenseNum:'', nickname:'', email:'', phone:'', address:'', clinicName:'', doctorName:'', role:'' };
let cart         = [];
let currentProd  = null;
let tableQtys    = {};
let usedItems    = [
  {id:1,name:'Scan Body HSAM4007S',code:'HSAM4007S',price:1500,cond:'good',desc:'Used 2 times.',contact:'Line: dental_th',seller:'Dr. Kim',date:'2026-02-10',views:0,image:null},
  {id:2,name:'Q-Base QBAM4401S',code:'QBAM4401S',price:2000,cond:'new',desc:'Opened but never used.',contact:'Tel: 089-123-4567',seller:'Dr. Lee',date:'2026-02-18',views:0,image:null},
];
let posts        = [
  {id:1,category:'implant',title:'BIOPLANT Manufacturing Info',body:'Manufactured in Thailand with high precision.',author:'Admin',images:[],comments:[],views:0,date:'2026-02-10'},
  {id:2,category:'prosthetic',title:'보철 케이스 공유',body:'보철 제작 시 참고할 만한 케이스입니다.',author:'Dr. Lee',images:[],comments:[],views:0,date:'2026-02-20'},
];
let forumCategory     = 'implant';
let forumRegion       = 'all';
let forumProvince     = 'all';
let forumPhotos       = [];
let currentForumPostId = null;
// 진료 과목 카테고리
var FORUM_CATEGORIES = [
  { key: 'implant',       icon: '🦷', labelKey: 'forum_cat_implant' },
  { key: 'prosthetic',    icon: '💎', labelKey: 'forum_cat_prosthetic' },
  { key: 'conservative',  icon: '🪥', labelKey: 'forum_cat_conservative' },
  { key: 'orthodontics',  icon: '🦷', labelKey: 'forum_cat_orthodontics' },
  { key: 'oral_surgery',  icon: '✂️', labelKey: 'forum_cat_oral_surgery' },
  { key: 'periodontics',  icon: '🌿', labelKey: 'forum_cat_periodontics' },
  { key: 'pediatric',     icon: '👶', labelKey: 'forum_cat_pediatric' },
  { key: 'radiology',     icon: '📷', labelKey: 'forum_cat_radiology' },
  { key: 'oral_medicine', icon: '💊', labelKey: 'forum_cat_oral_medicine' },
  { key: 'preventive',    icon: '🛡', labelKey: 'forum_cat_preventive' },
  { key: 'general',       icon: '🏥', labelKey: 'forum_cat_general' },
];
// 태국 지역 + 주(province) 구조
var FORUM_REGIONS = [
  { key: 'all', labelKey: 'forum_region_all', icon: '🌏', provinces: [] },
  { key: 'north', labelKey: 'forum_region_north', icon: '🏔', provinces: [
    { key: 'chiang_mai',  label: 'Chiang Mai' },
    { key: 'chiang_rai',  label: 'Chiang Rai' },
    { key: 'lampang',     label: 'Lampang' },
    { key: 'lamphun',     label: 'Lamphun' },
    { key: 'mae_hong_son',label: 'Mae Hong Son' },
    { key: 'nan',         label: 'Nan' },
    { key: 'phayao',      label: 'Phayao' },
    { key: 'phrae',       label: 'Phrae' },
    { key: 'uttaradit',   label: 'Uttaradit' },
  ]},
  { key: 'northeast', labelKey: 'forum_region_northeast', icon: '🌾', provinces: [
    { key: 'amnat_charoen',    label: 'Amnat Charoen' },
    { key: 'bueng_kan',        label: 'Bueng Kan' },
    { key: 'buri_ram',         label: 'Buri Ram' },
    { key: 'chaiyaphum',       label: 'Chaiyaphum' },
    { key: 'kalasin',          label: 'Kalasin' },
    { key: 'khon_kaen',        label: 'Khon Kaen' },
    { key: 'loei',             label: 'Loei' },
    { key: 'maha_sarakham',    label: 'Maha Sarakham' },
    { key: 'mukdahan',         label: 'Mukdahan' },
    { key: 'nakhon_phanom',    label: 'Nakhon Phanom' },
    { key: 'nakhon_ratchasima',label: 'Nakhon Ratchasima' },
    { key: 'nong_bua_lam_phu', label: 'Nong Bua Lam Phu' },
    { key: 'nong_khai',        label: 'Nong Khai' },
    { key: 'roi_et',           label: 'Roi Et' },
    { key: 'sakon_nakhon',     label: 'Sakon Nakhon' },
    { key: 'si_sa_ket',        label: 'Si Sa Ket' },
    { key: 'surin',            label: 'Surin' },
    { key: 'ubon_ratchathani', label: 'Ubon Ratchathani' },
    { key: 'udon_thani',       label: 'Udon Thani' },
    { key: 'yasothon',         label: 'Yasothon' },
  ]},
  { key: 'east', labelKey: 'forum_region_east', icon: '🌊', provinces: [
    { key: 'chachoengsao', label: 'Chachoengsao' },
    { key: 'chanthaburi',  label: 'Chanthaburi' },
    { key: 'chon_buri',    label: 'Chon Buri' },
    { key: 'prachin_buri', label: 'Prachin Buri' },
    { key: 'rayong',       label: 'Rayong' },
    { key: 'sa_kaeo',      label: 'Sa Kaeo' },
    { key: 'trat',         label: 'Trat' },
  ]},
  { key: 'south', labelKey: 'forum_region_south', icon: '🏝', provinces: [
    { key: 'chumphon',            label: 'Chumphon' },
    { key: 'krabi',               label: 'Krabi' },
    { key: 'nakhon_si_thammarat', label: 'Nakhon Si Thammarat' },
    { key: 'narathiwat',          label: 'Narathiwat' },
    { key: 'pattani',             label: 'Pattani' },
    { key: 'phang_nga',           label: 'Phang Nga' },
    { key: 'phatthalung',         label: 'Phatthalung' },
    { key: 'phuket',              label: 'Phuket' },
    { key: 'ranong',              label: 'Ranong' },
    { key: 'satun',               label: 'Satun' },
    { key: 'songkhla',            label: 'Songkhla' },
    { key: 'surat_thani',         label: 'Surat Thani' },
    { key: 'trang',               label: 'Trang' },
    { key: 'yala',                label: 'Yala' },
  ]},
  { key: 'central', labelKey: 'forum_region_central', icon: '🏙', provinces: [
    { key: 'ang_thong',           label: 'Ang Thong' },
    { key: 'ayutthaya',           label: 'Ayutthaya' },
    { key: 'bangkok',             label: 'Bangkok' },
    { key: 'chai_nat',            label: 'Chai Nat' },
    { key: 'kanchanaburi',        label: 'Kanchanaburi' },
    { key: 'lopburi',             label: 'Lopburi' },
    { key: 'nakhon_nayok',        label: 'Nakhon Nayok' },
    { key: 'nakhon_pathom',       label: 'Nakhon Pathom' },
    { key: 'nakhon_sawan',        label: 'Nakhon Sawan' },
    { key: 'nonthaburi',          label: 'Nonthaburi' },
    { key: 'pathum_thani',        label: 'Pathum Thani' },
    { key: 'phetchabun',          label: 'Phetchabun' },
    { key: 'phetchaburi',         label: 'Phetchaburi' },
    { key: 'phichit',             label: 'Phichit' },
    { key: 'phitsanulok',         label: 'Phitsanulok' },
    { key: 'prachuap_khiri_khan', label: 'Prachuap Khiri Khan' },
    { key: 'ratchaburi',          label: 'Ratchaburi' },
    { key: 'samut_prakan',        label: 'Samut Prakan' },
    { key: 'samut_sakhon',        label: 'Samut Sakhon' },
    { key: 'samut_songkhram',     label: 'Samut Songkhram' },
    { key: 'saraburi',            label: 'Saraburi' },
    { key: 'sing_buri',           label: 'Sing Buri' },
    { key: 'sukhothai',           label: 'Sukhothai' },
    { key: 'suphan_buri',         label: 'Suphan Buri' },
    { key: 'tak',                 label: 'Tak' },
    { key: 'uthai_thani',         label: 'Uthai Thani' },
  ]},
];
// ── 리더 직책 (피라미드 계층) ──────────────────────────────────
// 전국(all): 5명 — 회장, 부회장, 총무, 이사, 감사
// 지역(region): 2명 — 회장, 부회장
// 주(province): 1명 — 대표
var LEADER_TITLES_NATIONAL = [
  { key: 'president',      labelKey: 'title_president' },
  { key: 'vice_president', labelKey: 'title_vice_president' },
  { key: 'secretary',      labelKey: 'title_secretary' },
  { key: 'director',       labelKey: 'title_director' },
  { key: 'auditor',        labelKey: 'title_auditor' },
];
var LEADER_TITLES_REGIONAL = [
  { key: 'president',      labelKey: 'title_president' },
  { key: 'secretary',      labelKey: 'title_secretary' },
];
var LEADER_TITLES_PROVINCE = [
  { key: 'representative', labelKey: 'title_representative' },
];
// 갤러리 슬라이더 상태
var forumGalleryImages = [];
var forumGalleryIndex  = 0;
let events_      = [{id:1,date:'2026-03-15',event:'BIOPLANT Factory Tour',loc:'Bangkok'}];
let customOrders = [];
let messages     = []; // {id,from,to,subject,body,date,read}
let caseCount    = 0;
let caseTeeth    = {};
// Session
let sessionEnd   = null;
let sessionTimer = null;
let extShown     = false;
let pendingPage  = null;

// ============================================================
// 메뉴 & 페이지 전환
// ============================================================
let menuOpen = false;
function toggleMenu() { menuOpen ? closeMenu() : openMenu(); }
function openMenu() {
  menuOpen = true;
  var sm = document.getElementById('sideMenu');    if (sm) sm.classList.add('open');
  var so = document.getElementById('sideOverlay'); if (so) so.classList.add('open');
  var h1 = document.getElementById('hb1'); if (h1) h1.style.cssText = 'transform:translateY(8px) rotate(45deg)';
  var h2 = document.getElementById('hb2'); if (h2) h2.style.cssText = 'opacity:0';
  var h3 = document.getElementById('hb3'); if (h3) h3.style.cssText = 'transform:translateY(-8px) rotate(-45deg)';
}
function closeMenu() {
  menuOpen = false;
  var sm = document.getElementById('sideMenu');    if (sm) sm.classList.remove('open');
  var so = document.getElementById('sideOverlay'); if (so) so.classList.remove('open');
  var h1 = document.getElementById('hb1'); if (h1) h1.style.cssText = '';
  var h2 = document.getElementById('hb2'); if (h2) h2.style.cssText = '';
  var h3 = document.getElementById('hb3'); if (h3) h3.style.cssText = '';
}
// ── 전역 네비 드롭다운 (position:fixed — overflow 클리핑 없음) ──────
function openNavDropdown(type, event) {
  event.stopPropagation();
  // 잠긴 페이지는 로그인 먼저
  if (LOCKED.includes(type) && !isLoggedIn()) {
    openLoginModal(type);
    return;
  }
  var drop  = document.getElementById('navDropdown');
  var inner = document.getElementById('navDropdownInner');
  if (!drop || !inner) return;
  // 같은 탭 재클릭 시 토글
  if (drop.style.display === 'block' && drop.dataset.type === type) {
    closeNavDropdown(); return;
  }
  drop.dataset.type = type;
  if (type === 'custom') {
    // 로그인 된 경우만 여기 도달 — 바로 페이지 이동
    closeNavDropdown();
    goPage('custom');
    return;
  } else if (type === 'forum') {
    // 포럼은 드롭다운 없이 바로 페이지 이동
    closeNavDropdown();
    goPage('forum');
    return;
  } else if (type === 'shop') {
    inner.innerHTML = SHOP_CATEGORIES.map(function(cat) {
      return '<button class="nav-drop-item" onclick="goShopSub(\'' + cat.id + '\')">' +
        '<span>' + cat.name + '</span>' +
        '<span class="sub-desc">' + cat.desc + '</span>' +
      '</button>';
    }).join('');
  }
  applyLang();
  var btn  = event.currentTarget;
  var rect = btn.getBoundingClientRect();
  drop.style.left = Math.max(4, rect.left) + 'px';
  drop.style.top  = (rect.bottom + 4) + 'px';
  drop.style.display = 'block';
  requestAnimationFrame(function() {
    var dw = drop.offsetWidth;
    if (rect.left + dw > window.innerWidth - 4) {
      drop.style.left = Math.max(4, window.innerWidth - dw - 4) + 'px';
    }
  });
}
function closeNavDropdown() {
  var drop = document.getElementById('navDropdown');
  if (drop) { drop.style.display = 'none'; drop.dataset.type = ''; }
}
function goForumSub(cat) {
  closeNavDropdown();
  forumCategory = cat;
  goPage('forum');
}
function goShopSub(catId) {
  closeNavDropdown();
  if (LOCKED.includes('shop') && !isLoggedIn()) { openLoginModal('shop'); return; }
  var cat = SHOP_CATEGORIES.find(function(c){ return c.id === catId; });
  renderShopItems(catId);
  goDetailPage('shop-items', cat ? cat.name : catId, 'shop');
}
function updateNavLocks() {
  var loggedIn = isLoggedIn();
  var admin    = isAdmin();
  ['shop','custom','forum'].forEach(function(id) {
    var lock = document.getElementById('ntab-lock-' + id);
    if (lock) lock.classList.toggle('hidden', loggedIn);
  });
  // 관리자 전용 탭 show/hide
  var adminTab = document.getElementById('ntab-factory');
  if (adminTab) adminTab.classList.toggle('hidden', !admin);
  // 헤더 로그아웃 버튼 show/hide
  var logoutBtn = document.getElementById('headerLogoutBtn');
  if (logoutBtn) {
    if (loggedIn) { logoutBtn.classList.remove('hidden'); logoutBtn.classList.add('show'); }
    else          { logoutBtn.classList.add('hidden');    logoutBtn.classList.remove('show'); }
  }
}
document.addEventListener('click', function() { closeNavDropdown(); });

function updateNavTabs(activeId) {
  document.querySelectorAll('.nav-tab').forEach(function(t){ t.classList.remove('active'); });
  var nt = document.getElementById('ntab-' + activeId);
  if (nt) nt.classList.add('active');
  var navBar = document.getElementById('navTabBar');
  if (navBar) {
    navBar.style.display = '';
  }
}
function goPage(id) {
  if (LOCKED.includes(id) && !isLoggedIn()) { closeMenu(); openLoginModal(id); return; }
  if (id === 'factory' && !isAdmin()) { goPage('home'); return; }
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.menu-btn').forEach(function(b){ b.classList.remove('active'); });
  document.getElementById('page-' + id).classList.add('active');
  var mb = document.getElementById('mb-' + id);
  if (mb) mb.classList.add('active');
  document.getElementById('pageTitle') && (document.getElementById('pageTitle').textContent = t('pt_' + id));
  updateNavTabs(id);
  currentPage = id;
  var btnBack = document.getElementById('btnBack');
  var btnMenu = document.getElementById('btnMenu');
  if (btnBack) { btnBack.classList.add('hidden'); btnBack.classList.remove('flex'); }
  if (btnMenu) btnMenu.classList.remove('hidden');
  closeMenu();
  window.scrollTo(0, 0);
  if (id === 'home')   { renderHomePage(); initHomeBanner(); refreshScrollReveal(); }
  if (id === 'shop')     renderShop();
  if (id === 'used')     renderUsed();
  if (id === 'forum')  { renderForum(); updateNicknameDisplays(); }
  if (id === 'jobs')     renderJobs();
  if (id === 'webzine')  renderWebzine();
  if (id === 'events')   renderEvents();
  if (id === 'custom')   { customTab('form'); resetCustomForm(); }
  if (id === 'factory')  renderAdminPanel();
  if (id === 'settings') renderProfileSettings();
  renderDesktopSidebar(id);
  updateDesktopHero(id);
}
function goDetailPage(pageId, title, fromPage) {
  prevPage = fromPage || currentPage;
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.menu-btn').forEach(function(b){ b.classList.remove('active'); });
  document.getElementById('page-' + pageId).classList.add('active');
  document.getElementById('pageTitle') && (document.getElementById('pageTitle').textContent = title);
  document.querySelectorAll('.nav-tab').forEach(function(t){ t.classList.remove('active'); });
  currentPage = pageId;
  var btnBack = document.getElementById('btnBack');
  var btnMenu = document.getElementById('btnMenu');
  if (btnMenu) btnMenu.classList.add('hidden');
  if (btnBack) { btnBack.classList.remove('hidden'); btnBack.classList.add('flex'); }
  closeMenu();
  window.scrollTo(0, 0);
  renderDesktopSidebar(pageId);
  updateDesktopHero(pageId);
}
function goBack() {
  goPage(prevPage || 'home');
}

// ============================================================
// 데스크톱 2컬럼 — 사이드바 렌더링 + 히어로 처리
// ============================================================
function _isDesktop() { return window.innerWidth >= 1024; }

function updateDesktopHero(pageId) {
  var heroSlot = document.getElementById('homeHeroFull');
  var homeHero = document.querySelector('#page-home > .relative.overflow-hidden');
  if (!heroSlot || !homeHero) return;
  if (pageId === 'home' && _isDesktop()) {
    // Clone hero into full-width slot, hide original
    heroSlot.innerHTML = homeHero.outerHTML;
    heroSlot.style.display = '';
    homeHero.style.display = 'none';
    // Re-bind banner dots in clone
    var cloneDot0 = heroSlot.querySelector('#bannerDot0');
    var cloneDot1 = heroSlot.querySelector('#bannerDot1');
    if (cloneDot0) cloneDot0.setAttribute('onclick', 'setBannerSlide(0)');
    if (cloneDot1) cloneDot1.setAttribute('onclick', 'setBannerSlide(1)');
    // Make banner track work on clone
    var cloneTrack = heroSlot.querySelector('#homeBannerTrack');
    if (cloneTrack) cloneTrack.id = 'homeBannerTrackDesktop';
    // Override setBannerSlide to update both
    var origSetBanner = setBannerSlide;
    window._desktopHeroActive = true;
  } else {
    heroSlot.style.display = 'none';
    heroSlot.innerHTML = '';
    if (homeHero) homeHero.style.display = '';
    window._desktopHeroActive = false;
  }
}

function renderDesktopSidebar(pageId) {
  var sb = document.getElementById('desktopSidebar');
  if (!sb) return;
  if (!_isDesktop()) { sb.innerHTML = ''; return; }
  var html = '';

  // ── LINE friend banner (all pages) ──
  var lineHtml = '<a href="https://line.me/R/ti/p/@452fshii" target="_blank" rel="noopener" class="sidebar-card block" style="background:#06C755;padding:14px 16px">' +
    '<div class="flex items-center gap-3">' +
      '<svg viewBox="0 0 24 24" class="w-7 h-7 shrink-0" fill="#fff"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>' +
      '<div><p style="color:#fff;font-weight:900;font-size:13px">' + t('line_add_friend') + '</p>' +
      '<p style="color:rgba(255,255,255,.75);font-size:10px;font-weight:600">' + t('line_add_desc') + '</p></div>' +
    '</div></a>';

  // ── Ad slots ──
  var adHtml = '<div class="sidebar-card" id="sidebarAdSlot"></div>';

  // ── Page-specific content ──
  if (pageId === 'home' || pageId === 'shop' || pageId === 'shop-items' || pageId === 'shop-product') {
    // Popular products
    html += '<div class="sidebar-card"><h4>' + t('sb_popular_products') + '</h4>';
    html += _sidebarPopularProducts();
    html += '</div>';
    html += lineHtml;
    // Upcoming events
    html += '<div class="sidebar-card"><h4>' + t('sb_upcoming_events') + '</h4>';
    html += _sidebarUpcomingEvents();
    html += '</div>';
    html += adHtml;

  } else if (pageId === 'forum' || pageId === 'forum-detail') {
    // Latest posts
    html += '<div class="sidebar-card"><h4>' + t('sb_latest_posts') + '</h4>';
    html += _sidebarLatestPosts();
    html += '</div>';
    html += lineHtml;
    html += adHtml;

  } else if (pageId === 'webzine' || pageId === 'webzine-detail') {
    html += '<div class="sidebar-card"><h4>' + t('sb_popular_products') + '</h4>';
    html += _sidebarPopularProducts();
    html += '</div>';
    html += lineHtml;
    html += adHtml;

  } else if (pageId === 'jobs' || pageId === 'job-detail') {
    html += '<div class="sidebar-card"><h4>' + t('sb_latest_posts') + '</h4>';
    html += _sidebarLatestPosts();
    html += '</div>';
    html += lineHtml;
    html += adHtml;

  } else if (pageId === 'events' || pageId === 'event-detail') {
    html += '<div class="sidebar-card"><h4>' + t('sb_popular_products') + '</h4>';
    html += _sidebarPopularProducts();
    html += '</div>';
    html += lineHtml;

  } else {
    // Default: settings, custom, used, myactivity, etc.
    html += lineHtml;
    html += '<div class="sidebar-card"><h4>' + t('sb_upcoming_events') + '</h4>';
    html += _sidebarUpcomingEvents();
    html += '</div>';
    html += '<div class="sidebar-card"><h4>' + t('sb_popular_products') + '</h4>';
    html += _sidebarPopularProducts();
    html += '</div>';
  }

  sb.innerHTML = html;
}

function _sidebarPopularProducts() {
  if (typeof SHOP_CATEGORIES === 'undefined' || !SHOP_CATEGORIES.length) return '<p class="text-xs text-slate-300 font-bold">' + t('sb_no_data') + '</p>';
  return SHOP_CATEGORIES.slice(0, 3).map(function(cat, i) {
    return '<div class="sidebar-mini-item" onclick="goShopSub(\'' + cat.id + '\')">' +
      '<span class="smi-rank">' + (i + 1) + '</span>' +
      '<div style="min-width:0;flex:1"><p class="smi-title">' + cat.name + '</p><p class="smi-sub">' + cat.desc + '</p></div>' +
    '</div>';
  }).join('');
}

function _sidebarUpcomingEvents() {
  var evts = (typeof events_ !== 'undefined' ? events_ : []).slice(0, 3);
  if (!evts.length) return '<p class="text-xs text-slate-300 font-bold">' + t('sb_no_data') + '</p>';
  return evts.map(function(ev) {
    return '<div class="sidebar-mini-item" onclick="openEventDetail(' + ev.id + ')">' +
      '<span class="smi-rank">📅</span>' +
      '<div style="min-width:0;flex:1"><p class="smi-title">' + escHtml(ev.event || ev.title || '') + '</p><p class="smi-sub">' + (ev.date || '') + '</p></div>' +
    '</div>';
  }).join('');
}

function _sidebarLatestPosts() {
  var p = (typeof posts !== 'undefined' ? posts : []).slice(0, 4);
  if (!p.length) return '<p class="text-xs text-slate-300 font-bold">' + t('sb_no_data') + '</p>';
  return p.map(function(post) {
    return '<div class="sidebar-mini-item" onclick="openForumDetail(' + post.id + ')">' +
      '<span class="smi-rank">💬</span>' +
      '<div style="min-width:0;flex:1"><p class="smi-title">' + escHtml(post.title) + '</p><p class="smi-sub">' + (post.author || '') + ' · ' + (post.date || '') + '</p></div>' +
    '</div>';
  }).join('');
}

// Re-render sidebar on window resize crossing the 1024px breakpoint
var _prevIsDesktop = false;
window.addEventListener('resize', function() {
  var nowDesktop = _isDesktop();
  if (nowDesktop !== _prevIsDesktop) {
    _prevIsDesktop = nowDesktop;
    renderDesktopSidebar(currentPage);
    updateDesktopHero(currentPage);
  }
});

// ============================================================
// 닉네임 표시 & 프로필
// ============================================================
function updateNicknameDisplays() {
  var nick = currentUser.nickname || '';
  var pnd  = document.getElementById('postNicknameDisplay');
  var cnd  = document.getElementById('commentNicknameDisplay');
  var sn   = document.getElementById('sideNickname');
  if (pnd) pnd.textContent = nick;
  if (cnd) cnd.textContent = nick;
  if (sn)  sn.textContent  = nick;
}
function renderProfileSettings() {
  // 상단 프로필 카드 채우기
  var nickEl    = document.getElementById('settingsNickname');
  var licEl     = document.getElementById('settingsLicense');
  var clinicEl  = document.getElementById('settingsClinic');
  if (nickEl)   nickEl.textContent   = isLoggedIn() && currentUser.nickname   ? currentUser.nickname   : t('profile_login_msg');
  if (licEl)    licEl.textContent    = isLoggedIn() && currentUser.licenseNum ? '# ' + currentUser.licenseNum : '-';
  if (clinicEl) clinicEl.textContent = isLoggedIn() && currentUser.clinicName ? currentUser.clinicName  : '-';
  // 나의 주문 목록 요약
  var summaryEl = document.getElementById('settingsOrdersSummary');
  if (summaryEl) {
    if (!isLoggedIn()) {
      summaryEl.innerHTML = '<p class="text-sm text-slate-400 font-bold">' + t('profile_login_msg') + '</p>';
    } else {
      var myOrders = customOrders.filter(function(o){ return o.userNickname === currentUser.nickname; }).slice(0, 5);
      if (!myOrders.length) {
        summaryEl.innerHTML = '<p class="text-sm text-slate-400 font-bold">' + t('settings_no_orders') + '</p>';
      } else {
        var stageColors = {submitted:'bg-slate-100 text-slate-500',confirmed:'bg-blue-100 text-blue-600',design_ready:'bg-purple-100 text-purple-600',milling:'bg-yellow-100 text-yellow-700',shipped:'bg-green-100 text-green-700',done:'bg-emerald-100 text-emerald-700'};
        summaryEl.innerHTML = myOrders.map(function(o) {
          var stageKey = 'stage_' + (o.stage||'submitted');
          var stageLabel = t(stageKey) || o.stage || '-';
          var stageColor = stageColors[o.stage||'submitted'] || 'bg-slate-100 text-slate-500';
          var casesStr = (o.cases||[]).length + t('cases_unit') + ' · ' + ((o.cases||[]).reduce(function(a,c){ return a + (c.teeth||[]).length; }, 0)) + t('teeth_count');
          return '<div class="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">' +
            '<div>' +
              '<p class="text-xs font-black text-slate-700"># ' + o.id + '</p>' +
              '<p class="text-[10px] text-slate-400 font-bold mt-0.5">' + casesStr + '</p>' +
            '</div>' +
            '<span class="text-[10px] font-black px-2 py-1 rounded-full ' + stageColor + '">' + stageLabel + '</span>' +
          '</div>';
        }).join('');
      }
    }
  }
  // 내가 쓴 게시물
  var myPostsEl = document.getElementById('settingsMyPosts');
  if (myPostsEl) {
    if (!isLoggedIn()) {
      myPostsEl.innerHTML = '<p class="text-sm text-slate-400 font-bold">' + t('profile_login_msg') + '</p>';
    } else {
      var myPosts = posts.filter(function(p){ return p.author === currentUser.nickname; }).slice(0, 5);
      if (!myPosts.length) {
        myPostsEl.innerHTML = '<p class="text-sm text-slate-400 font-bold">작성한 게시물이 없습니다.</p>';
      } else {
        myPostsEl.innerHTML = myPosts.map(function(p) {
          return '<div class="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 cursor-pointer active:bg-slate-50" onclick="openForumDetail(' + p.id + ')">' +
            '<div class="flex-1 min-w-0 pr-2">' +
              '<p class="text-xs font-black text-slate-700 truncate">' + p.title + '</p>' +
              '<p class="text-[10px] text-slate-400 font-bold mt-0.5">' + (p.date||'') + ' · 💬 ' + (p.comments||[]).length + '</p>' +
            '</div>' +
            '<span class="text-slate-300 text-sm font-black shrink-0">›</span>' +
          '</div>';
        }).join('');
      }
    }
  }
  // 내 중고물품
  var myUsedEl = document.getElementById('settingsMyUsed');
  if (myUsedEl) {
    if (!isLoggedIn()) {
      myUsedEl.innerHTML = '<p class="col-span-3 text-sm text-slate-400 font-bold">' + t('profile_login_msg') + '</p>';
    } else {
      var myUsed = usedItems.filter(function(u){ return u.seller === 'Me' || u.seller === currentUser.nickname; }).slice(0, 6);
      if (!myUsed.length) {
        myUsedEl.innerHTML = '<p class="col-span-3 text-sm text-slate-400 font-bold">등록한 중고물품이 없습니다.</p>';
      } else {
        myUsedEl.innerHTML = myUsed.map(function(u) {
          var thumb = u.image
            ? '<img src="' + u.image + '" class="w-full h-full object-cover" loading="lazy">'
            : '<div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300"><span class="text-xl">📷</span></div>';
          return '<div class="bg-slate-50 rounded-xl overflow-hidden cursor-pointer active:scale-[.97] transition" onclick="openUsedDetail(' + u.id + ')">' +
            '<div class="aspect-square overflow-hidden">' + thumb + '</div>' +
            '<div class="p-1.5">' +
              '<p class="text-[9px] font-black text-slate-700 truncate">' + u.name + '</p>' +
              '<p class="text-[9px] font-black text-blue-700 font-mono">฿' + u.price.toLocaleString() + '</p>' +
            '</div>' +
          '</div>';
        }).join('');
      }
    }
  }
}
function toggleProfileEditInline() {
  var form = document.getElementById('settingsProfileEditForm');
  if (!form) return;
  if (form.classList.contains('hidden')) {
    if (!isLoggedIn()) { openLoginModal(); return; }
    document.getElementById('si-email').value   = currentUser.email       || '';
    document.getElementById('si-phone').value   = currentUser.phone       || '';
    document.getElementById('si-address').value = currentUser.address     || '';
    document.getElementById('si-clinic').value  = currentUser.clinicName  || '';
    form.classList.remove('hidden');
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    form.classList.add('hidden');
  }
}
async function saveProfileInline() {
  if (!isLoggedIn()) return;
  currentUser.email      = document.getElementById('si-email').value.trim();
  currentUser.phone      = document.getElementById('si-phone').value.trim();
  currentUser.address    = document.getElementById('si-address').value.trim();
  currentUser.clinicName = document.getElementById('si-clinic').value.trim();
  var saved = localStorage.getItem('dentalk_profile_' + currentUser.licenseNum);
  var profile = saved ? JSON.parse(saved) : {};
  profile.email      = currentUser.email;
  profile.phone      = currentUser.phone;
  profile.address    = currentUser.address;
  profile.clinicName = currentUser.clinicName;
  localStorage.setItem('dentalk_profile_' + currentUser.licenseNum, JSON.stringify(profile));
  try {
    await authUpdateProfile(currentUser.licenseNum, { email: currentUser.email, phone: currentUser.phone, address: currentUser.address, clinic_name: currentUser.clinicName });
  } catch(e) { handleSupabaseError(e, 'Profile Update'); }
  var msg = document.getElementById('profileSavedMsg');
  if (msg) { msg.classList.remove('hidden'); setTimeout(function(){ msg.classList.add('hidden'); }, 2500); }
  renderProfileSettings();
  // 잠시 후 폼 닫기
  setTimeout(function(){ toggleProfileEditInline(); }, 1500);
}
function openProfileEdit() {
  if (!isLoggedIn()) { showToast(t('login_required'), 'warning'); return; }
  document.getElementById('pe-email').value   = currentUser.email   || '';
  document.getElementById('pe-phone').value   = currentUser.phone   || '';
  document.getElementById('pe-address').value = currentUser.address || '';
  document.getElementById('pe-clinic').value  = currentUser.clinicName || '';
  openModal('profileEditModal');
}
async function saveProfile() {
  currentUser.email     = document.getElementById('pe-email').value.trim();
  currentUser.phone     = document.getElementById('pe-phone').value.trim();
  currentUser.address   = document.getElementById('pe-address').value.trim();
  currentUser.clinicName= document.getElementById('pe-clinic').value.trim();
  // localStorage에 반영
  var saved = localStorage.getItem('dentalk_profile_' + currentUser.licenseNum);
  var profile = saved ? JSON.parse(saved) : {};
  profile.email     = currentUser.email;
  profile.phone     = currentUser.phone;
  profile.address   = currentUser.address;
  profile.clinicName= currentUser.clinicName;
  localStorage.setItem('dentalk_profile_' + currentUser.licenseNum, JSON.stringify(profile));
  // Supabase에 PATCH
  try {
    await authUpdateProfile(currentUser.licenseNum, { email: currentUser.email, phone: currentUser.phone, address: currentUser.address, clinic_name: currentUser.clinicName });
  } catch(e) { handleSupabaseError(e, 'Profile Update Modal'); }
  closeModal('profileEditModal');
  renderProfileSettings();
  var msg = document.getElementById('profileSavedMsg');
  if (msg) { msg.classList.remove('hidden'); setTimeout(function(){ msg.classList.add('hidden'); }, 2500); }
}
// ============================================================
// 쪽지 & 내 활동 모달
// ============================================================
function openMyActivity() {
  if (!isLoggedIn()) { openLoginModal(); return; }
  messages.forEach(function(m){ if (m.to===currentUser.nickname) m.read=true; });
  goDetailPage('myactivity', t('nav_myactivity'), currentPage);
  myActivityTab('msg');
}
function activityTab(name) { myActivityTab(name); }
function myActivityTab(name) {
  ['msg','posts','orders','used'].forEach(function(tab){
    var btn  = document.getElementById('matab-'+tab);
    var pane = document.getElementById('ma-'+tab);
    if (btn)  btn.className  = 'flex-1 py-2.5 rounded-xl font-black text-xs ' + (tab===name?'bg-[#001d4a] text-white':'bg-slate-100 text-slate-500');
    if (pane) pane.classList.toggle('hidden', tab!==name);
  });
  if (name==='msg')    renderMyMsgs2();
  if (name==='posts')  renderMyPosts2();
  if (name==='orders') renderMyOrders2();
  if (name==='used')   renderMyUsed2();
}
function renderMyMsgs2() {
  var el = document.getElementById('ma-msg');
  if (!el) return;
  var nick  = currentUser.nickname;
  var inbox = messages.filter(function(m){ return m.to===nick; });
  var sent  = messages.filter(function(m){ return m.from===nick; });
  var html = '<button onclick="openCompose()" class="w-full py-3 bg-[#001d4a] text-white rounded-xl font-black text-sm mb-4 active:scale-95 transition">' + t('ma_compose') + '</button>';
  html += '<p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">' + t('ma_inbox') + ' (' + inbox.length + ')</p>';
  if (inbox.length) {
    html += inbox.slice().reverse().map(function(m){
      return '<div class="bg-white rounded-xl p-3.5 mb-2 shadow-sm border-l-4 ' + (m.read?'border-slate-100':'border-blue-500') + '">' +
        '<div class="flex justify-between items-center mb-1"><span class="text-xs font-black text-slate-700">' + escHtml(m.from) + '</span><span class="text-[10px] text-slate-400">' + m.date + '</span></div>' +
        '<p class="text-xs font-bold text-slate-600 mb-1">' + escHtml(m.subject) + '</p>' +
        '<p class="text-[11px] text-slate-500 leading-relaxed">' + escHtml(m.body) + '</p>' +
        '<button onclick="openCompose(\'' + escHtml(m.from) + '\')" class="mt-2 text-[10px] text-blue-500 font-black min-h-[36px]">' + t('ma_reply') + '</button>' +
      '</div>';
    }).join('');
  } else {
    html += '<p class="text-sm text-slate-300 font-bold py-6 text-center">' + t('ma_no_inbox') + '</p>';
  }
  html += '<p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-4">' + t('ma_sent') + ' (' + sent.length + ')</p>';
  if (sent.length) {
    html += sent.slice().reverse().map(function(m){
      return '<div class="bg-slate-50 rounded-xl p-3 mb-2">' +
        '<div class="flex justify-between items-center mb-1"><span class="text-xs font-bold text-slate-600">' + t('ma_to') + ' ' + escHtml(m.to) + '</span><span class="text-[10px] text-slate-400">' + m.date + '</span></div>' +
        '<p class="text-xs font-bold text-slate-500">' + escHtml(m.subject) + '</p>' +
      '</div>';
    }).join('');
  } else {
    html += '<p class="text-sm text-slate-300 font-bold py-3 text-center">' + t('ma_no_sent') + '</p>';
  }
  el.innerHTML = html;
}
function renderMyPosts2() {
  var el = document.getElementById('ma-posts');
  if (!el) return;
  var nick = currentUser.nickname;
  var myPosts = posts.filter(function(p){ return p.author===nick; });
  if (!myPosts.length) { el.innerHTML='<p class="text-sm text-slate-300 font-bold text-center py-10">' + t('ma_no_posts') + '</p>'; return; }
  el.innerHTML = myPosts.map(function(p){
    return '<div class="bg-white rounded-xl p-3.5 mb-2 shadow-sm cursor-pointer active:bg-slate-50" onclick="openForumDetail(' + p.id + ')">' +
      '<p class="text-xs font-black text-slate-700 mb-1">' + escHtml(p.title) + '</p>' +
      '<p class="text-[10px] text-slate-400 font-bold">' + (p.date||'') + ' · 💬 ' + (p.comments||[]).length + '</p>' +
    '</div>';
  }).join('');
}
function renderMyOrders2() {
  var el = document.getElementById('ma-orders');
  if (!el) return;
  var myOrders = customOrders.filter(function(o){ return o.userNickname === currentUser.nickname; });
  if (!myOrders.length) { el.innerHTML='<p class="text-sm text-slate-300 font-bold text-center py-10">' + t('ma_no_orders') + '</p>'; return; }
  var stageColors = {submitted:'bg-slate-100 text-slate-500',confirmed:'bg-blue-100 text-blue-600',design_ready:'bg-purple-100 text-purple-600',milling:'bg-yellow-100 text-yellow-700',shipped:'bg-green-100 text-green-700',done:'bg-emerald-100 text-emerald-700'};
  el.innerHTML = myOrders.map(function(o) {
    var stageLabel = t('stage_' + (o.stage||'submitted')) || o.stage || '-';
    var stageColor = stageColors[o.stage||'submitted'] || 'bg-slate-100 text-slate-500';
    var casesStr = (o.cases||[]).length + t('cases_unit') + ' · ' + ((o.cases||[]).reduce(function(a,c){ return a + (c.teeth||[]).length; }, 0)) + t('teeth_count');
    return '<div class="bg-white rounded-xl p-3.5 mb-2 shadow-sm flex items-center justify-between">' +
      '<div><p class="text-xs font-black text-slate-700"># ' + o.id + '</p><p class="text-[10px] text-slate-400 font-bold mt-0.5">' + casesStr + '</p></div>' +
      '<span class="text-[10px] font-black px-2.5 py-1 rounded-full ' + stageColor + '">' + stageLabel + '</span>' +
    '</div>';
  }).join('');
}
function renderMyUsed2() {
  var el = document.getElementById('ma-used');
  if (!el) return;
  var nick = currentUser.nickname;
  var myUsed = usedItems.filter(function(u){ return u.seller===nick || u.seller==='Me'; });
  if (!myUsed.length) { el.innerHTML='<p class="text-sm text-slate-300 font-bold text-center py-10">' + t('ma_no_used') + '</p>'; return; }
  el.innerHTML = '<div class="grid grid-cols-2 gap-2.5">' + myUsed.map(function(u){
    var thumb = u.image
      ? '<img src="' + u.image + '" class="w-full h-full object-cover" loading="lazy">'
      : '<div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300"><span class="text-2xl">📷</span></div>';
    return '<div class="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer active:scale-[.97] transition" onclick="openUsedDetail(' + u.id + ')">' +
      '<div class="aspect-square overflow-hidden">' + thumb + '</div>' +
      '<div class="p-2"><p class="text-[10px] font-black text-slate-700 truncate">' + escHtml(u.name) + '</p><p class="text-[10px] font-black text-blue-700 font-mono">฿' + u.price.toLocaleString() + '</p></div>' +
    '</div>';
  }).join('') + '</div>';
}
function renderMyMsgs() {
  var el = document.getElementById('activity-msg');
  if (!el) return;
  var nick  = currentUser.nickname;
  var inbox = messages.filter(function(m){ return m.to===nick; });
  var sent  = messages.filter(function(m){ return m.from===nick; });
  var html = '<button onclick="openCompose()" class="w-full py-2.5 bg-[#001d4a] text-white rounded-xl font-black text-xs mb-4 active:scale-95 transition">✉️ 새 쪽지 보내기</button>';
  html += '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">받은 쪽지 (' + inbox.length + ')</p>';
  if (inbox.length) {
    html += inbox.slice().reverse().map(function(m){
      return '<div class="bg-white rounded-xl p-3 mb-2 shadow-sm border-l-4 ' + (m.read?'border-slate-100':'border-blue-500') + '">' +
        '<div class="flex justify-between items-center mb-1">' +
          '<span class="text-xs font-black text-slate-700">' + m.from + '</span>' +
          '<span class="text-[9px] text-slate-400">' + m.date + '</span>' +
        '</div>' +
        '<p class="text-xs font-bold text-slate-600 mb-1">' + m.subject + '</p>' +
        '<p class="text-[10px] text-slate-500 leading-relaxed">' + m.body + '</p>' +
        '<button onclick="openCompose(\'' + m.from + '\')" class="mt-2 text-[9px] text-blue-500 font-black">← 답장</button>' +
      '</div>';
    }).join('');
  } else {
    html += '<p class="text-[10px] text-slate-300 font-bold py-3 text-center">받은 쪽지가 없습니다.</p>';
  }
  html += '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-4">보낸 쪽지 (' + sent.length + ')</p>';
  if (sent.length) {
    html += sent.slice().reverse().map(function(m){
      return '<div class="bg-slate-50 rounded-xl p-3 mb-2">' +
        '<div class="flex justify-between items-center mb-1">' +
          '<span class="text-xs font-bold text-slate-600">→ ' + m.to + '</span>' +
          '<span class="text-[9px] text-slate-400">' + m.date + '</span>' +
        '</div>' +
        '<p class="text-xs font-bold text-slate-500">' + m.subject + '</p>' +
        '<p class="text-[10px] text-slate-400">' + m.body + '</p>' +
      '</div>';
    }).join('');
  } else {
    html += '<p class="text-[10px] text-slate-300 font-bold py-3 text-center">보낸 쪽지가 없습니다.</p>';
  }
  el.innerHTML = html;
}
function renderMyPosts() {
  var el = document.getElementById('activity-posts');
  if (!el) return;
  var nick = currentUser.nickname;
  var items = [];
  usedItems.filter(function(x){ return x.seller===nick||x.seller==='Me'; }).forEach(function(x){
    items.push({ type:'중고마켓', icon:'♻️', title:x.name, sub:x.price.toLocaleString()+' THB', date:x.date });
  });
  posts.filter(function(p){ return p.author===nick; }).forEach(function(p){
    items.push({ type:'임상토론방', icon:'💬', title:p.title, sub:p.category==='implant'?'🦷 임플란트':'💎 보철', date:p.date||'' });
  });
  customOrders.forEach(function(o){
    items.push({ type:'CNC Custom', icon:'⚙️', title:o.clinic+' · '+o.id, sub:t('stage_'+o.stage)||o.stage, date:o.date });
  });
  items.sort(function(a,b){ return b.date>a.date?1:b.date<a.date?-1:0; });
  if (!items.length) { el.innerHTML='<p class="text-sm text-slate-300 font-bold text-center py-10">게시물이 없습니다.</p>'; return; }
  el.innerHTML = items.map(function(item){
    return '<div class="bg-white rounded-xl p-3 mb-2 shadow-sm">' +
      '<div class="flex justify-between items-start mb-1">' +
        '<span class="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">' + item.icon + ' ' + item.type + '</span>' +
        '<span class="text-[9px] text-slate-400">' + item.date + '</span>' +
      '</div>' +
      '<p class="text-xs font-black text-slate-700 leading-snug mt-1">' + item.title + '</p>' +
      '<p class="text-[9px] text-slate-400 mt-0.5">' + item.sub + '</p>' +
    '</div>';
  }).join('');
}
function openCompose(toNick) {
  if (!isLoggedIn()) return;
  document.getElementById('compose-to').value   = toNick || '';
  document.getElementById('compose-subj').value = '';
  document.getElementById('compose-body').value = '';
  openModal('composeModal');
}
function sendMsg() {
  var to      = document.getElementById('compose-to').value.trim();
  var subject = document.getElementById('compose-subj').value.trim();
  var body    = document.getElementById('compose-body').value.trim();
  if (!to||!subject||!body) { showToast('받는 사람, 제목, 내용을 모두 입력해주세요.', 'warning'); return; }
  messages.push({ id:Date.now(), from:currentUser.nickname, to:to, subject:subject, body:body, date:new Date().toLocaleDateString(), read:false });
  closeModal('composeModal');
  renderMyMsgs();
  showToast('쪽지를 보냈습니다!', 'success');
}

// ============================================================
// SETTINGS - 언어 선택 (저장 전까지 pendingLang에 보관)
// ============================================================
function selectLang(lang) {
  pendingLang = lang;
  ['en','ko','zh','th','vi','es'].forEach(function(l){
    var b = document.getElementById('lang-'+l);
    if (!b) return;
    b.className = l===lang
      ? 'py-3 rounded-2xl font-black text-xs border-2 border-amber-500 bg-amber-50 text-amber-700 flex flex-col items-center gap-1'
      : 'py-3 rounded-2xl font-black text-xs border-2 border-transparent bg-slate-50 text-slate-600 flex flex-col items-center gap-1';
  });
  // 현재 저장된 언어 버튼은 파란색으로 유지
  var saved = document.getElementById('lang-'+currentLang);
  if (saved && lang !== currentLang) {
    // pending 선택은 amber, 저장된 언어는 일반 표시
  }
  var pendingNote = document.getElementById('langPendingNote');
  if (pendingNote) pendingNote.classList.remove('hidden');
  var savedMsg = document.getElementById('savedMsg');
  if (savedMsg) savedMsg.classList.add('hidden');
}
function saveLang() {
  if (!pendingLang) return;
  currentLang = pendingLang;
  pendingLang = null;
  localStorage.setItem('dentalk_lang', currentLang);
  // 저장된 언어 버튼 스타일 업데이트
  ['en','ko','zh','th','vi','es'].forEach(function(l){
    var b = document.getElementById('lang-'+l);
    if (!b) return;
    b.className = l===currentLang
      ? 'py-3 rounded-2xl font-black text-xs border-2 border-blue-600 bg-blue-50 text-blue-700 flex flex-col items-center gap-1'
      : 'py-3 rounded-2xl font-black text-xs border-2 border-transparent bg-slate-50 text-slate-600 flex flex-col items-center gap-1';
  });
  var pendingNote = document.getElementById('langPendingNote');
  if (pendingNote) pendingNote.classList.add('hidden');
  applyLang();
  var savedMsg = document.getElementById('savedMsg');
  if (savedMsg) {
    savedMsg.classList.remove('hidden');
    setTimeout(function(){ savedMsg.classList.add('hidden'); }, 2000);
  }
}
// ============================================================
// applyLang - 모든 UI 텍스트 업데이트
// ============================================================
function applyLang() {
  // html lang 속성 업데이트 → CSS :lang(th) 폰트 규칙 자동 적용
  document.documentElement.lang = currentLang;
  // data-i18n 속성 요소 업데이트
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    el.textContent = t(el.dataset.i18n);
  });
  // data-i18n-ph 속성 요소 (placeholder) 업데이트
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
    el.placeholder = t(el.dataset.i18nPh);
  });
  // 중고마켓 상태 셀렉트 옵션 업데이트
  var condSel = document.getElementById('u-cond');
  if (condSel && condSel.options.length >= 3) {
    condSel.options[0].text = t('cond_new');
    condSel.options[1].text = t('cond_good');
    condSel.options[2].text = t('cond_fair');
  }
  // 페이지 타이틀 업데이트
  var ptEl = document.getElementById('pageTitle');
  if (ptEl) ptEl.textContent = t('pt_' + currentPage);
  // 커스텀 탭 버튼 텍스트 업데이트
  var fBtn = document.getElementById('ctab-form');
  var lBtn = document.getElementById('ctab-list');
  var dBtn2 = document.getElementById('ctab-done');
  if (fBtn) fBtn.textContent = t('custom_tab_new');
  if (lBtn) lBtn.textContent = t('custom_tab_list');
  if (dBtn2) dBtn2.textContent = t('custom_tab_done');
  // 사이드 로그인 버튼
  var sideLoginTxt = document.getElementById('sideLoginTxt');
  if (sideLoginTxt) sideLoginTxt.textContent = t('side_login_btn');
  // 모든 페이지 동적 콘텐츠 재렌더링 (언어 변경 시 전체 반영)
  renderHomePage();
  renderShop();
  renderUsed();
  renderForum();
  renderEvents();
  renderCustomOrders();
  renderProfileSettings();
  // 설정 저장 버튼 텍스트
  var saveBtn = document.getElementById('saveLangBtn');
  if (saveBtn) saveBtn.textContent = t('settings_save_btn');
  // 저장된 언어 버튼 스타일 반영
  ['en','ko','zh','th','vi','es'].forEach(function(l){
    var b = document.getElementById('lang-'+l);
    if (!b) return;
    b.className = l===currentLang
      ? 'py-3 rounded-2xl font-black text-xs border-2 border-blue-600 bg-blue-50 text-blue-700 flex flex-col items-center gap-1'
      : 'py-3 rounded-2xl font-black text-xs border-2 border-transparent bg-slate-50 text-slate-600 flex flex-col items-center gap-1';
  });
}
// ============================================================
// 모달 유틸
// ============================================================
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ============================================================
// HOME PAGE — banner + categories + forum/events preview
// ============================================================
var _bannerSlide = 0, _bannerInterval = null;

function setBannerSlide(idx) {
  _bannerSlide = idx;
  var track = document.getElementById('homeBannerTrack');
  var trackD = document.getElementById('homeBannerTrackDesktop');
  if (track) track.style.transform = 'translateX(-' + (idx * 100) + '%)';
  if (trackD) trackD.style.transform = 'translateX(-' + (idx * 100) + '%)';
  [0, 1].forEach(function(i) {
    var dot = document.getElementById('bannerDot' + i);
    if (!dot) return;
    if (i === idx) {
      dot.style.width = '8px'; dot.style.height = '8px'; dot.style.background = 'rgba(255,255,255,0.95)';
    } else {
      dot.style.width = '6px'; dot.style.height = '6px'; dot.style.background = 'rgba(255,255,255,0.3)';
    }
  });
}

function initHomeBanner() {
  setBannerSlide(0);
  if (_bannerInterval) clearInterval(_bannerInterval);
  _bannerInterval = setInterval(function() {
    setBannerSlide((_bannerSlide + 1) % 2);
  }, 4500);
}

function renderHomeCategories() {
  var el = document.getElementById('homeCategories');
  if (!el) return;
  var catDescKeys = {
    'scan-body':  'cat_scan_body_desc',
    'q-base':     'cat_q_base_desc',
    'ready-made': 'cat_ready_made_desc',
    'ti-base':    'cat_ti_base_desc',
    'pre-milled': 'cat_pre_milled_desc',
    'multi-unit': 'cat_multi_unit_desc',
    '3d-analog':  'cat_3d_analog_desc'
  };
  el.innerHTML = SHOP_CATEGORIES.map(function(cat) {
    return '<button onclick="openShopCategory(\'' + cat.id + '\')" ' +
      'class="relative overflow-hidden rounded-2xl bg-gradient-to-br ' + cat.color + ' p-4 shadow-sm text-left active:scale-[.97] transition">' +
      '<div class="absolute -bottom-3 -right-3 w-20 h-20 opacity-[0.12]">' + (cat.svg || '') + '</div>' +
      '<div class="relative">' +
        '<div class="w-10 h-10 mb-2 opacity-90">' + (cat.svg || '') + '</div>' +
        '<p class="font-black text-white text-sm leading-snug">' + cat.name + '</p>' +
        '<p class="text-[10px] font-medium mt-0.5 leading-snug" style="color:rgba(255,255,255,0.75)">' + t(catDescKeys[cat.id] || '') + '</p>' +
      '</div>' +
    '</button>';
  }).join('');
}

function renderHomeForumPreview() {
  var el = document.getElementById('homeForumPreview');
  if (!el) return;
  var recent = posts.slice().sort(function(a, b) { return b.id - a.id; }).slice(0, 3);
  if (!recent.length) {
    el.innerHTML = '<p class="text-center text-slate-400 text-xs py-6 font-medium">' + t('home_forum_empty') + '</p>';
    return;
  }
  el.innerHTML = recent.map(function(p) {
    var emoji = p.category === 'prosthetic' ? '💎' : '🦷';
    var commentCount = p.comments ? p.comments.length : 0;
    return '<div onclick="openForumDetail(' + p.id + ')" ' +
      'class="bg-white rounded-2xl px-4 py-3.5 mb-2 shadow-sm border border-slate-100 cursor-pointer active:bg-slate-50 transition flex items-start gap-2.5">' +
      '<span class="text-base shrink-0 mt-0.5">' + emoji + '</span>' +
      '<div class="flex-1 min-w-0">' +
        '<p class="font-black text-slate-800 text-xs leading-snug line-clamp-1">' + p.title + '</p>' +
        '<p class="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1">' + p.body + '</p>' +
        '<p class="text-[9px] text-slate-300 font-medium mt-1.5">' + p.author + ' · ' + (p.date || '') + ' · 💬 ' + commentCount + '</p>' +
      '</div>' +
      '<span class="text-slate-300 text-sm shrink-0 mt-0.5">›</span>' +
    '</div>';
  }).join('');
}

function renderHomeEventsPreview() {
  var el = document.getElementById('homeEventsPreview');
  if (!el) return;
  var upcoming = events_.slice(0, 2);
  if (!upcoming.length) {
    el.innerHTML = '<p class="text-center text-slate-400 text-xs py-6 font-medium">' + t('home_events_empty') + '</p>';
    return;
  }
  el.innerHTML = upcoming.map(function(e) {
    return '<div class="bg-white rounded-2xl px-4 py-3.5 mb-2 shadow-sm flex items-start gap-3 border border-slate-100" ' +
      'style="border-left:4px solid var(--color-primary-dark)">' +
      '<div class="flex-1 min-w-0">' +
        '<p class="text-[9px] font-bold text-slate-400 font-mono uppercase mb-0.5">' + e.date + '</p>' +
        '<p class="font-black text-slate-800 text-xs leading-snug">' + e.event + '</p>' +
        '<p class="text-[10px] text-slate-400 mt-1">📍 ' + e.loc + '</p>' +
      '</div>' +
    '</div>';
  }).join('');
}

function renderHomePage() {
  renderHomeCategories();
  renderHomeForumPreview();
  renderHomeEventsPreview();
  renderHomeWebzinePreview();
}
// ============================================================
// Supabase 공개 데이터 초기화 (로그인 불필요)
// ============================================================
async function initSupabasePublicData() {
  // ── Used Items ─────────────────────────────────────────────
  try {
    var sbUsed = await sbGetUsedItems();
    if (sbUsed && sbUsed.length) {
      usedItems = sbUsed.map(function(r) {
        return {
          id:      r.id,
          name:    r.name,
          code:    r.code    || '-',
          price:   parseFloat(r.price) || 0,
          cond:    r.condition || 'good',
          desc:    r.description || '-',
          contact: r.contact || '',
          seller:  r.seller  || '',
          date:    r.date    || (r.created_at ? r.created_at.slice(0,10) : ''),
          views:   r.views   || 0,
          image:   r.image_url || null,
          _sbId:   r.id,
        };
      });
      renderUsed();
    }
  } catch(e) { handleSupabaseError(e, 'Used Items Init'); }

  // ── Forum Posts ────────────────────────────────────────────
  try {
    var sbPosts = await sbGetForumPosts();
    if (sbPosts && sbPosts.length) {
      posts = sbPosts.map(function(r) {
        return {
          id:       r.id,
          category: r.category || 'general',
          region:   r.region   || 'all',
          province: r.province || 'all',
          title:    r.title,
          body:     r.body,
          author:   r.author   || '',
          images:   r.images   || [],
          comments: r.comments || [],
          views:    r.views    || 0,
          date:      r.date      || (r.created_at ? r.created_at.slice(0,10) : ''),
          is_pinned: r.is_pinned || false,
          _sbId:     r.id,
        };
      });
      renderForum();
      renderHomeForumPreview();
    }
  } catch(e) { handleSupabaseError(e, 'Forum Posts Init'); }

  // ── 리더 캐시 로드 (포럼 배지용) ──────────────────────────
  _loadLeaderCache();

  // ── Events ─────────────────────────────────────────────────
  try {
    var sbEvs = await sbGetEvents();
    if (sbEvs && sbEvs.length) {
      events_ = sbEvs.map(function(r) {
        return {
          id:   r.id,
          date: r.event_date || '',
          event: r.title,
          loc:   r.location  || '',
          desc:  r.description || '',
          type:  r.type || 'event',
          region: r.region || 'all',
          createdBy: r.created_by || '',
          _sbId: r.id,
        };
      });
      renderEvents();
      renderHomeEventsPreview();
    }
  } catch(e) { handleSupabaseError(e, 'Events Init'); }

  // ── Webzine Articles ──────────────────────────────────────
  try {
    var sbArticles = await sbGetWebzineArticles();
    if (sbArticles && sbArticles.length) {
      webzineArticles = sbArticles.map(function(r) {
        return {
          id: r.id, category: r.category || 'news', title: r.title,
          body_md: r.body_md || '', thumbnail_url: r.thumbnail_url || null,
          author_id: r.author_id || '', views: r.views || 0,
          date: r.created_at || '',
        };
      });
      renderWebzine();
    }
    renderHomeWebzinePreview();
  } catch(e) { handleSupabaseError(e, 'Webzine Init'); renderHomeWebzinePreview(); }

  // ── Jobs (구인구직) ────────────────────────────────────────
  try {
    var sbJobs = await sbGetJobs();
    if (sbJobs && sbJobs.length) {
      jobsList = sbJobs.map(function(r) {
        return {
          id: r.id, user_id: r.user_id, type: r.type || 'dentist_hire',
          region: r.region || null, province: r.province || null,
          title: r.title, description: r.description || '',
          salary_range: r.salary_range || null, requirements: r.requirements || null,
          contact: r.contact || null, date: r.created_at || '',
        };
      });
      renderJobs();
    }
  } catch(e) { handleSupabaseError(e, 'Jobs Init'); }

  // ── Ad Banners (광고 배너) ──────────────────────────────────
  try {
    await loadAdBanners();
    renderAllAdSlots();
  } catch(e) { handleSupabaseError(e, 'Banners Init'); }
}


// ============================================================
// 통합 검색
// ============================================================
var _searchTimer = null;
function openSearchModal() {
  document.getElementById('searchModal').classList.add('open');
  setTimeout(function(){ document.getElementById('searchInput').focus(); }, 100);
}
function closeSearchModal() {
  document.getElementById('searchModal').classList.remove('open');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '<p class="text-center text-slate-400 text-sm font-bold py-8">' + t('search_hint') + '</p>';
}
function debounceSearch() {
  if (_searchTimer) clearTimeout(_searchTimer);
  _searchTimer = setTimeout(doSearch, 350);
}
async function doSearch() {
  var keyword = document.getElementById('searchInput').value.trim();
  var container = document.getElementById('searchResults');
  if (!keyword || keyword.length < 2) {
    container.innerHTML = '<p class="text-center text-slate-400 text-sm font-bold py-8">' + t('search_hint') + '</p>';
    return;
  }
  container.innerHTML = '<p class="text-center text-slate-400 text-sm font-bold py-8">' + t('search_searching') + '</p>';
  try {
    var results = await sbSearchAll(keyword);
    var html = '';
    // 포럼
    if (results.forum.length) {
      html += '<div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">' + t('nav_forum') + ' (' + results.forum.length + ')</p>';
      html += results.forum.map(function(r) {
        return '<div class="bg-white rounded-xl p-3 mb-1.5 cursor-pointer active:bg-slate-50 transition shadow-sm" onclick="closeSearchModal();goPage(\'forum\')">' +
          '<p class="font-black text-sm text-slate-800 truncate">' + escHtml(r.title) + '</p>' +
          '<p class="text-[9px] text-slate-400 mt-0.5">' + (r.author || '') + ' · ' + (r.created_at || '').slice(0,10) + '</p></div>';
      }).join('');
      html += '</div>';
    }
    // 웹진
    if (results.webzine.length) {
      html += '<div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">' + t('nav_webzine') + ' (' + results.webzine.length + ')</p>';
      html += results.webzine.map(function(r) {
        var aid = typeof r.id === 'string' ? "'" + r.id + "'" : r.id;
        return '<div class="bg-white rounded-xl p-3 mb-1.5 cursor-pointer active:bg-slate-50 transition shadow-sm flex items-center gap-3" onclick="closeSearchModal();openWebzineDetail(' + aid + ')">' +
          (r.thumbnail_url ? '<img src="' + r.thumbnail_url + '" class="w-10 h-10 rounded-lg object-cover shrink-0" loading="lazy">' : '') +
          '<div class="flex-1 min-w-0"><p class="font-black text-sm text-slate-800 truncate">' + escHtml(r.title) + '</p>' +
          '<p class="text-[9px] text-slate-400 mt-0.5">' + (r.created_at || '').slice(0,10) + '</p></div></div>';
      }).join('');
      html += '</div>';
    }
    // 구인구직
    if (results.jobs.length) {
      html += '<div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">' + t('nav_jobs') + ' (' + results.jobs.length + ')</p>';
      html += results.jobs.map(function(r) {
        return '<div class="bg-white rounded-xl p-3 mb-1.5 cursor-pointer active:bg-slate-50 transition shadow-sm" onclick="closeSearchModal();openJobDetail(' + r.id + ')">' +
          '<p class="font-black text-sm text-slate-800 truncate">' + escHtml(r.title) + '</p>' +
          '<p class="text-[9px] text-slate-400 mt-0.5">' + (r.type || '') + ' · ' + (r.created_at || '').slice(0,10) + '</p></div>';
      }).join('');
      html += '</div>';
    }
    // 중고마켓
    if (results.used.length) {
      html += '<div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">' + t('nav_used') + ' (' + results.used.length + ')</p>';
      html += results.used.map(function(r) {
        return '<div class="bg-white rounded-xl p-3 mb-1.5 cursor-pointer active:bg-slate-50 transition shadow-sm flex items-center gap-3" onclick="closeSearchModal();openUsedDetail(' + r.id + ')">' +
          (r.image_url ? '<img src="' + r.image_url + '" class="w-10 h-10 rounded-lg object-cover shrink-0" loading="lazy">' : '') +
          '<div class="flex-1 min-w-0"><p class="font-black text-sm text-slate-800 truncate">' + r.name + '</p>' +
          '<p class="text-[9px] text-slate-400 mt-0.5">' + (r.seller || '') + ' · ' + (r.price ? r.price.toLocaleString() + ' THB' : '') + '</p></div></div>';
      }).join('');
      html += '</div>';
    }
    if (!html) {
      html = '<p class="text-center text-slate-400 text-sm font-bold py-8">' + t('search_no_results') + '</p>';
    }
    container.innerHTML = html;
  } catch(e) {
    handleSupabaseError(e, 'Search');
    container.innerHTML = '<p class="text-center text-red-400 text-sm font-bold py-8">' + t('search_error') + '</p>';
  }
}

// ============================================================
// 알림 센터
// ============================================================
var _notifications = [];
var _notifPage = 1;
var _notifHasMore = true;

function openNotifPanel() {
  document.getElementById('notifPanel').classList.add('open');
  if (isLoggedIn() && currentUser && currentUser.nickname) {
    _notifPage = 1;
    _notifHasMore = true;
    _notifications = [];
    loadNotifications();
  } else {
    document.getElementById('notifList').innerHTML = '<p class="text-center text-slate-400 text-sm font-bold py-12">' + t('notif_login_required') + '</p>';
  }
}
function closeNotifPanel() {
  document.getElementById('notifPanel').classList.remove('open');
}

async function loadNotifications() {
  if (!currentUser || !currentUser.nickname) return;
  var list = document.getElementById('notifList');
  try {
    var data = await sbGetNotifications(currentUser.nickname, _notifPage);
    if (!data || data.length < 20) _notifHasMore = false;
    _notifications = _notifications.concat(data || []);
    renderNotifications();
  } catch(e) {
    handleSupabaseError(e, 'Notifications');
    if (!_notifications.length) {
      list.innerHTML = '<p class="text-center text-red-400 text-sm font-bold py-12">' + t('notif_error') + '</p>';
    }
  }
}

function renderNotifications() {
  var list = document.getElementById('notifList');
  if (!_notifications.length) {
    list.innerHTML = '<p class="text-center text-slate-400 text-sm font-bold py-12">' + t('notif_empty') + '</p>';
    return;
  }
  var typeIcons = { order_status: '📦', comment: '💬', rsvp: '📅', admin: '📢', info: 'ℹ️' };
  list.innerHTML = _notifications.map(function(n) {
    var icon = typeIcons[n.type] || 'ℹ️';
    var readClass = n.is_read ? 'bg-white opacity-60' : 'bg-blue-50 border-l-4 border-blue-400';
    var onclick = n.link ? 'onclick="handleNotifClick(\'' + n.id + '\',\'' + (n.link || '') + '\')"' : 'onclick="markNotifRead(\'' + n.id + '\')"';
    return '<div class="' + readClass + ' rounded-xl p-3 cursor-pointer active:bg-slate-100 transition shadow-sm" ' + onclick + '>' +
      '<div class="flex items-start gap-2">' +
        '<span class="text-base mt-0.5 shrink-0">' + icon + '</span>' +
        '<div class="flex-1 min-w-0">' +
          '<p class="font-black text-xs text-slate-800 leading-snug">' + (n.title || '') + '</p>' +
          (n.body ? '<p class="text-[10px] text-slate-500 mt-0.5 leading-relaxed">' + n.body + '</p>' : '') +
          '<p class="text-[9px] text-slate-400 mt-1">' + (n.created_at || '').slice(0,16).replace('T',' ') + '</p>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function handleNotifClick(notifId, link) {
  markNotifRead(notifId);
  closeNotifPanel();
  if (link) {
    // link = "page:forum" or "page:webzine" etc.
    if (link.indexOf('page:') === 0) {
      goPage(link.replace('page:', ''));
    }
  }
}

async function markNotifRead(notifId) {
  var n = _notifications.find(function(x){ return x.id === notifId; });
  if (n) n.is_read = true;
  renderNotifications();
  updateNotifBadge();
  try { await sbMarkNotifRead(notifId); } catch(e) { /* silent */ }
}

async function markAllNotifsRead() {
  if (!currentUser || !currentUser.nickname) return;
  _notifications.forEach(function(n){ n.is_read = true; });
  renderNotifications();
  updateNotifBadge();
  try { await sbMarkAllNotifsRead(currentUser.nickname); } catch(e) { /* silent */ }
}

async function updateNotifBadge() {
  var badge = document.getElementById('notifBadge');
  if (!badge) return;
  if (!isLoggedIn() || !currentUser || !currentUser.nickname) {
    badge.classList.add('hidden');
    return;
  }
  try {
    var count = await sbGetUnreadNotifCount(currentUser.nickname);
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  } catch(e) { badge.classList.add('hidden'); }
}

// ============================================================
// 무한 스크롤
// ============================================================
var _infiniteScroll = {
  used:    { page: 1, loading: false, hasMore: true },
  forum:   { page: 1, loading: false, hasMore: true },
  jobs:    { page: 1, loading: false, hasMore: true },
  webzine: { page: 1, loading: false, hasMore: true },
};

function _getCurrentPage() {
  var pages = ['used', 'forum', 'jobs', 'webzine'];
  for (var i = 0; i < pages.length; i++) {
    var el = document.getElementById('page-' + pages[i]);
    if (el && el.style.display !== 'none' && !el.classList.contains('hidden')) return pages[i];
  }
  return null;
}

function _isNearBottom() {
  return (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 300);
}

window.addEventListener('scroll', function() {
  if (!_isNearBottom()) return;
  var page = _getCurrentPage();
  if (!page) return;
  var state = _infiniteScroll[page];
  if (!state || state.loading || !state.hasMore) return;
  loadMoreItems(page);
});

async function loadMoreItems(pageType) {
  var state = _infiniteScroll[pageType];
  state.loading = true;
  state.page++;
  var loader = document.getElementById(pageType === 'used' ? 'usedLoadMore' : pageType === 'forum' ? 'forumLoadMore' : pageType === 'jobs' ? 'jobsLoadMore' : 'webzineLoadMore');
  if (loader) loader.classList.remove('hidden');

  try {
    var data;
    if (pageType === 'used') {
      data = await sbGetUsedItems(state.page);
      if (!data || data.length < 20) state.hasMore = false;
      if (data && data.length) {
        var mapped = data.map(function(r) {
          return { id:r.id, name:r.name, code:r.code||'-', price:parseFloat(r.price)||0, cond:r.condition||'good', desc:r.description||'-', contact:r.contact||'', seller:r.seller||'', date:r.date||(r.created_at?r.created_at.slice(0,10):''), views:r.views||0, image:r.image_url||null, _sbId:r.id };
        });
        usedItems = usedItems.concat(mapped);
        renderUsed();
      }
    } else if (pageType === 'forum') {
      data = await sbGetForumPosts(state.page);
      if (!data || data.length < 20) state.hasMore = false;
      if (data && data.length) {
        var mapped = data.map(function(r) {
          return { id:r.id, category:r.category||'general', region:r.region||'all', province:r.province||'all', title:r.title, body:r.body, author:r.author||'', images:r.images||[], comments:r.comments||[], views:r.views||0, date:r.date||(r.created_at?r.created_at.slice(0,10):''), is_pinned:r.is_pinned||false, _sbId:r.id };
        });
        posts = posts.concat(mapped);
        renderForum();
      }
    } else if (pageType === 'jobs') {
      data = await sbGetJobs(state.page);
      if (!data || data.length < 20) state.hasMore = false;
      if (data && data.length) {
        var mapped = data.map(function(r) {
          return { id:r.id, user_id:r.user_id, type:r.type||'dentist_hire', region:r.region||null, province:r.province||null, title:r.title, description:r.description||'', salary_range:r.salary_range||null, requirements:r.requirements||null, contact:r.contact||null, date:r.created_at||'' };
        });
        jobsList = jobsList.concat(mapped);
        renderJobs();
      }
    } else if (pageType === 'webzine') {
      data = await sbGetWebzineArticles(state.page);
      if (!data || data.length < 20) state.hasMore = false;
      if (data && data.length) {
        var mapped = data.map(function(r) {
          return { id:r.id, category:r.category||'news', title:r.title, body_md:r.body_md||'', thumbnail_url:r.thumbnail_url||null, author_id:r.author_id||'', views:r.views||0, date:r.created_at||'' };
        });
        webzineArticles = webzineArticles.concat(mapped);
        renderWebzine();
      }
    }
  } catch(e) {
    handleSupabaseError(e, 'InfiniteScroll');
  }
  state.loading = false;
  if (loader) loader.classList.toggle('hidden', !state.hasMore);
}

// Reset infinite scroll when navigating to a page
function resetInfiniteScroll(pageType) {
  if (_infiniteScroll[pageType]) {
    _infiniteScroll[pageType].page = 1;
    _infiniteScroll[pageType].hasMore = true;
    _infiniteScroll[pageType].loading = false;
  }
}

// ============================================================
// 초기화
// ============================================================
window.addEventListener('DOMContentLoaded', function() {
  var saved = localStorage.getItem('dentalk_lang') || 'th';
  currentLang = saved;
  document.documentElement.lang = currentLang; // 폰트 CSS 즉시 적용
  pendingLang = null;
  document.getElementById('mb-home').classList.add('active');
  updateNavTabs('home');

  // 페이지 로드 시 세션 복원 시도
  var savedSession = localStorage.getItem('dentalk_session');
  if (savedSession) {
    try {
      var sess = JSON.parse(savedSession);
      if (sess.sessionEnd && Date.now() < sess.sessionEnd && sess.user && sess.user.licenseNum) {
        currentUser = sess.user;
        sessionEnd  = sess.sessionEnd;
        extShown    = false;
        // UI 업데이트
        var hNick = document.getElementById('headerNickBadge');
        var hNickTxt = document.getElementById('headerNickText');
        if (hNick && hNickTxt) { hNickTxt.textContent = currentUser.nickname; hNick.classList.add('show'); }
        var hLoginBtn = document.getElementById('headerLoginBtn');
        if (hLoginBtn) hLoginBtn.classList.add('hide');
        var hLogoutBtn = document.getElementById('headerLogoutBtn');
        if (hLogoutBtn) { hLogoutBtn.classList.remove('hidden'); hLogoutBtn.classList.add('show'); }
        document.getElementById('sideLoginArea').classList.add('hidden');
        document.getElementById('sideLoggedArea').classList.remove('hidden');
        var sn = document.getElementById('sideNickname');
        if (sn) sn.textContent = currentUser.nickname;
        if (isAdmin()) {
          document.body.classList.add('is-admin');
        }
        // 세션 타이머 시작
        sessionTimer = setInterval(tickSession, 1000);
        // 비동기 데이터 로드
        updateNotifBadge();
        loadOrdersFromSupabase().then(function() { renderProfileSettings(); });
      } else {
        localStorage.removeItem('dentalk_session');
      }
    } catch(e) {
      localStorage.removeItem('dentalk_session');
    }
  }

  updateNavLocks();
  applyLang();
  renderUsed();
  renderForum();
  renderEvents();
  renderProfileSettings();
  updateNicknameDisplays();
  renderHomePage();
  initHomeBanner();
  // Supabase에서 공개 데이터 비동기 로드
  initSupabasePublicData();
  // Desktop sidebar initial render
  _prevIsDesktop = _isDesktop();
  renderDesktopSidebar('home');
  updateDesktopHero('home');
  // Dark mode: restore from localStorage or system preference
  initDarkMode();
  // Scroll reveal: observe elements
  initScrollReveal();
});

// ============================================================
// DARK MODE
// ============================================================
function initDarkMode() {
  var saved = localStorage.getItem('dentalk_darkmode');
  var isDark;
  if (saved !== null) {
    isDark = saved === '1';
  } else {
    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  applyDarkMode(isDark);
  var toggle = document.getElementById('darkModeToggle');
  if (toggle) toggle.checked = isDark;
}
function toggleDarkMode(on) {
  localStorage.setItem('dentalk_darkmode', on ? '1' : '0');
  applyDarkMode(on);
}
function applyDarkMode(on) {
  document.body.classList.toggle('dark', on);
  var toggle = document.getElementById('darkModeToggle');
  if (toggle) toggle.checked = on;
}

// ============================================================
// SCROLL REVEAL — IntersectionObserver
// ============================================================
function initScrollReveal() {
  var els = document.querySelectorAll('.scroll-reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(function(el) { el.classList.add('revealed'); });
    return;
  }
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function(el) { observer.observe(el); });
}
// Re-init scroll reveal when navigating to home (elements may be re-rendered)
function refreshScrollReveal() {
  setTimeout(function() { initScrollReveal(); }, 50);
}
