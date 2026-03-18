// ============================================================
// PWA 설치 — prompt captured early in index.html <head>
// ============================================================
function triggerInstall() {
  var existing = document.getElementById('installGuidePopup');
  if (existing) existing.remove();
  var popup = document.createElement('div');
  popup.id = 'installGuidePopup';
  popup.innerHTML =
    '<div class="fixed inset-0 z-[999] flex items-end" style="background:rgba(0,0,0,.6)" onclick="document.getElementById(\'installGuidePopup\').remove()">' +
    '<div class="bg-white rounded-t-3xl w-full p-6 pb-10" onclick="event.stopPropagation()">' +
      '<p class="text-center text-base font-black text-slate-800 mb-6">앱 설치 방법 선택</p>' +
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
      '<button onclick="document.getElementById(\'installGuidePopup\').remove()" class="w-full py-3 bg-slate-100 text-slate-600 font-black rounded-2xl text-sm">취소</button>' +
    '</div></div>';
  document.body.appendChild(popup);
}
function showInstallGuide(type) {
  var existing = document.getElementById('installGuidePopup');
  if (existing) existing.remove();
  var guides = {
    android: {
      icon: '<svg viewBox="0 0 24 24" class="w-8 h-8 mx-auto mb-2" fill="#3DDC84"><path d="M17.523 15.341a.676.676 0 0 1-.676-.676V9.382a.676.676 0 0 1 1.352 0v5.283a.676.676 0 0 1-.676.676zm-11.046 0a.676.676 0 0 1-.676-.676V9.382a.676.676 0 0 1 1.352 0v5.283a.676.676 0 0 1-.676.676zM8.6 17.6a.6.6 0 0 0 .6.6h.9v2.124a.676.676 0 0 0 1.352 0V18.2h1.096v2.124a.676.676 0 0 0 1.352 0V18.2h.9a.6.6 0 0 0 .6-.6V9H8.6v8.6zM14.863 4.487l.807-1.44a.17.17 0 0 0-.298-.163l-.817 1.456A5.3 5.3 0 0 0 12 3.9a5.3 5.3 0 0 0-2.555.44L8.628 2.884a.17.17 0 0 0-.298.163l.807 1.44A5.2 5.2 0 0 0 6.6 8.8h10.8a5.2 5.2 0 0 0-2.537-4.313zM10.5 7a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm3 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z"/></svg>',
      title: 'Android 설치',
      steps: '① 브라우저 주소창 우측 <b>⋮ 메뉴</b> 탭<br>② <b>"앱 설치"</b> 또는 <b>"홈 화면에 추가"</b> 선택<br>③ <b>"설치"</b> 탭'
    },
    ios: {
      icon: '<svg viewBox="0 0 24 24" class="w-8 h-8 mx-auto mb-2" fill="#000"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
      title: 'iPhone / iPad 설치',
      steps: '① Safari 하단 <b>공유 버튼 □↑</b> 탭<br>② <b>"홈 화면에 추가"</b> 선택<br>③ <b>"추가"</b> 탭<br><br>※ Safari 브라우저에서만 가능'
    },
    windows: {
      icon: '<svg viewBox="0 0 24 24" class="w-8 h-8 mx-auto mb-2" fill="#0078D4"><path d="M3 12V6.75l6-1.32v6.57H3zm17-9v8.75h-7V4.68L20 3zM3 13h6v6.43l-6-1.29V13zm17 .25V22l-7-1.23V13.25H20z"/></svg>',
      title: 'Windows 설치',
      steps: '① Chrome/Edge 주소창 우측 <b>⊕ 설치 아이콘</b> 클릭<br>② <b>"설치"</b> 클릭<br><br>※ 아이콘 없으면 브라우저 메뉴 <b>⋮</b><br>&nbsp;&nbsp;&nbsp;→ <b>"앱으로 설치"</b> 또는 <b>"Dentalk 설치"</b>'
    },
    mac: {
      icon: '<svg viewBox="0 0 24 24" class="w-8 h-8 mx-auto mb-2" fill="#555"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
      title: 'Mac 설치',
      steps: '① Chrome/Edge 주소창 우측 <b>⊕ 설치 아이콘</b> 클릭<br>② <b>"설치"</b> 클릭<br><br>※ Safari의 경우 <b>파일 메뉴</b><br>&nbsp;&nbsp;&nbsp;→ <b>"Dock에 추가"</b>'
    }
  };
  var g = guides[type];
  var canDirectInstall = (type === 'android' || type === 'windows' || type === 'mac') && window._pwaInstallPrompt;
  var installBtn = canDirectInstall
    ? '<button onclick="document.getElementById(\'installGuidePopup\').remove();window._pwaInstallPrompt.prompt();window._pwaInstallPrompt.userChoice.then(function(r){if(r.outcome===\'accepted\')window._pwaInstallPrompt=null;})" class="flex-1 py-3 bg-[#001d4a] text-white font-black rounded-2xl text-sm">⬇ 지금 설치</button>'
    : '<button onclick="document.getElementById(\'installGuidePopup\').remove()" class="flex-1 py-3 bg-[#001d4a] text-white font-black rounded-2xl text-sm">확인</button>';
  var popup = document.createElement('div');
  popup.id = 'installGuidePopup';
  popup.innerHTML =
    '<div class="fixed inset-0 z-[999] flex items-end" style="background:rgba(0,0,0,.6)" onclick="document.getElementById(\'installGuidePopup\').remove()">' +
    '<div class="bg-white rounded-t-3xl w-full p-6 pb-10" onclick="event.stopPropagation()">' +
      '<div class="text-center mb-4">' + g.icon + '<p class="text-base font-black text-slate-800">' + g.title + '</p></div>' +
      '<p class="text-sm text-slate-700 leading-relaxed mb-6 bg-slate-50 rounded-2xl p-4">' + g.steps + '</p>' +
      '<div class="flex gap-3">' +
        '<button onclick="triggerInstall()" class="flex-1 py-3 bg-slate-100 text-slate-600 font-black rounded-2xl text-sm">← 뒤로</button>' +
        installBtn +
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
let currentLang  = 'en';
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
// 세션 관리
// ============================================================
function isLoggedIn() { return sessionEnd && Date.now() < sessionEnd; }
function openLoginModal(target) {
  pendingPage = target;
  document.getElementById('loginNickname').value = '';
  document.getElementById('loginPassword').value = '';
  openModal('loginModal');
}
function openRegisterModal() {
  clearLoginError();
  closeModal('loginModal');
  ['regLicense','regNickname','regName','regClinic','regEmail','regContact','regPassword','regPasswordConfirm'].forEach(function(id){ document.getElementById(id).value=''; });
  document.getElementById('regPrivacyConsent').checked = false;
  clearRegError();
  openModal('registerModal');
}
function openPrivacyModal(e) {
  if (e) e.preventDefault();
  var html = getPrivacyHtml();
  document.getElementById('privacyContent').innerHTML = html;
  openModal('privacyModal');
}
function getPrivacyHtml() {
  var d = {
    en: {
      updated: 'Last updated: March 2026',
      s1t: '1. Data Controller',
      s1: 'BIOPLANT (Thailand) Co., Ltd. ("Dentalk") is the data controller for personal data collected through this application, in compliance with Thailand\'s Personal Data Protection Act B.E. 2562 (PDPA).',
      s2t: '2. Data We Collect',
      s2: ['Full name and dental license number', 'Clinic name and delivery address', 'Phone number, Line ID, and email address', 'Order history and product preferences'],
      s3t: '3. Purpose of Processing',
      s3: ['Account creation and identity verification', 'Processing and coordinating product orders', 'Sending order notifications via Line', 'Customer support and service improvement'],
      s4t: '4. Legal Basis',
      s4: 'Processing is based on your explicit consent given at registration. You may withdraw consent at any time by contacting us — this will not affect the lawfulness of prior processing.',
      s5t: '5. Data Retention',
      s5: 'Your data is retained while your account is active. Upon a valid deletion request, data will be removed within 30 days, unless retention is required by Thai law.',
      s6t: '6. Your Rights (Thailand PDPA)',
      s6: ['Right to access your personal data', 'Right to correct inaccurate data', 'Right to request erasure', 'Right to restrict processing', 'Right to data portability', 'Right to withdraw consent at any time', 'Right to object to processing'],
      s7t: '7. Contact',
      s7: 'To exercise your rights or for any privacy inquiries, contact us via Line: @bioplant_th or email: privacy@bioplant.co.th',
      s8t: '8. Right to Complain',
      s8: 'If you believe your rights have been violated, you may file a complaint with Thailand\'s Personal Data Protection Committee (PDPC) at pdpc.or.th.',
    },
    ko: {
      updated: '최종 업데이트: 2026년 3월',
      s1t: '1. 개인정보 처리자',
      s1: 'BIOPLANT (Thailand) Co., Ltd. ("Dentalk")은 태국 개인정보보호법 B.E. 2562 (PDPA)에 따라 본 앱을 통해 수집된 개인정보를 처리합니다.',
      s2t: '2. 수집 항목',
      s2: ['성명 및 의사 면허번호', '치과명 및 배송 주소', '전화번호, Line ID, 이메일 주소', '주문 내역 및 이용 기록'],
      s3t: '3. 수집 목적',
      s3: ['계정 생성 및 신원 확인', '제품 주문 처리 및 납품 조율', 'Line을 통한 주문 알림 발송', '고객 지원 및 서비스 개선'],
      s4t: '4. 법적 근거',
      s4: '개인정보 처리는 가입 시 제공한 명시적 동의를 근거로 합니다. 언제든지 동의를 철회할 수 있으며, 이는 철회 이전 처리의 적법성에 영향을 미치지 않습니다.',
      s5t: '5. 보유 기간',
      s5: '계정이 활성 상태인 동안 보유합니다. 유효한 삭제 요청 수령 후 30일 이내에 파기하며, 태국 법령에 의해 보존이 필요한 경우는 예외입니다.',
      s6t: '6. 이용자 권리 (태국 PDPA)',
      s6: ['개인정보 열람권', '부정확한 정보 정정권', '삭제 요청권', '처리 제한권', '데이터 이동권', '언제든지 동의 철회권', '처리 거부권'],
      s7t: '7. 연락처',
      s7: '권리 행사 및 개인정보 관련 문의: Line @bioplant_th | 이메일: privacy@bioplant.co.th',
      s8t: '8. 민원 제기',
      s8: '권리가 침해되었다고 판단되는 경우 태국 개인정보보호위원회(PDPC)에 민원을 제기할 수 있습니다. (pdpc.or.th)',
    },
    zh: {
      updated: '最后更新：2026年3月',
      s1t: '1. 数据控制者',
      s1: 'BIOPLANT（泰国）有限公司（"Dentalk"）依据泰国《个人数据保护法》B.E. 2562（PDPA）处理通过本应用收集的个人数据。',
      s2t: '2. 收集的数据',
      s2: ['姓名及牙科执照号码', '诊所名称及配送地址', '电话号码、Line ID、电子邮件', '订单记录及产品偏好'],
      s3t: '3. 处理目的',
      s3: ['账户创建及身份验证', '产品订单处理与配送协调', '通过Line发送订单通知', '客户支持及服务改进'],
      s4t: '4. 法律依据',
      s4: '数据处理基于您在注册时提供的明确同意。您可随时撤回同意，撤回不影响之前处理行为的合法性。',
      s5t: '5. 数据保留',
      s5: '您的数据将在账户有效期间保留。收到有效删除申请后30天内删除，泰国法律要求保留的数据除外。',
      s6t: '6. 您的权利（泰国PDPA）',
      s6: ['查阅个人数据的权利', '更正不准确数据的权利', '申请删除的权利', '限制处理的权利', '数据可携权', '随时撤回同意的权利', '反对数据处理的权利'],
      s7t: '7. 联系方式',
      s7: '行使权利或隐私相关咨询：Line: @bioplant_th | 邮件: privacy@bioplant.co.th',
      s8t: '8. 投诉权利',
      s8: '如您认为权益受损，可向泰国个人数据保护委员会（PDPC）投诉，网址：pdpc.or.th',
    },
    th: {
      updated: 'อัปเดตล่าสุด: มีนาคม 2026',
      s1t: '1. ผู้ควบคุมข้อมูลส่วนบุคคล',
      s1: 'บริษัท BIOPLANT (Thailand) Co., Ltd. ("Dentalk") เป็นผู้ควบคุมข้อมูลส่วนบุคคลที่เก็บรวบรวมผ่านแอปพลิเคชันนี้ ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)',
      s2t: '2. ข้อมูลที่เก็บรวบรวม',
      s2: ['ชื่อ-นามสกุล และหมายเลขใบอนุญาตทันตแพทย์', 'ชื่อคลินิก และที่อยู่สำหรับจัดส่ง', 'หมายเลขโทรศัพท์ Line ID และอีเมล', 'ประวัติการสั่งซื้อและความชอบด้านผลิตภัณฑ์'],
      s3t: '3. วัตถุประสงค์ในการประมวลผล',
      s3: ['การสร้างบัญชีและการยืนยันตัวตน', 'การประมวลผลคำสั่งซื้อและการประสานงานจัดส่ง', 'การส่งการแจ้งเตือนคำสั่งซื้อผ่าน Line', 'การสนับสนุนลูกค้าและการปรับปรุงบริการ'],
      s4t: '4. ฐานทางกฎหมาย',
      s4: 'การประมวลผลข้อมูลอาศัยความยินยอมโดยชัดแจ้งที่ท่านให้ไว้ในขณะลงทะเบียน ท่านสามารถถอนความยินยอมได้ทุกเมื่อโดยการติดต่อเรา ซึ่งไม่กระทบต่อความชอบด้วยกฎหมายของการประมวลผลก่อนการถอน',
      s5t: '5. ระยะเวลาในการเก็บรักษาข้อมูล',
      s5: 'ข้อมูลของท่านจะถูกเก็บรักษาตลอดระยะเวลาที่บัญชียังใช้งานอยู่ เมื่อได้รับคำขอลบบัญชีที่ถูกต้อง ข้อมูลจะถูกลบภายใน 30 วัน ยกเว้นกรณีที่กฎหมายไทยกำหนดให้เก็บรักษา',
      s6t: '6. สิทธิของเจ้าของข้อมูล (PDPA ไทย)',
      s6: ['สิทธิในการเข้าถึงข้อมูลส่วนบุคคล', 'สิทธิในการแก้ไขข้อมูลที่ไม่ถูกต้อง', 'สิทธิในการขอลบข้อมูล', 'สิทธิในการจำกัดการประมวลผล', 'สิทธิในการโอนย้ายข้อมูล', 'สิทธิในการถอนความยินยอมได้ทุกเมื่อ', 'สิทธิในการคัดค้านการประมวลผล'],
      s7t: '7. ช่องทางติดต่อ',
      s7: 'สำหรับการใช้สิทธิหรือสอบถามเกี่ยวกับความเป็นส่วนตัว: Line: @bioplant_th | อีเมล: privacy@bioplant.co.th',
      s8t: '8. สิทธิในการร้องเรียน',
      s8: 'หากท่านเชื่อว่าสิทธิของท่านถูกละเมิด ท่านมีสิทธิ์ยื่นเรื่องร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (PDPC) ที่ pdpc.or.th',
    },
    vi: {
      updated: 'Cập nhật lần cuối: Tháng 3 năm 2026',
      s1t: '1. Đơn vị kiểm soát dữ liệu',
      s1: 'Công ty BIOPLANT (Thailand) Co., Ltd. ("Dentalk") là đơn vị kiểm soát dữ liệu cá nhân thu thập qua ứng dụng này, tuân thủ Luật Bảo vệ Dữ liệu Cá nhân Thái Lan B.E. 2562 (PDPA).',
      s2t: '2. Dữ liệu chúng tôi thu thập',
      s2: ['Họ tên đầy đủ và số giấy phép hành nghề nha khoa', 'Tên phòng khám và địa chỉ giao hàng', 'Số điện thoại, Line ID và địa chỉ email', 'Lịch sử đặt hàng và sở thích sản phẩm'],
      s3t: '3. Mục đích xử lý',
      s3: ['Tạo tài khoản và xác minh danh tính', 'Xử lý và phối hợp giao hàng đơn đặt hàng', 'Gửi thông báo đơn hàng qua Line', 'Hỗ trợ khách hàng và cải thiện dịch vụ'],
      s4t: '4. Cơ sở pháp lý',
      s4: 'Việc xử lý dựa trên sự đồng ý rõ ràng của bạn khi đăng ký. Bạn có thể rút lại sự đồng ý bất cứ lúc nào — điều này không ảnh hưởng đến tính hợp pháp của việc xử lý trước đó.',
      s5t: '5. Thời hạn lưu trữ dữ liệu',
      s5: 'Dữ liệu được lưu giữ trong thời gian tài khoản hoạt động. Sau khi nhận yêu cầu xóa hợp lệ, dữ liệu sẽ bị xóa trong 30 ngày, trừ khi pháp luật Thái Lan yêu cầu lưu giữ.',
      s6t: '6. Quyền của bạn (PDPA Thái Lan)',
      s6: ['Quyền truy cập dữ liệu cá nhân', 'Quyền sửa dữ liệu không chính xác', 'Quyền yêu cầu xóa dữ liệu', 'Quyền hạn chế xử lý', 'Quyền chuyển dữ liệu', 'Quyền rút lại sự đồng ý bất cứ lúc nào', 'Quyền phản đối việc xử lý'],
      s7t: '7. Liên hệ',
      s7: 'Để thực hiện quyền hoặc có thắc mắc về quyền riêng tư, liên hệ qua Line: @bioplant_th hoặc email: privacy@bioplant.co.th',
      s8t: '8. Quyền khiếu nại',
      s8: 'Nếu bạn cho rằng quyền của mình bị vi phạm, bạn có thể nộp khiếu nại lên Ủy ban Bảo vệ Dữ liệu Cá nhân Thái Lan (PDPC) tại pdpc.or.th.',
    },
    es: {
      updated: 'Última actualización: Marzo 2026',
      s1t: '1. Responsable del tratamiento',
      s1: 'BIOPLANT (Thailand) Co., Ltd. ("Dentalk") es el responsable del tratamiento de los datos personales recopilados a través de esta aplicación, de conformidad con la Ley de Protección de Datos Personales de Tailandia B.E. 2562 (PDPA).',
      s2t: '2. Datos que recopilamos',
      s2: ['Nombre completo y número de licencia dental', 'Nombre de la clínica y dirección de entrega', 'Número de teléfono, Line ID y correo electrónico', 'Historial de pedidos y preferencias de productos'],
      s3t: '3. Finalidad del tratamiento',
      s3: ['Creación de cuenta y verificación de identidad', 'Tramitación y coordinación de entrega de pedidos', 'Envío de notificaciones de pedidos por Line', 'Atención al cliente y mejora del servicio'],
      s4t: '4. Base legal',
      s4: 'El tratamiento se basa en tu consentimiento explícito proporcionado al registrarte. Puedes retirar el consentimiento en cualquier momento contactándonos — esto no afecta la licitud del tratamiento anterior.',
      s5t: '5. Conservación de datos',
      s5: 'Tus datos se conservan mientras tu cuenta esté activa. Ante una solicitud válida de eliminación, los datos se borrarán en 30 días, salvo que la ley tailandesa exija su conservación.',
      s6t: '6. Tus derechos (PDPA Tailandia)',
      s6: ['Derecho de acceso a tus datos personales', 'Derecho de rectificación de datos inexactos', 'Derecho de supresión', 'Derecho a la limitación del tratamiento', 'Derecho a la portabilidad de datos', 'Derecho a retirar el consentimiento en cualquier momento', 'Derecho de oposición al tratamiento'],
      s7t: '7. Contacto',
      s7: 'Para ejercer tus derechos o cualquier consulta de privacidad, contáctanos por Line: @bioplant_th o email: privacy@bioplant.co.th',
      s8t: '8. Derecho de reclamación',
      s8: 'Si consideras que se han vulnerado tus derechos, puedes presentar una reclamación ante el Comité de Protección de Datos Personales de Tailandia (PDPC) en pdpc.or.th.',
    },
  };
  var x = d[currentLang] || d.en;
  var listHtml = function(items) {
    return '<ul class="space-y-1 list-disc list-inside">' + items.map(function(i){ return '<li>' + i + '</li>'; }).join('') + '</ul>';
  };
  return '<div class="space-y-4 text-xs text-slate-600">'
    + '<p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">' + x.updated + '</p>'
    + '<div><p class="font-black text-slate-800 text-sm mb-1">' + x.s1t + '</p><p>' + x.s1 + '</p></div>'
    + '<div><p class="font-black text-slate-800 text-sm mb-1">' + x.s2t + '</p>' + listHtml(x.s2) + '</div>'
    + '<div><p class="font-black text-slate-800 text-sm mb-1">' + x.s3t + '</p>' + listHtml(x.s3) + '</div>'
    + '<div><p class="font-black text-slate-800 text-sm mb-1">' + x.s4t + '</p><p>' + x.s4 + '</p></div>'
    + '<div><p class="font-black text-slate-800 text-sm mb-1">' + x.s5t + '</p><p>' + x.s5 + '</p></div>'
    + '<div><p class="font-black text-slate-800 text-sm mb-1">' + x.s6t + '</p>' + listHtml(x.s6) + '</div>'
    + '<div><p class="font-black text-slate-800 text-sm mb-1">' + x.s7t + '</p><p>' + x.s7 + '</p></div>'
    + '<div class="bg-blue-50 rounded-xl p-3"><p class="font-black text-slate-800 text-sm mb-1">' + x.s8t + '</p><p class="text-blue-700">' + x.s8 + '</p></div>'
    + '</div>';
}
function showRegError(msg) {
  var el = document.getElementById('regError');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  el.scrollIntoView({ behavior:'smooth', block:'nearest' });
}
function clearRegError() {
  var el = document.getElementById('regError');
  if (el) el.classList.add('hidden');
}
async function submitRegistration() {
  clearRegError();
  var lic      = document.getElementById('regLicense').value.trim();
  var nickname = document.getElementById('regNickname').value.trim();
  var name     = document.getElementById('regName').value.trim();
  var clinic   = document.getElementById('regClinic').value.trim();
  var email    = document.getElementById('regEmail').value.trim();
  var contact  = document.getElementById('regContact').value.trim();
  var password = document.getElementById('regPassword').value.trim();
  var passwordConfirm = document.getElementById('regPasswordConfirm').value.trim();
  if (!lic || !nickname || !name || !clinic || !email || !contact || !password || !passwordConfirm) {
    showRegError(t('reg_error')); return;
  }
  if (password !== passwordConfirm) {
    showRegError(t('reg_pwd_mismatch')); return;
  }
  if (!document.getElementById('regPrivacyConsent').checked) {
    showRegError(t('reg_privacy_error')); return;
  }
  var btn = document.getElementById('regSubmitBtn');
  btn.disabled = true;
  btn.textContent = t('reg_submitting');
  try {
    var res = await authRegister({ licenseNumber:lic, doctorName:name, clinicName:clinic, contact:contact, nickname:nickname, email:email, password:password });
    btn.disabled = false;
    btn.textContent = t('reg_submit');
    if (res.status === 409) { showRegError(t('reg_duplicate')); return; }
    if (!res.ok) { showRegError(t('reg_network_error')); return; }
    alert(t('reg_success'));
    closeModal('registerModal');
  } catch(e) {
    btn.disabled = false;
    btn.textContent = t('reg_submit');
    showRegError(t('reg_network_error'));
  }
}
// ── Supabase 사용자 검증 — supabase.js의 authLogin() 사용 ────────
async function verifyUser(nickname, password) {
  return authLogin(nickname, password);
}
function showLoginError(msg) {
  var el = document.getElementById('loginError');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
}
function clearLoginError() {
  var el = document.getElementById('loginError');
  if (el) el.classList.add('hidden');
}
async function handleLogin() {
  clearLoginError();
  const nick = document.getElementById('loginNickname').value.trim();
  const pwd  = document.getElementById('loginPassword').value.trim();
  if (!nick || !pwd) { showLoginError(t('login_error')); return; }
  // 로딩 상태
  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.textContent = t('login_verifying');
  const result = await verifyUser(nick, pwd);
  btn.disabled = false;
  btn.textContent = t('login_btn');
  if (!result.ok) {
    var errMsg = result.reason === 'network'    ? t('login_network_error')
               : result.reason === 'not_active' ? t('login_not_found')
               : t('login_not_found');
    showLoginError(errMsg);
    return;
  }
  // 로그인 성공 — Supabase 데이터 우선, localStorage 폴백
  var lic = result.licenseNum;
  var profileStr = localStorage.getItem('dentalk_profile_' + lic);
  var local      = profileStr ? JSON.parse(profileStr) : {};
  currentUser = {
    licenseNum: lic,
    nickname:   result.nickname   || local.nickname   || nick,
    email:      result.email      || local.email      || '',
    phone:      result.phone      || local.phone      || '',
    address:    result.address    || local.address    || '',
    clinicName: result.clinicName || local.clinicName || '',
    doctorName: result.doctorName || '',
    role:          result.role          || 'user',
    leaderRegion:  result.leaderRegion  || '',
    leaderTitle:   result.leaderTitle   || '',
  };
  // Supabase에서 받은 최신 데이터를 localStorage에도 동기화
  var sync = { nickname:currentUser.nickname, email:currentUser.email, phone:currentUser.phone, address:currentUser.address, clinicName:currentUser.clinicName, doctorName:currentUser.doctorName };
  localStorage.setItem('dentalk_profile_' + lic, JSON.stringify(sync));
  sessionEnd = Date.now() + 365*24*60*60*1000;
  extShown   = false;
  localStorage.setItem('dentalk_session', JSON.stringify({ user: currentUser, sessionEnd: sessionEnd }));
  var licDisp = document.getElementById('licenseDisplay');
  if (licDisp) licDisp.textContent = currentUser.nickname;
  var sideNick = document.getElementById('sideNickname');
  if (sideNick) sideNick.textContent = currentUser.nickname;
  document.getElementById('sideLoginArea').classList.add('hidden');
  document.getElementById('sideLoggedArea').classList.remove('hidden');
  // 헤더 닉네임 배지
  var hNick = document.getElementById('headerNickBadge');
  var hNickTxt = document.getElementById('headerNickText');
  if (hNick && hNickTxt) { hNickTxt.textContent = currentUser.nickname; hNick.classList.add('show'); }
  var hLoginBtn = document.getElementById('headerLoginBtn');
  if (hLoginBtn) hLoginBtn.classList.add('hide');
  var hLogoutBtn = document.getElementById('headerLogoutBtn');
  if (hLogoutBtn) { hLogoutBtn.classList.remove('hidden'); hLogoutBtn.classList.add('flex'); }
  updateNavLocks();
  updateNicknameDisplays();
  closeModal('loginModal');
  // 알림 배지 업데이트
  updateNotifBadge();
  // 로그인 직후 CNC 주문 로드 → 설정 페이지 요약에 반영
  loadOrdersFromSupabase().then(function() { renderProfileSettings(); });
  renderProfileSettings(); // 로딩 전 빈 화면 방지용 즉시 렌더
  if (isAdmin()) {
    document.body.classList.add('is-admin');
    goPage('factory');
    renderAdminPanel();
    pendingPage = null;
    return;
  }
  if (pendingPage) { goPage(pendingPage); pendingPage = null; }
}
function tickSession() {
  if (!sessionEnd) return;
  const rem = Math.max(0, Math.floor((sessionEnd - Date.now()) / 1000));
  const m = Math.floor(rem/60), s = rem%60;
  const txt = m + ':' + String(s).padStart(2,'0');
  const el  = document.getElementById('timerText');
  const bdg = document.getElementById('timerBadge');
  const sd  = document.getElementById('sideTimer');
  if (el)  el.textContent  = txt;
  if (sd)  sd.textContent  = t('side_remain') + ' ' + txt;
  if (el)  el.className    = rem<=300 ? 'text-[11px] font-black text-red-400 font-mono' : 'text-[11px] font-black text-green-300 font-mono';
  if (bdg) bdg.className   = rem<=300 ? 'flex items-center gap-1 bg-red-500/20 rounded-xl px-2 py-1.5 animate-pulse' : 'flex items-center gap-1 bg-white/10 rounded-xl px-2 py-1.5';
  if (rem<=300 && rem>0 && !extShown) {
    extShown = true;
    document.getElementById('extendRemain').textContent = m + ':' + String(s).padStart(2,'0');
    openModal('extendModal');
  }
  if (rem<=0) forceLogout();
}
function extendSession() {
  sessionEnd = Date.now() + 30*60*1000;
  extShown   = false;
  localStorage.setItem('dentalk_session', JSON.stringify({ user: currentUser, sessionEnd: sessionEnd }));
  closeModal('extendModal');
}
function forceLogout() {
  clearInterval(sessionTimer); sessionTimer=null; sessionEnd=null; extShown=false;
  localStorage.removeItem('dentalk_session');
  document.body.classList.remove('is-admin');
  currentUser = { licenseNum:'', nickname:'', email:'', phone:'', address:'', clinicName:'', doctorName:'', role:'' };
  document.getElementById('sideLoginArea').classList.remove('hidden');
  document.getElementById('sideLoggedArea').classList.add('hidden');
  document.getElementById('timerWrap').classList.add('hidden');
  var hNick = document.getElementById('headerNickBadge');
  if (hNick) hNick.classList.remove('show');
  var hLoginBtn = document.getElementById('headerLoginBtn');
  if (hLoginBtn) hLoginBtn.classList.remove('hide');
  var hLogoutBtn = document.getElementById('headerLogoutBtn');
  if (hLogoutBtn) { hLogoutBtn.classList.add('hidden'); hLogoutBtn.classList.remove('flex'); }
  updateNavLocks();
  renderProfileSettings();
  updateNicknameDisplays();
  if (LOCKED.includes(currentPage)) goPage('home');
  alert(t('session_expired'));
}
function doLogout() {
  clearInterval(sessionTimer); sessionTimer=null; sessionEnd=null; extShown=false;
  localStorage.removeItem('dentalk_session');
  currentUser = { licenseNum:'', nickname:'', email:'', phone:'', address:'', clinicName:'', doctorName:'', role:'' };
  cart=[]; updateBadge();
  document.getElementById('sideLoginArea').classList.remove('hidden');
  document.getElementById('sideLoggedArea').classList.add('hidden');
  document.getElementById('timerWrap').classList.add('hidden');
  var licDisp = document.getElementById('licenseDisplay');
  if (licDisp) licDisp.textContent = '-';
  var hNick = document.getElementById('headerNickBadge');
  if (hNick) hNick.classList.remove('show');
  var hLoginBtn = document.getElementById('headerLoginBtn');
  if (hLoginBtn) hLoginBtn.classList.remove('hide');
  var hLogoutBtn = document.getElementById('headerLogoutBtn');
  if (hLogoutBtn) { hLogoutBtn.classList.add('hidden'); hLogoutBtn.classList.remove('flex'); }
  updateNavLocks();
  renderProfileSettings();
  updateNicknameDisplays();
  if (LOCKED.includes(currentPage) || currentPage === 'factory') goPage('home');
  closeMenu();
}
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
    inner.innerHTML =
      '<button class="nav-drop-item" onclick="goForumSub(\'implant\')">' +
        '<span>🦷</span><span data-i18n="forum_tab_implant">Implant</span>' +
      '</button>' +
      '<button class="nav-drop-item" onclick="goForumSub(\'prosthetic\')">' +
        '<span>💎</span><span data-i18n="forum_tab_prosthetic">Prosthetic</span>' +
      '</button>';
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
    if (loggedIn) { logoutBtn.classList.remove('hidden'); logoutBtn.classList.add('flex'); }
    else          { logoutBtn.classList.add('hidden');    logoutBtn.classList.remove('flex'); }
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
  if (id === 'home')   { renderHomePage(); initHomeBanner(); }
  if (id === 'shop')     renderShop();
  if (id === 'used')     renderUsed();
  if (id === 'forum')  { renderForum(); updateNicknameDisplays(); }
  if (id === 'jobs')     renderJobs();
  if (id === 'webzine')  renderWebzine();
  if (id === 'events')   renderEvents();
  if (id === 'custom')   { customTab('form'); resetCustomForm(); }
  if (id === 'factory')  renderAdminPanel();
  if (id === 'settings') renderProfileSettings();
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
}
function goBack() {
  goPage(prevPage || 'home');
}
// ============================================================
// 제품 DB
// ============================================================
const PRODUCTS = [
  {id:'ScanBodyIntraOral',category:'scan-body',title:'Scan Body (Intra-Oral)',subtitle:'Healing type · Special coating',price:3500,tableType:'dh',connections:[{label:'Ø4.0',type:'N'},{label:'Ø4.0',type:'R'},{label:'Ø5.0',type:'R'},{label:'Ø6.0',type:'R'}],heights:['5','7','9'],codes:[['HSAM4005S','HSAM4007S','HSAM4009S'],['HSAR4005S','HSAR4007S','HSAR4009S'],['HSAR5005S','HSAR5007S','HSAR5009S'],['HSAR6005S','HSAR6007S','HSAR6009S']]},
  {id:'ScanBodyModel',category:'scan-body',title:'Scan Body (Model)',subtitle:'Stone model scanbody',price:3500,tableType:'dh',connections:[{label:'Ø4.0',type:'N'},{label:'Ø4.0',type:'R'},{label:'Ø5.0',type:'R'},{label:'Ø6.0',type:'R'}],heights:['5','7','9'],codes:[['SMAM4005S','SMAM4007S','SMAM4009S'],['SMAR4005S','SMAR4007S','SMAR4009S'],['SMAR5005S','SMAR5007S','SMAR5009S'],['SMAR6005S','SMAR6007S','SMAR6009S']]},
  {id:'GeoMediIntraOral',category:'scan-body',title:'Scan Body (GeoMedi Intra-Oral)',subtitle:'Ti-6Al-4V ELI · Short 7.5mm / Long 11.5mm',price:4000,tableType:'simple',rows:[{label:'N',type:'N',items:[{code:'GMS-ASRS',size:'Short 7.5mm'},{code:'GMS-ASRL',size:'Long 11.5mm'}]},{label:'R',type:'R',items:[{code:'GMS-SUROS',size:'Short 7.5mm'},{code:'GMS-SUROL',size:'Long 11.5mm'}]}]},
  {id:'GeoMediModel',category:'scan-body',title:'Scan Body (GeoMedi Model)',subtitle:'Teflon-coating · Semipermanent',price:4000,tableType:'simple',rows:[{label:'N',type:'N',items:[{code:'SC-ASR',size:'Standard'}]},{label:'R',type:'R',items:[{code:'SC-SURO',size:'Standard'}]}]},
  {id:'QBase',category:'q-base',title:'Q-Base (Zirconia Abutment)',subtitle:'H=7mm · 3° taper',price:4500,tableType:'dh',connections:[{label:'Ø4.4',type:'N'},{label:'Ø5.5',type:'R'}],heights:['C1','C3','C5'],codes:[['QBAM4401S','QBAM4403S','QBAM4405S'],['QBAR5501S','QBAR5503S','QBAR5505S']]},
  {id:'ReadyMade30',category:'ready-made',title:'Ready Made Abutment (Ø3.0 N)',subtitle:'Dual purpose · Torque 20N',price:5000,tableType2:'hxc',colLabels:['C1','C2','C3','C4'],rowLabels:['H 4.0','H 5.5','H 7.0'],codeMatrix:[['SAAT 30514 MSA','SAAT 30524 MSA','SAAT 30534 MSA','SAAT 30544 MSA'],['SAAT 30515 MSA','SAAT 30525 MSA','SAAT 30535 MSA','SAAT 30545 MSA'],['SAAT 30517 MSA','SAAT 30527 MSA','SAAT 30537 MSA','SAAT 30547 MSA']]},
  {id:'ReadyMade45',category:'ready-made',title:'Ready Made Abutment (Ø4.5 R)',subtitle:'Dual purpose · Torque 30N',price:5000,tableType2:'hxc',colLabels:['C1','C2','C3','C4','C5','C6'],rowLabels:['H 4.0','H 5.5','H 7.0'],codeMatrix:[['SAAT 45514 SA','SAAT 45524 SA','SAAT 45534 SA','SAAT 45544 SA','',''],['SAAT 45515 SA','SAAT 45525 SA','SAAT 45535 SA','SAAT 45545 SA','SAAT 45555 SA','SAAT 45565 SA'],['SAAT 45517 SA','SAAT 45527 SA','SAAT 45537 SA','SAAT 45547 SA','SAAT 45557 SA','SAAT 45567 SA']]},
  {id:'ReadyMade55',category:'ready-made',title:'Ready Made Abutment (Ø5.5 R)',subtitle:'Dual purpose · Torque 30N',price:5000,tableType2:'hxc',colLabels:['C1','C2','C3','C4','C5','C6'],rowLabels:['H 4.0','H 5.5','H 7.0'],codeMatrix:[['SAAT 55614 SA','SAAT 55624 SA','SAAT 55634 SA','SAAT 55644 SA','',''],['SAAT 55615 SA','SAAT 55625 SA','SAAT 55635 SA','SAAT 55645 SA','SAAT 55655 SA','SAAT 55665 SA'],['SAAT 55617 SA','SAAT 55627 SA','SAAT 55637 SA','SAAT 55647 SA','SAAT 55657 SA','SAAT 55667 SA']]},
  {id:'ReadyMade65',category:'ready-made',title:'Ready Made Abutment (Ø6.5 R)',subtitle:'Dual purpose · Torque 30N',price:5000,tableType2:'hxc',colLabels:['C1','C2','C3','C4','C5','C6'],rowLabels:['H 4.0','H 5.5','H 7.0'],codeMatrix:[['SAAT 65714 SA','SAAT 65724 SA','SAAT 65734 SA','SAAT 65744 SA','',''],['SAAT 65715 SA','SAAT 65725 SA','SAAT 65735 SA','SAAT 65745 SA','SAAT 65755 SA','SAAT 65765 SA'],['SAAT 65717 SA','SAAT 65727 SA','SAAT 65737 SA','SAAT 65747 SA','SAAT 65757 SA','SAAT 65767 SA']]},
  {id:'TiBase',category:'ti-base',title:'Ti-base Abutment',subtitle:'Ti+Zr CAD/CAM · H=4mm',price:3800,tableType:'simple',rows:[{label:'Ø4.0',type:'N',items:[{code:'Tibs-011 MSA',size:'H=4mm'}]},{label:'Ø4.5',type:'R',items:[{code:'Tibs-012 SA',size:'H=4mm'}]}]},
  {id:'PreMilledN10',category:'pre-milled',title:'Pre-Milled Abutment (N · H10)',subtitle:'Milling compatible · Torque 20N',price:6000,tableType:'simple',rows:[{label:'AM',type:'N',items:[{code:'PLAM10H AM',size:'Hex'},{code:'PLAM10N AM',size:'NonHex'}]},{label:'VH',type:'N',items:[{code:'PLAM10H VH',size:'Hex'},{code:'PLAM10N VH',size:'NonHex'}]},{label:'RD',type:'N',items:[{code:'PLAM10H RD',size:'Hex'},{code:'PLAM10N RD',size:'NonHex'}]},{label:'II',type:'N',items:[{code:'PLAM10H II',size:'Hex'},{code:'PLAM10N II',size:'NonHex'}]}]},
  {id:'PreMilledR10',category:'pre-milled',title:'Pre-Milled Abutment (R · H10)',subtitle:'Milling compatible · Torque 30N',price:6000,tableType:'simple',rows:[{label:'AM',type:'R',items:[{code:'PLAR10H AM',size:'Hex'},{code:'PLAR10N AM',size:'NonHex'}]},{label:'VH',type:'R',items:[{code:'PLAR10H VH',size:'Hex'},{code:'PLAR10N VH',size:'NonHex'}]},{label:'RD',type:'R',items:[{code:'PLAR10H RD',size:'Hex'},{code:'PLAR10N RD',size:'NonHex'}]},{label:'II',type:'R',items:[{code:'PLAR10H II',size:'Hex'},{code:'PLAR10N II',size:'NonHex'}]}]},
  {id:'MultiUnit',category:'multi-unit',title:'Multi Unit (All-on-X)',subtitle:'Multi Abutment / Scan-Body / Ti-base',price:5500,tableType:'simple',rows:[{label:'Multi Abutment',type:'N',items:[{code:'DBTS MUA',size:'D Ø4.8'}]},{label:'Multi Scan-Body',type:'N',items:[{code:'AMSB48',size:'N+R'}]},{label:'3D LAB Analog N',type:'N',items:[{code:'DLAAF3415S',size:'Narrow'}]},{label:'3D LAB Analog R',type:'R',items:[{code:'DLAAF4015S',size:'Regular'}]}]},
  {id:'GeoMedi3DAnalog',category:'3d-analog',title:'3D-Analog (GeoMedi)',subtitle:'Stone & 3D printed model',price:3200,tableType:'simple',rows:[{label:'N',type:'N',items:[{code:'3D-ASR',size:'Standard'}]},{label:'R',type:'R',items:[{code:'3D-SURO',size:'Standard'}]}]},
];
// ============================================================
// SHOP
// ============================================================
const SHOP_CATEGORIES = [
  { id:'scan-body',   name:'Scan Body',   desc:'Intra-Oral / Model / GeoMedi', color:'from-blue-500 to-blue-800',
    svg:'<svg viewBox="0 0 52 72" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="26" cy="13" rx="20" ry="8" fill="white" opacity=".9"/><path d="M6 13 L14 54 L38 54 L46 13 Z" fill="white" opacity=".82"/><rect x="18" y="53" width="16" height="7" rx="2" fill="white" opacity=".7"/><rect x="16" y="59" width="20" height="7" rx="2.5" fill="white" opacity=".5"/></svg>' },
  { id:'q-base',      name:'Q-Base',      desc:'Zirconia Abutment',            color:'from-amber-400 to-amber-700',
    svg:'<svg viewBox="0 0 52 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="21" y="6" width="10" height="20" rx="2" fill="white" opacity=".85"/><rect x="18" y="11" width="16" height="1.5" rx="1" fill="white" opacity=".4"/><rect x="18" y="15" width="16" height="1.5" rx="1" fill="white" opacity=".4"/><rect x="18" y="19" width="16" height="1.5" rx="1" fill="white" opacity=".4"/><rect x="16" y="26" width="20" height="14" rx="2" fill="white" opacity=".82"/><rect x="12" y="39" width="28" height="8" rx="2" fill="white" opacity=".78"/><ellipse cx="26" cy="47" rx="19" ry="7" fill="white" opacity=".92"/><rect x="17" y="47" width="18" height="8" rx="1" fill="white" opacity=".65"/><ellipse cx="26" cy="55" rx="13" ry="5" fill="white" opacity=".5"/></svg>' },
  { id:'ready-made',  name:'Ready Made',  desc:'Ø3.0 · Ø4.5 · Ø5.5 · Ø6.5',  color:'from-slate-500 to-slate-800',
    svg:'<svg viewBox="0 0 44 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 4 L13 22 L31 22 Z" fill="white" opacity=".9"/><rect x="13" y="21" width="18" height="27" rx="2" fill="white" opacity=".85"/><rect x="11" y="47" width="22" height="7" rx="2" fill="white" opacity=".7"/><rect x="9" y="53" width="26" height="8" rx="2.5" fill="white" opacity=".5"/></svg>' },
  { id:'ti-base',     name:'Ti-Base',     desc:'CAD/CAM · Ti+Zr',             color:'from-cyan-500 to-cyan-800',
    svg:'<svg viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="25" cy="13" rx="15" ry="7" fill="white" opacity=".8"/><rect x="10" y="13" width="30" height="18" rx="2" fill="white" opacity=".85"/><rect x="13" y="30" width="24" height="8" rx="2" fill="white" opacity=".7"/><rect x="11" y="37" width="28" height="8" rx="2.5" fill="white" opacity=".5"/></svg>' },
  { id:'pre-milled',  name:'Pre-Milled',  desc:'N · H10 / R · H10',           color:'from-indigo-600 to-indigo-900',
    svg:'<svg viewBox="0 0 58 62" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="29" cy="14" rx="23" ry="11" fill="white" opacity=".9"/><rect x="21" y="14" width="16" height="20" rx="2" fill="white" opacity=".82"/><rect x="17" y="33" width="24" height="8" rx="2" fill="white" opacity=".7"/><rect x="15" y="40" width="28" height="8" rx="2.5" fill="white" opacity=".5"/></svg>' },
  { id:'multi-unit',  name:'Multi Unit',  desc:'All-on-X',                    color:'from-violet-600 to-violet-900',
    svg:'<svg viewBox="0 0 62 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="26" y="3" width="10" height="16" rx="2" fill="white" opacity=".9"/><rect x="14" y="17" width="34" height="10" rx="3" fill="white" opacity=".78"/><rect x="7" y="25" width="10" height="22" rx="2" fill="white" opacity=".72"/><rect x="22" y="25" width="18" height="22" rx="2" fill="white" opacity=".72"/><rect x="45" y="25" width="10" height="22" rx="2" fill="white" opacity=".72"/></svg>' },
  { id:'3d-analog',   name:'3D Analog',   desc:'GeoMedi',                     color:'from-teal-500 to-teal-800',
    svg:'<svg viewBox="0 0 44 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="5" width="12" height="12" rx="2" fill="white" opacity=".9"/><rect x="12" y="16" width="20" height="30" rx="2" fill="white" opacity=".82"/><rect x="15" y="20" width="5" height="22" rx="1" fill="white" opacity=".4"/><rect x="24" y="20" width="5" height="22" rx="1" fill="white" opacity=".4"/><rect x="13" y="45" width="18" height="7" rx="2" fill="white" opacity=".7"/><rect x="11" y="51" width="22" height="8" rx="2.5" fill="white" opacity=".5"/></svg>' },
];
function renderShop() {
  document.getElementById('shopCategoryList').innerHTML = SHOP_CATEGORIES.map(function(cat) {
    var count = PRODUCTS.filter(function(p){ return p.category === cat.id; }).length;
    return '<button onclick="openShopCategory(\'' + cat.id + '\')" ' +
      'class="relative overflow-hidden rounded-2xl bg-gradient-to-br ' + cat.color + ' flex items-center gap-4 px-4 py-4 text-left shadow-sm active:scale-[.97] transition">' +
      '<div class="w-12 h-12 shrink-0 flex items-center justify-center">' + cat.svg + '</div>' +
      '<div class="flex-1 min-w-0">' +
        '<p class="font-black text-white text-sm leading-tight">' + cat.name + '</p>' +
        '<p class="text-[9px] font-medium mt-0.5 leading-snug" style="color:rgba(255,255,255,0.6)">' + cat.desc + '</p>' +
        '<p class="text-[9px] font-black mt-2" style="color:rgba(255,255,255,0.45)">' + count + ' ' + t('shop_product_count') + '</p>' +
      '</div>' +
      '<span class="text-lg leading-none shrink-0" style="color:rgba(255,255,255,0.35)">›</span>' +
    '</button>';
  }).join('');
  renderMyShopOrders();
}
async function renderMyShopOrders() {
  var container = document.getElementById('myShopOrdersList');
  if (!container) return;
  container.innerHTML = '<p class="text-center text-slate-400 text-xs py-3 font-bold">로딩 중...</p>';

  // Supabase에서 본인 주문만 조회
  var orders = [];
  try {
    var nick = currentUser && currentUser.nickname;
    var rows  = await sbGetShopOrders(nick, false); // isAdmin=false → 본인 것만
    orders = rows.map(function(r) {
      return {
        id:          r.id,
        date:        r.date,
        clinic:      r.clinic,
        phone:       r.phone,
        address:     r.addr,
        lineId:      r.line_id,
        nickname:    r.user_nickname,
        items:       r.items || [],
        stage:       r.stage,
        carrier:     r.carrier     || '',
        tracking:    r.tracking_number || '',
        totalAmount: (r.items || []).reduce(function(s,i){ return s+(i.price||0)*(i.qty||1); }, 0),
      };
    });
    // localStorage 캐시 업데이트
    localStorage.setItem('dentalk_shop_orders', JSON.stringify(orders));
  } catch(e) {
    console.warn('[MyShopOrders]', e);
    // 네트워크 오류 시 localStorage 폴백
    var cached = JSON.parse(localStorage.getItem('dentalk_shop_orders') || '[]');
    var nick = currentUser && currentUser.nickname;
    orders = nick ? cached.filter(function(o){ return o.nickname === nick; }) : cached;
  }

  _renderMyShopOrdersList(container, orders);
}
function _renderMyShopOrdersList(container, orders) {
  if (!orders.length) {
    container.innerHTML = '<p class="text-center text-slate-400 text-xs py-3 font-bold">주문 내역이 없습니다.</p>';
    return;
  }
  var html = SHOP_STAGES.map(function(stage){
    var stageOrders = orders.filter(function(o){ return o.stage === stage.key; });
    if (!stageOrders.length) return '';
    var ordersHtml = stageOrders.map(function(o){
      var itemsHtml = (o.items||[]).map(function(i){
        return '<div class="flex justify-between text-[10px] gap-1"><span class="flex-1 font-bold truncate">' + i.name + '</span><span class="font-mono text-slate-400">' + i.code + '</span><span class="font-black">×' + i.qty + '</span><span class="font-mono font-black">' + ((i.price||0)*(i.qty||1)).toLocaleString() + '</span></div>';
      }).join('');
      var total = o.totalAmount || (o.items||[]).reduce(function(s,i){ return s+(i.price||0)*(i.qty||1); }, 0);
      return '<div class="bg-slate-50 rounded-xl p-3 mb-2">' +
        '<div class="flex justify-between items-center mb-1">' +
          '<p class="font-black text-slate-700 text-xs">' + (o.clinic||'-') + '</p>' +
          '<p class="text-[8px] font-bold text-slate-400 font-mono">' + o.id + '</p>' +
        '</div>' +
        '<p class="text-[9px] text-slate-400 mb-2">📅 ' + (o.date||'') + (o.carrier ? ' · 🚚 ' + o.carrier + (o.tracking ? ' ' + o.tracking : '') : '') + '</p>' +
        '<div class="space-y-0.5 mb-2">' + itemsHtml + '</div>' +
        '<p class="text-xs font-black text-blue-800 text-right">합계 ' + total.toLocaleString() + ' THB</p>' +
      '</div>';
    }).join('');
    return '<div class="mb-4">' +
      '<div class="flex items-center gap-2 mb-2">' +
        '<span>' + stage.icon + '</span>' +
        '<span class="font-black text-slate-700 text-xs">' + stage.label + '</span>' +
        '<span class="bg-blue-100 text-blue-700 font-black text-[9px] px-2 py-0.5 rounded-full">' + stageOrders.length + '건</span>' +
      '</div>' +
      ordersHtml +
    '</div>';
  }).join('');
  container.innerHTML = html || '<p class="text-center text-slate-400 text-xs py-3 font-bold">주문 내역이 없습니다.</p>';
}
function openShopCategory(catId) {
  if (LOCKED.includes('shop') && !isLoggedIn()) { openLoginModal('shop'); return; }
  var cat = SHOP_CATEGORIES.find(function(c){ return c.id === catId; });
  if (!cat) return;
  renderShopItems(catId);
  goDetailPage('shop-items', cat.name, 'shop');
}
function renderShopItems(catId) {
  var cat = SHOP_CATEGORIES.find(function(c){ return c.id === catId; });
  var items = PRODUCTS.filter(function(p){ return p.category === catId; });
  document.getElementById('shopItemsList').innerHTML = items.map(function(p) {
    var inStock = isInStock(p.id);
    var stockHtml = inStock
      ? '<span class="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✅ ' + t('shop_in_stock') + '</span>'
      : '<span class="text-[9px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full">❌ ' + t('shop_out_of_stock') + '</span>';
    var clickAttr = inStock ? 'onclick="openOrder(\'' + p.id + '\')"' : '';
    return '<div ' + clickAttr + ' class="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100' + (inStock ? ' cursor-pointer active:scale-[.98] transition' : ' opacity-55') + '">' +
      '<div class="h-1 bg-gradient-to-r ' + (cat ? cat.color : 'from-slate-400 to-slate-600') + '"></div>' +
      '<div class="p-4 flex items-center gap-3">' +
        '<div class="flex-1 min-w-0">' +
          '<h3 class="font-black text-slate-800 text-sm leading-tight">' + p.title + '</h3>' +
          '<p class="text-[9px] text-slate-400 font-bold uppercase mt-0.5 leading-tight">' + p.subtitle + '</p>' +
          '<div class="mt-2">' + stockHtml + '</div>' +
        '</div>' +
        '<div class="text-right shrink-0 pl-2">' +
          '<p class="text-[10px] text-slate-400 font-bold leading-none">฿</p>' +
          '<p class="font-black text-blue-700 text-base font-mono leading-tight">' + p.price.toLocaleString() + '</p>' +
          (inStock ? '<p class="text-[9px] text-blue-400 font-black mt-1.5 uppercase">' + t('shop_select') + '</p>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}
function openOrder(pid) {
  currentProd = PRODUCTS.find(function(p){ return p.id === pid; });
  if (!currentProd) return;
  tableQtys = {};
  renderProductPage();
  goDetailPage('shop-product', currentProd.title, 'shop-items');
}

// ── Product detail page ───────────────────────────────────────
var _catGrads = {
  'scan-body':  'linear-gradient(135deg,#3b82f6 0%,#1e3a8a 100%)',
  'q-base':     'linear-gradient(135deg,#f59e0b 0%,#92400e 100%)',
  'ready-made': 'linear-gradient(135deg,#64748b 0%,#1e293b 100%)',
  'ti-base':    'linear-gradient(135deg,#06b6d4 0%,#164e63 100%)',
  'pre-milled': 'linear-gradient(135deg,#4f46e5 0%,#312e81 100%)',
  'multi-unit': 'linear-gradient(135deg,#7c3aed 0%,#4c1d95 100%)',
  '3d-analog':  'linear-gradient(135deg,#14b8a6 0%,#134e4a 100%)',
};
function renderProductPage() {
  var p = currentProd;
  var cat = SHOP_CATEGORIES.find(function(c){ return c.id === p.category; });
  var inStock = isInStock(p.id);
  var hero = document.getElementById('shopProductHero');
  if (hero) hero.style.background = _catGrads[p.category] || _catGrads['scan-body'];
  var iconArea = document.getElementById('shopProductIconArea');
  if (iconArea && cat) iconArea.innerHTML = cat.svg;
  var badge = document.getElementById('shopProductStockBadge');
  if (badge) {
    badge.textContent = (inStock ? '✅ ' : '❌ ') + t(inStock ? 'shop_in_stock' : 'shop_out_of_stock');
    badge.className = 'inline-flex items-center gap-1 text-[9px] font-black px-2.5 py-1 rounded-full mb-3 ' +
      (inStock ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200');
  }
  var titleEl = document.getElementById('shopProductTitle');
  if (titleEl) titleEl.textContent = p.title;
  var subEl = document.getElementById('shopProductSub');
  if (subEl) subEl.textContent = p.subtitle;
  var priceEl = document.getElementById('shopProductPrice');
  if (priceEl) priceEl.textContent = p.price.toLocaleString();
  var errEl = document.getElementById('productOrderError');
  if (errEl) errEl.classList.add('hidden');
  var addBtn = document.getElementById('shopProductAddBtn');
  if (addBtn) { addBtn.disabled = !inStock; addBtn.style.opacity = inStock ? '1' : '0.5'; addBtn.textContent = t('order_add_cart'); }
  renderProductTable();
}
function renderProductTable() {
  var p = currentProd;
  var qCell = function(code) {
    var safe = code.replace(/\s/g,'_');
    return '<div class="flex flex-col items-center gap-1">' +
      '<p class="text-[8px] font-mono text-slate-400 leading-none whitespace-nowrap">' + code + '</p>' +
      '<div class="flex items-center gap-0.5">' +
        '<button onclick="stepQ(\'' + code + '\',-1)" class="w-6 h-6 rounded-full bg-slate-100 font-black text-xs leading-none flex items-center justify-center active:bg-slate-200" type="button">−</button>' +
        '<input type="number" min="0" value="0" class="qty-input w-10 h-7 rounded-lg bg-slate-50 text-xs font-black text-center border border-slate-200 outline-none focus:border-blue-400" id="qi-' + safe + '" oninput="tableQtys[\'' + code + '\']=parseInt(this.value)||0">' +
        '<button onclick="stepQ(\'' + code + '\',1)" class="w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-black text-xs leading-none flex items-center justify-center active:bg-blue-100" type="button">+</button>' +
      '</div>' +
    '</div>';
  };
  var html = '';
  if (p.tableType2 === 'hxc') {
    html = '<div class="overflow-x-auto"><table class="w-full text-xs"><thead><tr>' +
      '<th class="text-left pb-3 text-[10px] font-bold text-slate-400 pr-3 whitespace-nowrap sticky left-0 bg-white">H / C</th>';
    p.colLabels.forEach(function(c){ html += '<th class="pb-3 text-[10px] font-black text-slate-500 px-2 whitespace-nowrap">' + c + '</th>'; });
    html += '</tr></thead><tbody>';
    p.rowLabels.forEach(function(row, ri) {
      html += '<tr class="border-t border-slate-100"><td class="py-2 pr-3 font-black text-xs text-slate-700 whitespace-nowrap sticky left-0 bg-white">' + row + '</td>';
      p.colLabels.forEach(function(col, ci) {
        var code = p.codeMatrix[ri][ci];
        html += '<td class="py-2 px-1 text-center">' + (code ? qCell(code) : '<span class="text-slate-200">—</span>') + '</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
  } else if (p.tableType === 'dh') {
    html = '<div class="overflow-x-auto"><table class="w-full text-xs"><thead><tr>' +
      '<th class="text-left pb-3 text-[10px] font-bold text-slate-400 pr-3 whitespace-nowrap sticky left-0 bg-white">D / H</th>';
    p.heights.forEach(function(h){ html += '<th class="pb-3 text-[10px] font-black text-slate-500 px-2">' + h + '</th>'; });
    html += '</tr></thead><tbody>';
    p.connections.forEach(function(conn, ci) {
      html += '<tr class="border-t border-slate-100">' +
        '<td class="py-2 pr-3 whitespace-nowrap sticky left-0 bg-white">' +
          '<div class="flex items-center gap-1.5"><span class="text-[9px] font-black px-1.5 py-0.5 rounded-md tag-' + conn.type + '">' + conn.type + '</span>' +
          '<span class="font-black text-xs text-slate-700">' + conn.label + '</span></div>' +
        '</td>';
      p.heights.forEach(function(h, hi) {
        var code = p.codes[ci][hi];
        html += '<td class="py-2 px-1 text-center">' + (code ? qCell(code) : '<span class="text-slate-200">—</span>') + '</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
  } else if (p.tableType === 'simple') {
    html = '<div class="space-y-3">';
    p.rows.forEach(function(row) {
      html += '<div class="bg-slate-50 rounded-xl p-3.5">' +
        '<div class="flex items-center gap-2 mb-3">' +
          '<span class="text-[9px] font-black px-2 py-0.5 rounded-md tag-' + row.type + '">' + row.type + '</span>' +
          '<span class="font-black text-xs text-slate-700">' + row.label + '</span>' +
        '</div>' +
        '<div class="space-y-2">';
      row.items.forEach(function(item) {
        html += '<div class="flex items-center justify-between gap-2">' +
          '<div class="min-w-0">' +
            '<p class="text-[10px] font-black text-slate-700 font-mono">' + item.code + '</p>' +
            '<p class="text-[9px] text-slate-400 font-medium">' + (item.size||'') + '</p>' +
          '</div>' +
          '<div class="flex items-center gap-0.5 shrink-0">' +
            '<button onclick="stepQ(\'' + item.code + '\',-1)" class="w-6 h-6 rounded-full bg-slate-200 font-black text-xs leading-none flex items-center justify-center active:bg-slate-300" type="button">−</button>' +
            '<input type="number" min="0" value="0" class="qty-input w-10 h-7 rounded-lg bg-white text-xs font-black text-center border border-slate-200 outline-none" id="qi-' + item.code.replace(/\s/g,'_') + '" oninput="tableQtys[\'' + item.code + '\']=parseInt(this.value)||0">' +
            '<button onclick="stepQ(\'' + item.code + '\',1)" class="w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-black text-xs leading-none flex items-center justify-center active:bg-blue-100" type="button">+</button>' +
          '</div>' +
        '</div>';
      });
      html += '</div></div>';
    });
    html += '</div>';
  }
  var tableEl = document.getElementById('shopProductTable');
  if (tableEl) tableEl.innerHTML = html;
}
function addProductToCart() {
  var items = Object.entries(tableQtys).filter(function(e){ return e[1] > 0; });
  if (!items.length) {
    var errEl = document.getElementById('productOrderError');
    if (errEl) errEl.classList.remove('hidden');
    return;
  }
  items.forEach(function(e) {
    var code = e[0], qty = e[1];
    var ex = cart.find(function(c){ return c.code === code; });
    if (ex) ex.qty += qty;
    else cart.push({name:currentProd.title, code:code, price:currentProd.price, qty:qty});
  });
  updateBadge();
  tableQtys = {};
  document.querySelectorAll('#shopProductTable .qty-input').forEach(function(inp){ inp.value = 0; });
  var btn = document.getElementById('shopProductAddBtn');
  if (btn) { btn.textContent = '✅ ' + t('cart_added'); setTimeout(function(){ btn.textContent = t('order_add_cart'); }, 1800); }
}
function renderOrderTable() {
  var p = currentProd;
  var html = '';
  if (p.tableType2 === 'hxc') {
    html = '<div class="overflow-x-auto"><table class="w-full text-xs"><thead><tr><th class="text-left pb-2 text-slate-400 font-bold text-[10px] pr-2">H / C</th>';
    p.colLabels.forEach(function(c){ html += '<th class="text-center pb-2 text-slate-500 font-black text-[10px] px-1">' + c + '</th>'; });
    html += '</tr></thead><tbody>';
    p.rowLabels.forEach(function(row, ri) {
      html += '<tr class="border-t border-slate-100"><td class="py-3 pr-2 font-black text-xs text-slate-700 whitespace-nowrap">' + row + '</td>';
      p.colLabels.forEach(function(col, ci) {
        var code = p.codeMatrix[ri][ci];
        html += code
          ? '<td class="py-2 px-1"><div class="flex flex-col items-center gap-1"><span class="text-[10px] text-slate-600 font-mono text-center font-bold leading-tight">' + code + '</span><div class="flex items-center gap-0.5"><button onclick="stepQ(\'' + code.replace(/'/g,"\\'") + '\',-1)" class="w-5 h-5 rounded-full bg-slate-200 font-black text-[10px] flex items-center justify-center leading-none">−</button><input type="number" min="0" value="0" class="qty-input" id="qi-' + code.replace(/\s/g,'_') + '" oninput="tableQtys[\'' + code + '\']=parseInt(this.value)||0"><button onclick="stepQ(\'' + code.replace(/'/g,"\\'") + '\',1)" class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 font-black text-[10px] flex items-center justify-center leading-none">+</button></div></div></td>'
          : '<td class="py-3 px-1 text-center text-slate-200">-</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
  } else if (p.tableType === 'dh') {
    html = '<div class="overflow-x-auto"><table class="w-full text-xs"><thead><tr><th class="text-left pb-2 text-slate-400 font-bold text-[10px] pr-2">D / H</th>';
    p.heights.forEach(function(h){ html += '<th class="text-center pb-2 text-slate-500 font-black px-1">' + h + '</th>'; });
    html += '</tr></thead><tbody>';
    p.connections.forEach(function(conn, ci) {
      html += '<tr class="border-t border-slate-100"><td class="py-3 pr-2 whitespace-nowrap"><div class="flex items-center gap-1.5"><span class="text-[9px] font-black px-1.5 py-0.5 rounded-md tag-' + conn.type + '">' + conn.type + '</span><span class="font-black text-xs text-slate-700">' + conn.label + '</span></div></td>';
      p.heights.forEach(function(h, hi) {
        var code = p.codes[ci][hi];
        html += '<td class="py-2 px-1"><div class="flex flex-col items-center gap-1"><span class="text-[10px] text-slate-600 font-mono text-center font-bold leading-tight">' + code + '</span><div class="flex items-center gap-0.5"><button onclick="stepQ(\'' + code.replace(/'/g,"\\'") + '\',-1)" class="w-5 h-5 rounded-full bg-slate-200 font-black text-[10px] flex items-center justify-center leading-none">−</button><input type="number" min="0" value="0" class="qty-input" id="qi-' + code.replace(/\s/g,'_') + '" oninput="tableQtys[\'' + code + '\']=parseInt(this.value)||0"><button onclick="stepQ(\'' + code.replace(/'/g,"\\'") + '\',1)" class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 font-black text-[10px] flex items-center justify-center leading-none">+</button></div></div></td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
  } else {
    html = '<div class="space-y-2">';
    p.rows.forEach(function(row) {
      row.items.forEach(function(item) {
        html += '<div class="bg-slate-50 rounded-2xl p-4 flex justify-between items-center">' +
          '<div class="flex-1"><div class="flex items-center gap-2 mb-1"><span class="text-[9px] font-black px-1.5 py-0.5 rounded-md tag-' + row.type + '">' + row.type + '</span><span class="font-black text-xs text-slate-700">' + row.label + '</span><span class="text-[9px] text-slate-400 font-bold">' + item.size + '</span></div><p class="text-xs text-slate-700 font-mono font-black">' + item.code + '</p></div>' +
          '<div class="flex items-center gap-2 ml-3">' +
            '<button onclick="stepQ(\'' + item.code + '\',-1)" class="w-7 h-7 rounded-full bg-slate-200 font-black text-sm flex items-center justify-center">−</button>' +
            '<input type="number" min="0" value="0" class="qty-input" id="qi-' + item.code.replace(/\s/g,'_') + '" oninput="tableQtys[\'' + item.code + '\']=parseInt(this.value)||0">' +
            '<button onclick="stepQ(\'' + item.code + '\',1)" class="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-black text-sm flex items-center justify-center">+</button>' +
          '</div></div>';
      });
    });
    html += '</div>';
  }
  html += '<p class="text-[9px] text-slate-400 mt-3 text-center font-bold">' + p.price.toLocaleString() + ' THB / ' + t('shop_each') + '</p>';
  document.getElementById('orderTable').innerHTML = html;
}
function stepQ(code, d) {
  var el = document.getElementById('qi-' + code.replace(/\s/g,'_'));
  if (!el) return;
  var v = Math.max(0, (parseInt(el.value)||0) + d);
  el.value = v; tableQtys[code] = v;
}
function addTableToCart() {
  var items = Object.entries(tableQtys).filter(function(e){ return e[1]>0; });
  if (!items.length) { document.getElementById('orderError').classList.remove('hidden'); return; }
  items.forEach(function(e) {
    var code=e[0], qty=e[1];
    var ex = cart.find(function(c){ return c.code===code; });
    if (ex) ex.qty += qty;
    else cart.push({name:currentProd.title, code:code, price:currentProd.price, qty:qty});
  });
  updateBadge();
  closeModal('orderModal');
}
// ============================================================
// 장바구니
// ============================================================
function updateFloatingCart() {
  var inner = document.getElementById('floatingCartInner');
  if (!inner) return;
  var count = cart.reduce(function(s,c){ return s+c.qty; }, 0);
  var total = cart.reduce(function(s,c){ return s+c.price*c.qty; }, 0);
  inner.classList.toggle('hidden', count === 0);
  if (count > 0) {
    var countEl = document.getElementById('floatingCartCountText');
    var totalEl = document.getElementById('floatingCartTotalText');
    if (countEl) countEl.textContent = count + ' ' + t('cart_bar_items');
    if (totalEl) totalEl.textContent = total.toLocaleString();
  }
}
function updateBadge() {
  var tot = cart.reduce(function(s,c){ return s+c.qty; }, 0);
  var b = document.getElementById('cartBadge');
  if (b) { b.textContent = tot; b.classList.toggle('hidden', tot===0); }
  updateFloatingCart();
}
function openCart() {
  if (!cart.length) { alert(t('cart_empty')); return; }
  renderCart(); openModal('cartModal');
}
function renderCart() {
  var total = 0;
  document.getElementById('cartItems').innerHTML = cart.map(function(item, i) {
    var sub = item.price * item.qty; total += sub;
    return '<div class="bg-slate-50 p-4 rounded-2xl">' +
      '<div class="flex justify-between items-start"><div class="flex-1 pr-2"><p class="font-black text-xs text-slate-800">' + item.name + '</p><p class="text-[9px] text-slate-400 font-mono uppercase font-bold mt-0.5">' + item.code + '</p></div>' +
      '<button onclick="removeCart(' + i + ')" class="text-red-400 font-bold text-xs">✕</button></div>' +
      '<div class="flex items-center justify-between mt-3">' +
        '<div class="flex items-center gap-2">' +
          '<button onclick="cartQty(' + i + ',-1)" class="w-7 h-7 rounded-full bg-slate-200 font-black text-sm flex items-center justify-center">−</button>' +
          '<span class="font-black text-sm w-5 text-center">' + item.qty + '</span>' +
          '<button onclick="cartQty(' + i + ',1)" class="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-black text-sm flex items-center justify-center">+</button>' +
        '</div>' +
        '<span class="font-black text-sm text-blue-900 font-mono">' + sub.toLocaleString() + ' THB</span>' +
      '</div></div>';
  }).join('');
  document.getElementById('totalPrice').textContent = total.toLocaleString() + ' THB';
}
function removeCart(i) { cart.splice(i,1); updateBadge(); if(!cart.length) closeModal('cartModal'); else renderCart(); }
function cartQty(i,n)  { cart[i].qty = Math.max(1, cart[i].qty+n); updateBadge(); renderCart(); }
function openAddressForm() {
  document.getElementById('clinicName').value  = currentUser.clinicName || '';
  document.getElementById('clinicPhone').value = currentUser.phone      || '';
  document.getElementById('fullAddress').value = currentUser.address    || '';
  document.getElementById('clinicLineId').value = '';
  closeModal('cartModal');
  openModal('addressModal');
}
var pendingShopOrder = null;
async function requestPay() {
  var clinic  = document.getElementById('clinicName').value.trim();
  var phone   = document.getElementById('clinicPhone').value.trim();
  var addr    = document.getElementById('fullAddress').value.trim();
  var lineId  = document.getElementById('clinicLineId').value.trim();
  if (!clinic||!phone||!addr) { alert(t('addr_fill_error')); return; }
  var amt = cart.reduce(function(s,c){ return s+c.price*c.qty; },0);
  var oid = 'SP-' + Date.now();
  pendingShopOrder = {
    id: oid,
    date: new Date().toLocaleDateString('ko-KR'),
    clinic: clinic, phone: phone, address: addr, lineId: lineId,
    nickname: currentUser.nickname || '',
    items: cart.map(function(c){ return {name:c.name,code:c.code,qty:c.qty,price:c.price}; }),
    totalAmount: amt,
    stage: 'submitted'
  };
  var qrUrl;
  try {
    var res = await fetch('http://localhost:3000/pay',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cart,address:clinic,phone,detailAddress:addr})});
    qrUrl = (await res.json()).qr_image;
  } catch(e) {
    qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DENTALK_' + oid + '_' + amt + 'THB';
  }
  document.getElementById('qrSummary').innerHTML =
    '<p class="font-black text-slate-500 uppercase text-[9px] mb-2">' + t('qr_summary_title') + '</p>' +
    cart.map(function(c){ return '<div class="flex justify-between gap-2 text-[10px]"><span class="flex-1">' + c.name + '</span><span class="font-mono text-slate-500">' + c.code + '</span><span class="font-black ml-1">×' + c.qty + '</span><span class="font-mono font-black ml-1">' + (c.price*c.qty).toLocaleString() + '</span></div>'; }).join('') +
    '<div class="border-t mt-2 pt-2 flex justify-between font-black text-slate-800"><span>' + t('qr_total') + '</span><span class="font-mono">' + amt.toLocaleString() + ' THB</span></div>';
  document.getElementById('qrImg').src = qrUrl;
  closeModal('addressModal'); openModal('qrModal');
}
function completePayment() {
  if (!pendingShopOrder) { cart=[]; updateBadge(); closeModal('qrModal'); goPage('shop'); return; }
  var order = pendingShopOrder;
  pendingShopOrder = null;
  // localStorage에 저장 (오프라인 폴백)
  var saved = JSON.parse(localStorage.getItem('dentalk_shop_orders') || '[]');
  saved.unshift(order);
  localStorage.setItem('dentalk_shop_orders', JSON.stringify(saved));
  // Supabase에도 저장
  sbSaveShopOrder(order).catch(function(e){ console.error('[Shop Order Save]', e); });
  // 관리자에게 LINE flex 발송
  var itemFields = order.items.map(function(i){
    return { label: i.name, value: '[' + i.code + '] ×' + i.qty + '  ' + (i.price*i.qty).toLocaleString() + ' THB' };
  });
  itemFields.push({ label: '합계', value: order.totalAmount.toLocaleString() + ' THB' });
  var adminFields = [
    { label: '주문번호', value: order.id },
    { label: '클리닉', value: order.clinic },
    { label: '날짜', value: order.date },
    { label: '연락처', value: order.phone },
    { label: '주소', value: order.address },
  ].concat(order.lineId ? [{ label: 'Line ID', value: order.lineId }] : []).concat(itemFields);
  sendLineMessage(LINE_USER_ID, [buildFlexMessage('🛒', 'คำสั่งซื้อใหม่จากร้านค้า', adminFields, 'ลูกค้าชำระเงินผ่าน QR เรียบร้อยแล้ว', 'Shop Order')]);
  // 결제완료 팝업
  document.getElementById('payCompleteSummary').innerHTML =
    '<p class="font-black text-slate-500 text-[9px] uppercase mb-2">주문번호: ' + order.id + '</p>' +
    order.items.map(function(i){ return '<div class="flex justify-between text-xs gap-2"><span class="flex-1 font-bold">' + i.name + '</span><span class="font-mono text-slate-500">' + i.code + '</span><span class="font-black ml-1">×' + i.qty + '</span><span class="font-mono font-black ml-1">' + (i.price*i.qty).toLocaleString() + '</span></div>'; }).join('') +
    '<div class="border-t mt-2 pt-2 flex justify-between font-black text-blue-800"><span>합계</span><span class="font-mono">' + order.totalAmount.toLocaleString() + ' THB</span></div>';
  cart=[]; updateBadge(); closeModal('qrModal');
  openModal('payCompleteModal');
}
function closePayComplete() { closeModal('payCompleteModal'); goPage('shop'); }
// ============================================================
// CUSTOM ABUTMENT — Wizard
// ============================================================
var wizardStep = 1;
var wizardData = { patient:'', deadline:'', teethSet: new Set(), brand:'', teethSizes:{}, shade:'', memo:'', stlFiles:[] };

function customTab(tab) {
  var activeCls  = 'flex-1 py-3 rounded-2xl font-black text-sm bg-[#001d4a] text-white shadow';
  var inactiveCls = 'flex-1 py-3 rounded-2xl font-black text-sm bg-slate-200 text-slate-500';
  ['form','list','done'].forEach(function(name) {
    var section = document.getElementById('custom-' + name);
    var btn = document.getElementById('ctab-' + name);
    if (!section || !btn) return;
    section.classList.toggle('hidden', name !== tab);
    btn.className = name === tab ? activeCls : inactiveCls;
  });
  var fBtn = document.getElementById('ctab-form');
  var lBtn = document.getElementById('ctab-list');
  var dBtn = document.getElementById('ctab-done');
  if (fBtn) fBtn.textContent = t('custom_tab_new');
  if (lBtn) lBtn.textContent = t('custom_tab_list');
  if (dBtn) dBtn.textContent = t('custom_tab_done');
  if (tab === 'form') {
    initWizard();
  } else {
    loadOrdersFromSupabase().then(function() { renderCustomOrders(); renderDoneOrders(); });
  }
}

function initWizard() {
  wizardStep = 1;
  wizardData = { patient:'', deadline:'', teethSet: new Set(), brand:'', teethSizes:{}, shade:'', memo:'', stlFiles:[] };
  // Render tooth chart
  var chartEl = document.getElementById('wizToothChart');
  if (chartEl) chartEl.innerHTML = buildWizToothChart();
  // Render brand grid
  renderWizBrandGrid();
  // Render shade grid
  renderWizShadeGrid();
  // Pre-fill delivery
  var clinicEl = document.getElementById('cust-clinic');
  var addrEl   = document.getElementById('cust-addr');
  var phoneEl  = document.getElementById('cust-phone');
  if (clinicEl) clinicEl.value = (currentUser && currentUser.clinicName) || '';
  if (addrEl)   addrEl.value   = (currentUser && currentUser.address)    || '';
  if (phoneEl)  phoneEl.value  = (currentUser && currentUser.phone)      || '';
  var lineEl = document.getElementById('cust-line');
  if (lineEl) lineEl.value = '';
  showWizardStep(1);
}

function buildWizToothChart() {
  var upper = [17,16,15,14,13,12,11,21,22,23,24,25,26,27];
  var lower = [47,46,45,44,43,42,41,31,32,33,34,35,36,37];
  function btn(num) {
    return '<button type="button" id="wiz-tooth-' + num + '" onclick="wizToggleTooth(' + num + ')" ' +
      'class="w-8 h-8 rounded-lg text-[9px] font-black border-2 border-slate-200 bg-white text-slate-500 transition active:scale-90 leading-none">' + num + '</button>';
  }
  var html = '<div class="bg-slate-50 rounded-2xl p-3 border border-slate-100">';
  html += '<p class="text-center text-[8px] font-black text-blue-400 uppercase tracking-widest mb-2">' + t('upper_jaw') + '</p>';
  html += '<div class="flex justify-center gap-1 mb-2 flex-wrap">';
  upper.forEach(function(n){ html += btn(n); });
  html += '</div>';
  html += '<div class="border-t border-dashed border-slate-200 my-2 relative"><span class="absolute left-1/2 -translate-x-1/2 -top-2 bg-white px-2 text-[8px] text-slate-300 font-bold">' + t('jaw_border') + '</span></div>';
  html += '<div class="flex justify-center gap-1 mt-2 flex-wrap">';
  lower.forEach(function(n){ html += btn(n); });
  html += '</div>';
  html += '<p class="text-center text-[8px] font-black text-amber-400 uppercase tracking-widest mt-2">' + t('lower_jaw') + '</p>';
  html += '</div>';
  return html;
}

function wizToggleTooth(num) {
  var btn = document.getElementById('wiz-tooth-' + num);
  if (wizardData.teethSet.has(num)) {
    wizardData.teethSet.delete(num);
    if (btn) btn.className = 'w-8 h-8 rounded-lg text-[9px] font-black border-2 border-slate-200 bg-white text-slate-500 transition active:scale-90 leading-none';
  } else {
    wizardData.teethSet.add(num);
    if (btn) btn.className = 'w-8 h-8 rounded-lg text-[9px] font-black border-2 border-blue-500 bg-blue-500 text-white transition active:scale-90 leading-none';
  }
  var countEl = document.getElementById('wizTeethCount');
  if (countEl) {
    var n = wizardData.teethSet.size;
    countEl.textContent = n > 0 ? n + ' ' + t('wiz_teeth_selected') : '';
  }
}

function renderWizBrandGrid() {
  var el = document.getElementById('wizBrandGrid');
  if (!el) return;
  el.innerHTML = IMPLANT_BRANDS.map(function(b) {
    return '<button type="button" id="wizBrand-' + b.replace(/\s/g,'-') + '" onclick="wizSelectBrand(\'' + b.replace(/'/g,"\\'") + '\')" ' +
      'class="py-3 px-2 rounded-2xl border-2 border-slate-200 bg-white text-xs font-black text-slate-600 active:scale-95 transition text-center">' + b + '</button>';
  }).join('');
}

function wizSelectBrand(brand) {
  wizardData.brand = brand;
  document.querySelectorAll('#wizBrandGrid button').forEach(function(btn) {
    btn.className = 'py-3 px-2 rounded-2xl border-2 border-slate-200 bg-white text-xs font-black text-slate-600 active:scale-95 transition text-center';
  });
  var sel = document.getElementById('wizBrand-' + brand.replace(/\s/g,'-'));
  if (sel) sel.className = 'py-3 px-2 rounded-2xl border-2 border-blue-500 bg-blue-500 text-white text-xs font-black active:scale-95 transition text-center';
}

function renderWizSizeTable() {
  var el = document.getElementById('wizSizeTable');
  if (!el) return;
  var teeth = Array.from(wizardData.teethSet).sort(function(a,b){return a-b;});
  el.innerHTML = teeth.map(function(tn) {
    var jaw = (tn>=11&&tn<=28)
      ? '<span class="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block mr-1"></span>'
      : '<span class="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block mr-1"></span>';
    var saved = wizardData.teethSizes[tn] || '';
    return '<div class="flex items-center gap-2">' +
      '<span class="w-9 h-9 rounded-xl bg-blue-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">' + tn + '</span>' +
      '<div class="flex-1"><p class="text-[9px] font-black text-slate-500 mb-0.5">' + jaw + getToothName(tn) + '</p>' +
        '<input type="text" id="wiz-size-' + tn + '" value="' + saved + '" placeholder="' + t('wiz_size_for_tooth') + '" ' +
        'oninput="wizardData.teethSizes[' + tn + ']=this.value" ' +
        'class="w-full p-2 bg-slate-50 rounded-xl text-xs font-bold outline-none border border-slate-200 focus:border-blue-400">' +
      '</div>' +
    '</div>';
  }).join('');
}

var VITA_BG = {
  'A1':'#f5ede0','A2':'#f2e5d0','A3':'#efdcc0','A3.5':'#ecce9e','A4':'#d4a86a',
  'B1':'#f7eedf','B2':'#f3e7cd','B3':'#e8d7aa','C1':'#f0e9de','C2':'#dfd3bb',
  'C3':'#c9b88e','D2':'#f3e4c8','D3':'#d9c298','BL (Bleach)':'#f9f5ee'
};

function renderWizShadeGrid() {
  var el = document.getElementById('wizShadeGrid');
  if (!el) return;
  el.innerHTML = TOOTH_COLORS.map(function(c) {
    var bg = VITA_BG[c] || '#f5f5f5';
    return '<button type="button" id="wizShade-' + c.replace(/[\s().]/g,'-') + '" onclick="wizSelectShade(\'' + c.replace(/'/g,"\\'") + '\')" ' +
      'style="background:' + bg + '" ' +
      'class="py-3 rounded-xl border-2 border-slate-200 text-[10px] font-black text-slate-700 active:scale-95 transition">' + c + '</button>';
  }).join('');
}

function wizSelectShade(shade) {
  wizardData.shade = shade;
  document.querySelectorAll('#wizShadeGrid button').forEach(function(btn) {
    btn.style.borderColor = '#e2e8f0';
    btn.style.boxShadow = '';
  });
  var sel = document.getElementById('wizShade-' + shade.replace(/[\s().]/g,'-'));
  if (sel) { sel.style.borderColor = '#3b82f6'; sel.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.3)'; }
  var lbl = document.getElementById('wizShadeSelected');
  if (lbl) lbl.textContent = shade;
}

function wizOnStlDragOver(e) {
  e.preventDefault(); e.stopPropagation();
  var d = document.getElementById('wiz-stl-drop');
  if (d) { d.style.borderColor='#3b82f6'; d.style.background='#eff6ff'; }
}
function wizOnStlDragLeave(e) {
  e.preventDefault(); e.stopPropagation();
  var d = document.getElementById('wiz-stl-drop');
  if (d) { d.style.borderColor=''; d.style.background=''; }
}
function wizOnStlDrop(e) {
  e.preventDefault(); e.stopPropagation();
  var d = document.getElementById('wiz-stl-drop');
  if (d) { d.style.borderColor=''; d.style.background=''; }
  var files = Array.from(e.dataTransfer.files).slice(0, 10);
  if (!files.length) return;
  wizardData.stlFiles = wizardData.stlFiles.concat(files).slice(0, 10);
  updateWizStlDropUI();
}
function wizOnStlSelect(input) {
  wizardData.stlFiles = Array.from(input.files).slice(0, 10);
  updateWizStlDropUI();
}
function _wizFileIcon(filename) {
  var ext = (filename || '').split('.').pop().toLowerCase();
  if (['stl','ply','obj','3mf'].indexOf(ext) !== -1) return '🧊';
  if (['jpg','jpeg','png','gif','webp','bmp','svg','heic'].indexOf(ext) !== -1) return '🖼';
  if (ext === 'pdf') return '📄';
  if (['doc','docx'].indexOf(ext) !== -1) return '📝';
  if (['zip','rar','7z'].indexOf(ext) !== -1) return '🗜';
  return '📎';
}
function updateWizStlDropUI() {
  var d = document.getElementById('wiz-stl-drop');
  if (!d) return;
  var files = wizardData.stlFiles;
  if (!files.length) return;
  var totalKB = files.reduce(function(s,f){ return s+f.size/1024; },0);
  // Prevent drop zone click from re-opening file picker when clicking preview
  d.onclick = null;
  var list = files.map(function(f, i) {
    var icon = _wizFileIcon(f.name);
    return '<div class="flex items-center gap-2 py-1 border-b border-green-100 last:border-0">' +
      '<span class="text-base shrink-0">' + icon + '</span>' +
      '<span class="flex-1 text-[9px] text-green-800 font-bold truncate min-w-0">' + f.name + '</span>' +
      '<span class="text-[8px] text-slate-400 shrink-0">(' + (f.size/1024).toFixed(0) + 'KB)</span>' +
      '<button type="button" onclick="event.stopPropagation();openFileViewerFromFile(wizardData.stlFiles[' + i + '])" ' +
        'class="shrink-0 px-1.5 py-0.5 bg-blue-600 text-white rounded-md font-black text-[8px] active:scale-95 transition ml-1">👁</button>' +
    '</div>';
  }).join('');
  d.innerHTML =
    '<div class="flex items-center justify-between mb-2">' +
      '<p class="text-xs font-black text-green-700">✅ ' + files.length + ' files · ' + totalKB.toFixed(0) + 'KB</p>' +
      '<button type="button" onclick="event.stopPropagation();document.getElementById(\'wiz-stl-input\').click()" ' +
        'class="text-[9px] font-black text-blue-600 px-2 py-1 bg-blue-50 rounded-lg active:scale-95 transition">+ 추가</button>' +
    '</div>' +
    '<div class="text-left">' + list + '</div>';
  d.className = 'border-2 border-green-200 rounded-xl p-3 bg-green-50 transition-colors';
}

function renderWizSummary() {
  var el = document.getElementById('wizSummary');
  if (!el) return;
  var teeth = Array.from(wizardData.teethSet).sort(function(a,b){return a-b;});
  var teethHtml = teeth.map(function(tn) {
    var sz = wizardData.teethSizes[tn] || '—';
    var isUpper = tn>=11&&tn<=28;
    var dot = isUpper
      ? '<span class="w-2 h-2 rounded-full bg-blue-400 inline-block mr-1"></span>'
      : '<span class="w-2 h-2 rounded-full bg-amber-400 inline-block mr-1"></span>';
    return '<div class="flex items-center gap-2 py-1 border-b border-slate-50 last:border-0">' +
      '<span class="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 text-[9px] font-black flex items-center justify-center shrink-0">' + tn + '</span>' +
      '<span class="flex-1 text-[10px] font-black text-slate-700">' + dot + getToothName(tn) + '</span>' +
      '<span class="text-[9px] text-slate-500 font-bold">' + sz + '</span>' +
    '</div>';
  }).join('');
  el.innerHTML =
    '<div class="rounded-xl bg-slate-50 p-3 mb-2">' +
      '<div class="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2"><span>' + t('case_patient_ph').split(' ')[0] + '</span><span class="text-slate-800">' + (wizardData.patient || t('anon_patient')) + '</span></div>' +
      '<div class="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2"><span>' + t('brand_ph').split(' ').slice(1).join(' ') + '</span><span class="text-slate-800">' + (wizardData.brand || '—') + '</span></div>' +
      '<div class="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2"><span>' + t('wiz_shade_label').split(' ')[0] + '</span><span class="text-slate-800">' + (wizardData.shade || '—') + '</span></div>' +
      '<div class="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest"><span>STL</span><span class="text-slate-800">' + wizardData.stlFiles.length + ' files</span></div>' +
    '</div>' +
    '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">' + t('wiz_size_table_title') + '</p>' +
    '<div class="mb-2">' + teethHtml + '</div>' +
    (wizardData.memo ? '<div class="bg-amber-50 rounded-xl p-2.5 mt-2"><p class="text-[9px] text-slate-600 leading-relaxed">' + wizardData.memo + '</p></div>' : '');
}

var _wizStepLabels = ['wiz_step1','wiz_step2','wiz_step3','wiz_step4','wiz_step5'];
function renderWizStepBar(step) {
  var el = document.getElementById('wizStepBar');
  if (!el) return;
  var html = '<div class="flex items-center">';
  for (var i=1; i<=5; i++) {
    var done    = i < step;
    var current = i === step;
    var circCls = done    ? 'w-7 h-7 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0'
                : current ? 'w-7 h-7 rounded-full bg-[#001d4a] text-white text-[10px] font-black flex items-center justify-center shrink-0 ring-4 ring-blue-200'
                          : 'w-7 h-7 rounded-full bg-slate-200 text-slate-400 text-[10px] font-black flex items-center justify-center shrink-0';
    var labelCls = current ? 'text-[8px] font-black text-[#001d4a] mt-1 text-center leading-tight'
                 : done    ? 'text-[8px] font-bold text-blue-500 mt-1 text-center leading-tight'
                           : 'text-[8px] font-bold text-slate-400 mt-1 text-center leading-tight';
    html += '<div class="flex flex-col items-center" style="min-width:2.2rem">' +
      '<div class="' + circCls + '">' + (done ? '✓' : i) + '</div>' +
      '<span class="' + labelCls + '">' + t(_wizStepLabels[i-1]) + '</span>' +
    '</div>';
    if (i < 5) {
      var lineCls = i < step ? 'flex-1 h-0.5 bg-blue-500 mb-4' : 'flex-1 h-0.5 bg-slate-200 mb-4';
      html += '<div class="' + lineCls + '"></div>';
    }
  }
  html += '</div>';
  el.innerHTML = html;
}

function showWizardStep(step) {
  wizardStep = step;
  for (var i=1; i<=5; i++) {
    var el = document.getElementById('wiz-step-' + i);
    if (el) el.classList.toggle('hidden', i !== step);
  }
  var prevBtn = document.getElementById('wizPrevBtn');
  var nextBtn = document.getElementById('wizNextBtn');
  if (prevBtn) prevBtn.classList.toggle('hidden', step === 1);
  if (nextBtn) {
    if (step === 5) {
      nextBtn.classList.add('hidden');
    } else {
      nextBtn.classList.remove('hidden');
      nextBtn.setAttribute('data-i18n', 'wiz_next');
      nextBtn.textContent = t('wiz_next');
    }
  }
  if (prevBtn) { prevBtn.setAttribute('data-i18n','wiz_prev'); prevBtn.textContent = t('wiz_prev'); }
  renderWizStepBar(step);
  if (step === 2) renderWizSizeTable();
  if (step === 5) renderWizSummary();
  window.scrollTo(0, 0);
}

function customWizardNext() {
  if (wizardStep === 1) {
    var patEl = document.getElementById('wiz-patient');
    if (patEl) wizardData.patient = patEl.value.trim();
    var dlEl = document.getElementById('wiz-deadline');
    if (dlEl) wizardData.deadline = dlEl.value;
    if (!wizardData.teethSet.size) { alert(t('wiz_no_tooth_err')); return; }
  } else if (wizardStep === 2) {
    // save sizes
    Array.from(wizardData.teethSet).forEach(function(tn) {
      var sEl = document.getElementById('wiz-size-' + tn);
      if (sEl) wizardData.teethSizes[tn] = sEl.value.trim();
    });
    if (!wizardData.brand) { alert(t('wiz_no_brand_err')); return; }
  } else if (wizardStep === 3) {
    var memoEl = document.getElementById('wiz-memo');
    if (memoEl) wizardData.memo = memoEl.value.trim();
  }
  if (wizardStep < 5) showWizardStep(wizardStep + 1);
}

function customWizardPrev() {
  if (wizardStep > 1) showWizardStep(wizardStep - 1);
}

async function submitWizardOrder() {
  var _clinicEl = document.getElementById('cust-clinic'); var clinic = _clinicEl ? _clinicEl.value.trim() : '';
  var _addrEl   = document.getElementById('cust-addr');   var addr   = _addrEl   ? _addrEl.value.trim()   : '';
  var _phoneEl  = document.getElementById('cust-phone');  var phone  = _phoneEl  ? _phoneEl.value.trim()  : '';
  var _lineEl   = document.getElementById('cust-line');   var lineId = _lineEl   ? _lineEl.value.trim()   : '';
  if (!clinic || !addr || !phone) { alert(t('err_fill_delivery')); return; }
  var teeth = Array.from(wizardData.teethSet).sort(function(a,b){return a-b;});
  if (!teeth.length) { alert(t('wiz_no_tooth_err')); return; }
  if (!wizardData.brand) { alert(t('wiz_no_brand_err')); return; }
  var teethData = teeth.map(function(tn) {
    return { tooth:tn, toothName:getToothName(tn), brand:wizardData.brand, size:wizardData.teethSizes[tn]||'', color:wizardData.shade||'' };
  });
  var caseObj = { patient: wizardData.patient || t('anon_patient'), teeth: teethData, deadline: wizardData.deadline, memo: wizardData.memo, stls: wizardData.stlFiles.map(function(f){return f.name;}), stlUrls:[] };
  var _now = new Date();
  var _month = String.fromCharCode(64 + _now.getMonth() + 1);
  var _day   = String(_now.getDate()).padStart(2,'0');
  var _hhmm  = String(_now.getHours()).padStart(2,'0') + String(_now.getMinutes()).padStart(2,'0');
  var oid = 'CA' + _now.getFullYear() + _month + _day + _hhmm;
  // Upload STL files
  for (var k = 0; k < wizardData.stlFiles.length; k++) {
    var origFile = wizardData.stlFiles[k];
    var origExt = origFile.name.substring(origFile.name.lastIndexOf('.')).toLowerCase() || '.stl';
    var fname = oid + '_case1_' + k + '_' + Date.now() + origExt;
    var stlUrl = null;
    try {
      var r = await fetch(SUPABASE_URL + '/storage/v1/object/stl-file/' + fname, {
        method:'POST', headers:{'apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+SUPABASE_ANON_KEY,'Content-Type':'application/octet-stream','x-upsert':'true'}, body:origFile
      });
      if (r.ok) stlUrl = SUPABASE_URL + '/storage/v1/object/public/stl-file/' + fname;
    } catch(e) { console.warn('[STL]',e); }
    if (!stlUrl) {
      stlUrl = await new Promise(function(resolve) {
        var reader = new FileReader();
        reader.onload = function(ev) { resolve(ev.target.result); };
        reader.onerror = function() { resolve(null); };
        reader.readAsDataURL(origFile);
      });
    }
    caseObj.stlUrls.push(stlUrl);
  }
  var order = { id:oid, clinic:clinic, addr:addr, phone:phone, lineId:lineId||'', cases:[caseObj], stage:'submitted', designVersions:[], reviewHistory:[], date:new Date().toLocaleDateString(), userNickname: currentUser ? currentUser.nickname : '' };
  customOrders.unshift(order);
  saveOrderToSupabase(order);
  var totalTeeth = teethData.length;
  sendLineMessage(LINE_USER_ID, [buildFlexMessage('🆕','คำสั่งซื้อ CNC Custom ใหม่',[
    {label:'หมายเลขคำสั่งซื้อ',value:oid},{label:'คลินิก',value:clinic},{label:'วันที่',value:order.date},
    {label:'ติดต่อ',value:phone},{label:'Line ID',value:lineId||'ไม่มี'},{label:'ซี่ฟัน / เคส',value:totalTeeth+'ซี่ / 1เคส'}
  ],'กรุณายืนยันคำสั่งซื้อในแผงผู้ดูแล')]);
  var msg = tf('order_success_msg', oid, 1, totalTeeth);
  if (lineId) msg += t('order_success_line');
  alert(msg);
  customTab('list');
}

function resetCustomForm() {
  initWizard();
}
function addCase() {
  caseCount++;
  var id  = caseCount;
  caseTeeth[id] = new Set();
  var div = document.createElement('div');
  div.id  = 'case-' + id;
  div.className = 'bg-slate-50 rounded-2xl p-4 mb-3';
  var delBtn = id > 1 ? '<button onclick="removeCase(' + id + ')" class="text-red-400 font-black text-xs">' + t('case_remove') + '</button>' : '';
  div.innerHTML =
    '<div class="flex justify-between items-center mb-3">' +
      '<span class="font-black text-xs text-slate-600">' + t('case_label') + id + '</span>' + delBtn +
    '</div>' +
    '<input type="text" id="cp-' + id + '" placeholder="' + t('case_patient_ph') + '" class="w-full p-3 bg-white rounded-xl text-sm font-bold outline-none mb-3 border-2 border-slate-200 focus:border-blue-400">' +
    '<div class="mb-1"><p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">' + t('case_tooth_hint') + '</p>' + buildToothChart(id) + '</div>' +
    '<div id="teeth-details-' + id + '" class="space-y-2 mt-3 mb-3"></div>' +
    '<p class="text-sm font-black text-slate-600 mb-2 mt-3">' + t('case_deadline_label') + '</p>' +
    '<input type="date" id="cd-' + id + '" class="w-full p-4 bg-white rounded-xl text-base font-black outline-none border-2 border-blue-200 mb-3 text-slate-700 focus:border-blue-500 cursor-pointer" style="min-height:52px;color-scheme:light;">' +
    '<div id="stl-drop-' + id + '" onclick="document.getElementById(\'stl-' + id + '\').click()" ondragover="onStlDragOver(' + id + ',event)" ondragleave="onStlDragLeave(' + id + ',event)" ondrop="onStlDrop(' + id + ',event)" class="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center mb-2 cursor-pointer bg-white transition-colors">' +
      '<p class="text-2xl mb-1">📁</p><p class="text-xs font-black text-slate-500">' + t('stl_label') + '</p><p class="text-[9px] text-slate-400 mt-0.5">' + t('stl_hint') + '</p>' +
    '</div>' +
    '<input type="file" id="stl-' + id + '" accept=".stl,.STL,.ply,.PLY,.obj,.OBJ,.3mf,.3MF" class="hidden" multiple onchange="onStl(' + id + ',this)">' +
    '<textarea id="cm-' + id + '" rows="2" placeholder="' + t('memo_ph') + '" class="w-full p-3 bg-white rounded-xl text-sm outline-none resize-none border-2 border-slate-200"></textarea>';
  var cl = document.getElementById('caseList');
  if (cl) cl.appendChild(div);
}
function removeCase(id) {
  var el = document.getElementById('case-'+id);
  if (el) el.remove();
  if (caseTeeth[id]) delete caseTeeth[id];
}
function buildToothChart(caseId) {
  var upper = [17,16,15,14,13,12,11,21,22,23,24,25,26,27];
  var lower = [47,46,45,44,43,42,41,31,32,33,34,35,36,37];
  function btn(num) {
    return '<button type="button" id="tooth-' + caseId + '-' + num + '" onclick="toggleTooth(' + caseId + ',' + num + ')" ' +
      'class="w-8 h-8 rounded-lg text-[9px] font-black border-2 border-slate-200 bg-white text-slate-500 transition active:scale-90 leading-none">' + num + '</button>';
  }
  var html = '<div class="bg-white rounded-2xl p-3 border border-slate-100">';
  html += '<p class="text-center text-[8px] font-black text-blue-400 uppercase tracking-widest mb-2">' + t('upper_jaw') + '</p>';
  html += '<div class="flex justify-center gap-1 mb-2 flex-wrap">';
  upper.forEach(function(n){ html += btn(n); });
  html += '</div>';
  html += '<div class="border-t border-dashed border-slate-200 my-2 relative"><span class="absolute left-1/2 -translate-x-1/2 -top-2 bg-white px-2 text-[8px] text-slate-300 font-bold">' + t('jaw_border') + '</span></div>';
  html += '<div class="flex justify-center gap-1 mt-2 flex-wrap">';
  lower.forEach(function(n){ html += btn(n); });
  html += '</div>';
  html += '<p class="text-center text-[8px] font-black text-amber-400 uppercase tracking-widest mt-2">' + t('lower_jaw') + '</p>';
  html += '</div>';
  return html;
}
function toggleTooth(caseId, toothNum) {
  if (!caseTeeth[caseId]) caseTeeth[caseId] = new Set();
  var btn = document.getElementById('tooth-' + caseId + '-' + toothNum);
  if (caseTeeth[caseId].has(toothNum)) {
    caseTeeth[caseId].delete(toothNum);
    if (btn) btn.className = 'w-8 h-8 rounded-lg text-[9px] font-black border-2 border-slate-200 bg-white text-slate-500 transition active:scale-90 leading-none';
  } else {
    caseTeeth[caseId].add(toothNum);
    if (btn) btn.className = 'w-8 h-8 rounded-lg text-[9px] font-black border-2 border-blue-500 bg-blue-500 text-white transition active:scale-90 leading-none';
  }
  renderToothDetails(caseId);
}
function renderToothDetails(caseId) {
  var container = document.getElementById('teeth-details-' + caseId);
  if (!container) return;
  var teeth = Array.from(caseTeeth[caseId]).sort(function(a,b){ return a-b; });
  if (!teeth.length) { container.innerHTML = ''; return; }
  var brandOpts = '<option value="">' + t('brand_ph') + '</option>' +
    IMPLANT_BRANDS.map(function(b){ return '<option value="' + b + '">' + b + '</option>'; }).join('');
  var colorOpts = '<option value="">' + t('color_ph') + '</option>' +
    TOOTH_COLORS.map(function(c){ return '<option value="' + c + '">' + c + '</option>'; }).join('');
  var saved = {};
  teeth.forEach(function(tn) {
    var bEl = document.getElementById('tb-'+caseId+'-'+tn);
    var sEl = document.getElementById('ts-'+caseId+'-'+tn);
    var cEl = document.getElementById('tc-'+caseId+'-'+tn);
    if (bEl||sEl||cEl) saved[tn] = { brand: bEl?bEl.value:'', size: sEl?sEl.value:'', color: cEl?cEl.value:'' };
  });
  container.innerHTML =
    '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">' + t('selected_teeth') + ' ' + teeth.length + (t('sel_count_suffix')||'') + '</p>' +
    teeth.map(function(tn) {
      var sv = saved[tn] || {};
      var jaw = (tn>=11&&tn<=28)
        ? '<span class="text-blue-400 text-[8px] font-bold">' + t('upper') + '</span>'
        : '<span class="text-amber-400 text-[8px] font-bold">' + t('lower') + '</span>';
      return '<div class="bg-white rounded-xl p-3 border border-slate-100">' +
        '<div class="flex items-center gap-2 mb-2">' +
          '<span class="w-8 h-8 rounded-lg bg-blue-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">' + tn + '</span>' +
          '<div><p class="text-[10px] font-black text-slate-700">' + getToothName(tn) + '</p>' + jaw + '</div>' +
        '</div>' +
        '<select id="tb-' + caseId + '-' + tn + '" class="w-full p-2.5 bg-slate-50 rounded-xl text-xs font-bold outline-none mb-2 border border-slate-100">' + brandOpts + '</select>' +
        '<input type="text" id="ts-' + caseId + '-' + tn + '" placeholder="' + t('size_ph') + '" value="' + (sv.size||'') + '" class="w-full p-2.5 bg-slate-50 rounded-xl text-xs font-bold outline-none mb-2 border border-slate-100">' +
        '<select id="tc-' + caseId + '-' + tn + '" class="w-full p-2.5 bg-slate-50 rounded-xl text-xs font-bold outline-none border border-slate-100">' + colorOpts + '</select>' +
      '</div>';
    }).join('');
  teeth.forEach(function(tn) {
    var sv = saved[tn];
    if (!sv) return;
    var bEl = document.getElementById('tb-'+caseId+'-'+tn);
    var cEl = document.getElementById('tc-'+caseId+'-'+tn);
    if (bEl && sv.brand) bEl.value = sv.brand;
    if (cEl && sv.color) cEl.value = sv.color;
  });
}
function getToothName(num) {
  var n = num % 10;
  var keyMap = {1:'tooth_11',2:'tooth_12',3:'tooth_13',4:'tooth_14',5:'tooth_15',6:'tooth_16',7:'tooth_17'};
  return '#' + num + ' ' + (t(keyMap[n]) || '');
}
function onStlDragOver(id, e) {
  e.preventDefault(); e.stopPropagation();
  var d = document.getElementById('stl-drop-'+id);
  d.style.borderColor = '#3b82f6';
  d.style.background  = '#eff6ff';
}
function onStlDragLeave(id, e) {
  e.preventDefault(); e.stopPropagation();
  var d = document.getElementById('stl-drop-'+id);
  d.style.borderColor = '';
  d.style.background  = '';
}
function onStlDrop(id, e) {
  e.preventDefault(); e.stopPropagation();
  var d = document.getElementById('stl-drop-'+id);
  d.style.borderColor = ''; d.style.background = '';
  var allowed3d = ['.stl', '.ply', '.obj', '.3mf'];
  var dropped = Array.from(e.dataTransfer.files).filter(function(f){
    var lower = f.name.toLowerCase();
    return allowed3d.some(function(ext){ return lower.endsWith(ext); });
  });
  if (!dropped.length) return;
  var inputEl = document.getElementById('stl-'+id);
  var existing = inputEl.files ? Array.from(inputEl.files) : [];
  var merged = existing.concat(dropped).slice(0, 10);
  var dt = new DataTransfer();
  merged.forEach(function(f){ dt.items.add(f); });
  inputEl.files = dt.files;
  onStl(id, inputEl);
}
function onStl(id, input) {
  var files = Array.from(input.files).slice(0, 10); if(!files.length) return;
  var d = document.getElementById('stl-drop-'+id);
  var totalKB = files.reduce(function(s,f){ return s + f.size/1024; }, 0);
  var listHtml = files.map(function(f,i){
    return '<p class="text-[9px] text-green-700 font-bold truncate">' + (i+1) + '. ' + f.name + ' <span class="text-slate-400 font-normal">(' + (f.size/1024).toFixed(0) + 'KB)</span></p>';
  }).join('');
  d.innerHTML = '<p class="text-xl mb-1">✅</p>' +
    '<p class="text-xs font-black text-green-600 mb-1">' + files.length + '개 파일 선택됨 · ' + totalKB.toFixed(0) + 'KB</p>' +
    '<div class="text-left">' + listHtml + '</div>' +
    '<p class="text-[8px] text-slate-400 mt-1">여기에 파일을 추가로 드래그하거나 탭하여 더 추가</p>';
  d.style.borderColor = ''; d.style.background = '';
  d.className = 'border-2 border-green-200 rounded-xl p-3 mb-2 bg-green-50 cursor-pointer transition-colors';
}
async function submitCustom() {
  var clinic = document.getElementById('cust-clinic').value.trim();
  var addr   = document.getElementById('cust-addr').value.trim();
  var phone  = document.getElementById('cust-phone').value.trim();
  var lineId = document.getElementById('cust-line').value.trim();
  if (!clinic||!addr||!phone) { alert(t('err_fill_delivery')); return; }
  var cases = []; var caseStlFiles = [];
  for (var i=1; i<=caseCount; i++) {
    if (!document.getElementById('case-'+i)) continue;
    var selectedTeeth = caseTeeth[i] ? Array.from(caseTeeth[i]).sort(function(a,b){return a-b;}) : [];
    if (!selectedTeeth.length) { alert(tf('err_select_tooth', i)); return; }
    var teethData = [];
    var valid = true;
    for (var ti=0; ti<selectedTeeth.length; ti++) {
      var tn = selectedTeeth[ti];
      var brand = (document.getElementById('tb-'+i+'-'+tn)||{}).value || '';
      var size  = ((document.getElementById('ts-'+i+'-'+tn)||{}).value || '').trim();
      if (!brand||!size) { alert(tf('err_fill_tooth', i, tn)); valid=false; break; }
      teethData.push({
        tooth:     tn,
        toothName: getToothName(tn),
        brand:     brand,
        size:      size,
        color:     (document.getElementById('tc-'+i+'-'+tn)||{}).value || '',
      });
    }
    if (!valid) return;
    var stlEl = document.getElementById('stl-'+i);
    var stlFilesForCase = stlEl && stlEl.files.length ? Array.from(stlEl.files).slice(0,10) : [];
    caseStlFiles.push(stlFilesForCase);
    cases.push({
      patient:  document.getElementById('cp-'+i).value.trim() || t('anon_patient'),
      teeth:    teethData,
      deadline: document.getElementById('cd-'+i).value,
      memo:     document.getElementById('cm-'+i).value.trim(),
      stls:     stlFilesForCase.map(function(f){ return f.name; }),
      stlUrls:  [],
    });
  }
  if (!cases.length) { alert(t('err_add_case')); return; }
  var totalTeeth = cases.reduce(function(s,c){ return s+c.teeth.length; },0);
  var _now = new Date();
  var _month = String.fromCharCode(64 + _now.getMonth() + 1);
  var _day   = String(_now.getDate()).padStart(2,'0');
  var _hhmm  = String(_now.getHours()).padStart(2,'0') + String(_now.getMinutes()).padStart(2,'0');
  var oid = 'CA' + _now.getFullYear() + _month + _day + _hhmm;
  // STL 파일 Supabase Storage 업로드 (케이스당 최대 10개)
  for (var j = 0; j < caseStlFiles.length; j++) {
    for (var k = 0; k < caseStlFiles[j].length; k++) {
      var origFile = caseStlFiles[j][k];
      var origExt = origFile.name.substring(origFile.name.lastIndexOf('.')).toLowerCase() || '.stl';
      var fname = oid + '_case' + (j+1) + '_' + k + '_' + Date.now() + origExt;
      var stlUrl = null;
      // ① Supabase Storage 업로드 시도
      try {
        var r = await fetch(SUPABASE_URL + '/storage/v1/object/stl-file/' + fname, {
          method: 'POST',
          headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
            'Content-Type': 'application/octet-stream', 'x-upsert': 'true' },
          body: origFile
        });
        if (r.ok) {
          stlUrl = SUPABASE_URL + '/storage/v1/object/public/stl-file/' + fname;
        } else {
          var errText = await r.text();
          console.warn('[STL Upload] HTTP ' + r.status + ' - ' + errText + ' → base64 fallback 사용');
        }
      } catch(e) { console.warn('[STL Upload]', e, '→ base64 fallback 사용'); }
      // ② Storage 실패 시 base64 fallback
      if (!stlUrl) {
        stlUrl = await new Promise(function(resolve) {
          var reader = new FileReader();
          reader.onload = function(ev) {
            var result = ev.target.result;
            // base64 data URI가 너무 크면 (>3MB) Supabase 저장이 어려우므로 경고
            if (result && result.length > 3 * 1024 * 1024) {
              console.warn('[STL Base64] File too large for inline storage:', Math.round(result.length/1024) + 'KB');
            }
            resolve(result);
          };
          reader.onerror = function(e) {
            console.error('[STL FileReader] Error reading file:', origFile.name, e);
            resolve(null);
          };
          reader.readAsDataURL(origFile);
        });
      }
      cases[j].stlUrls.push(stlUrl);
    }
  }
  var order = { id:oid, clinic:clinic, addr:addr, phone:phone, lineId:lineId, cases:cases, stage:'submitted', designVersions:[], reviewHistory:[], date:new Date().toLocaleDateString(), userNickname:currentUser.nickname };
  customOrders.unshift(order);
  saveOrderToSupabase(order);
  // Notify admin of new order (customer gets LINE notification when admin confirms)
  sendLineMessage(LINE_USER_ID, [buildFlexMessage('🆕', 'คำสั่งซื้อ CNC Custom ใหม่', [
    {label:'หมายเลขคำสั่งซื้อ', value: oid},
    {label:'คลินิก', value: clinic},
    {label:'วันที่', value: order.date},
    {label:'ติดต่อ', value: phone},
    {label:'Line ID', value: lineId || 'ไม่มี'},
    {label:'ซี่ฟัน / เคส', value: totalTeeth + 'ซี่ / ' + cases.length + 'เคส'}
  ], 'กรุณายืนยันคำสั่งซื้อในแผงผู้ดูแล')]);
  var msg = tf('order_success_msg', oid, cases.length, totalTeeth);
  if (lineId) msg += t('order_success_line');
  alert(msg);
  customTab('list');
}
function renderCustomOrders() {
  var c = document.getElementById('customOrdersContainer');
  var activeOrders = customOrders.filter(function(o){ return o.stage !== 'done'; });
  if (!activeOrders.length) { c.innerHTML = '<div class="text-center text-slate-400 font-bold text-sm py-10">' + t('custom_empty') + '</div>'; return; }
  c.innerHTML = activeOrders.map(function(o) {
    // design_revision maps to design_ready position in progress bar
    var barKey = (o.stage === 'design_revision') ? 'design_ready' : o.stage;
    var si = ORDER_STAGES.findIndex(function(s){ return s.key === barKey; });
    if (si < 0) si = 0;
    var st = ORDER_STAGES[si];
    var bars = '<div class="flex items-end gap-0.5">' + ORDER_STAGES.map(function(s,i){
      var done    = i < si;
      var current = i === si;
      var dotCls  = done    ? 'w-5 h-5 rounded-full bg-blue-600 text-white text-[8px] font-black flex items-center justify-center shrink-0'
                  : current ? 'w-5 h-5 rounded-full bg-amber-500 text-white text-[8px] font-black flex items-center justify-center shrink-0 ring-2 ring-amber-200'
                            : 'w-5 h-5 rounded-full bg-slate-200 text-slate-400 text-[8px] font-black flex items-center justify-center shrink-0';
      var lbl     = t('stage_' + s.key) || s.key;
      var lblCls  = current ? 'text-[7px] font-black text-amber-500 mt-0.5 text-center leading-tight'
                 : done     ? 'text-[7px] font-bold text-blue-500 mt-0.5 text-center leading-tight'
                            : 'text-[7px] font-bold text-slate-400 mt-0.5 text-center leading-tight';
      var barCls  = done ? 'stage-done' : current ? 'stage-current' : 'stage-todo';
      var item = '<div class="flex flex-col items-center" style="flex:1;min-width:0">' +
        '<div class="' + dotCls + '">' + (done ? '✓' : s.icon) + '</div>' +
        '<span class="' + lblCls + '" style="word-break:keep-all">' + lbl + '</span>' +
      '</div>';
      if (i < ORDER_STAGES.length - 1) {
        return item + '<div class="flex-shrink-0 w-3 h-0.5 mb-3.5 ' + barCls + '"></div>';
      }
      return item;
    }).join('') + '</div>';
    var stageLabel = t('stage_' + o.stage) || o.stage;
    var totalTeeth = o.cases.reduce(function(s,cs){ return s+(cs.teeth?cs.teeth.length:0); },0);
    // ── Design review section ──────────────────────────────
    var designHtml = '';
    if (o.stage === 'design_ready' && o.designVersions && o.designVersions.length) {
      var latest = o.designVersions[o.designVersions.length - 1];
      designHtml =
        '<div class="mt-3 pt-3 border-t border-slate-100">' +
          '<p class="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2">📐 디자인 확인 (ver.' + o.designVersions.length + ')</p>' +
          '<img src="' + latest.url + '" class="w-full rounded-xl mb-2 max-h-52 object-contain bg-slate-50" loading="lazy">' +
          '<p class="text-[8px] text-slate-400 mb-3">' + latest.name + ' · ' + latest.date + '</p>' +
          '<div class="flex gap-2 mb-2">' +
            '<button onclick="customerApproveDesign(\'' + o.id + '\')" class="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-black text-xs active:scale-95 transition">✅ 만족</button>' +
            '<button onclick="showRejectPanel(\'' + o.id + '\')" class="flex-1 py-2.5 bg-red-100 text-red-600 rounded-xl font-black text-xs active:scale-95 transition">❌ 불만족</button>' +
          '</div>' +
          '<div id="reject-panel-' + o.id + '" class="hidden mt-2">' +
            '<textarea id="reject-note-' + o.id + '" rows="3" placeholder="수정 요청사항을 입력해주세요..." class="w-full p-2.5 bg-slate-50 rounded-xl text-xs outline-none resize-none mb-2 border border-slate-200"></textarea>' +
            '<button onclick="customerRejectDesign(\'' + o.id + '\')" class="w-full py-2 bg-red-500 text-white rounded-xl font-black text-xs active:scale-95 transition">불만족 제출</button>' +
          '</div>' +
        '</div>';
    } else if (o.stage === 'design_revision') {
      var lastRev = (o.reviewHistory && o.reviewHistory.length) ? o.reviewHistory[o.reviewHistory.length-1] : null;
      var lastDesign = (o.designVersions && o.designVersions.length) ? o.designVersions[o.designVersions.length-1] : null;
      designHtml =
        '<div class="mt-3 pt-3 border-t border-slate-100">' +
          '<p class="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2">⏳ 디자인 수정 요청됨</p>' +
          (lastRev ? '<div class="bg-amber-50 rounded-xl p-2.5 mb-2"><p class="text-[9px] text-slate-600 leading-relaxed">"' + lastRev.note + '"</p></div>' : '') +
          (lastDesign ? '<img src="' + lastDesign.url + '" class="w-full rounded-xl mb-1 max-h-36 object-contain bg-slate-50 opacity-50" loading="lazy">' : '') +
        '</div>';
    } else if (o.stage === 'confirmed') {
      designHtml = '<div class="mt-3 pt-3 border-t border-slate-100"><p class="text-[9px] text-slate-400 font-bold">📐 ' + t('design_waiting') + '</p></div>';
    }
    // ── 수령 완료 버튼 (shipped) ────────────────────────────
    var receiveHtml = '';
    if (o.stage === 'shipped') {
      receiveHtml =
        '<div class="mt-3 pt-3 border-t border-slate-100">' +
          '<p class="text-[9px] text-green-600 font-bold mb-2">' + t('shipped_msg') + '</p>' +
          '<button onclick="customerReceiveOrder(\'' + o.id + '\')" class="w-full py-3 bg-green-600 text-white rounded-xl font-black text-sm active:scale-95 transition">' + t('receive_btn') + '</button>' +
        '</div>';
    }
    // ── 접수 전 수정/삭제 ──────────────────────────────────
    var editDeleteHtml = '';
    if (o.stage === 'submitted') {
      editDeleteHtml =
        '<div class="flex gap-2 mt-3 pt-3 border-t border-slate-100">' +
          '<button onclick="editCustomOrder(\'' + o.id + '\')" class="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-black text-xs active:scale-95 transition">' + t('edit_order_btn') + '</button>' +
          '<button onclick="deleteCustomOrder(\'' + o.id + '\')" class="flex-1 py-2.5 bg-red-50 text-red-500 rounded-xl font-black text-xs active:scale-95 transition">' + t('delete_order_btn') + '</button>' +
        '</div>';
    }
    // ── Review history ─────────────────────────────────────
    var histHtml = '';
    if (o.reviewHistory && o.reviewHistory.length) {
      histHtml =
        '<div class="mt-2 pt-2 border-t border-slate-100">' +
          '<p class="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">' + tf('review_history_label', o.reviewHistory.length) + '</p>' +
          o.reviewHistory.map(function(r){
            return '<div class="flex gap-1 items-start text-[8px] text-slate-400 mb-0.5">' +
              '<span>' + (r.action==='approved'?'✅':'❌') + '</span>' +
              '<span>' + r.date + (r.note?' · '+r.note:'') + '</span>' +
            '</div>';
          }).join('') +
        '</div>';
    }
    // ── Case details ───────────────────────────────────────
    var caseRows = o.cases.map(function(cs, ci) {
      var toothRows = (cs.teeth||[]).map(function(td) {
        var isUpper = td.tooth>=11&&td.tooth<=28;
        var jawDot = isUpper
          ? '<span class="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block mr-1"></span>'
          : '<span class="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block mr-1"></span>';
        return '<div class="flex items-center gap-2 py-1.5 border-b border-slate-50 last:border-0">' +
          '<span class="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 text-[9px] font-black flex items-center justify-center shrink-0">' + td.tooth + '</span>' +
          '<div class="flex-1 min-w-0">' + jawDot + '<span class="text-[10px] font-black text-slate-700">' + td.brand + '</span><span class="text-[9px] text-slate-400 ml-1">' + td.size + '</span></div>' +
          (td.color ? '<span class="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md shrink-0">' + td.color + '</span>' : '') +
        '</div>';
      }).join('');
      var nTeeth = cs.teeth ? cs.teeth.length : 0;
      return '<div class="mb-3 last:mb-0">' +
        '<div class="flex justify-between items-center mb-1">' +
          '<p class="text-[10px] font-black text-slate-600">' + t('case_nr') + (ci+1) + ' · ' + t('patient_label') + cs.patient + '</p>' +
          '<span class="text-[9px] bg-blue-50 text-blue-600 font-black px-2 py-0.5 rounded-lg">' + nTeeth + t('teeth_count') + '</span>' +
        '</div>' +
        (toothRows || '<p class="text-[9px] text-slate-300 font-bold">' + t('no_tooth_info') + '</p>') +
        ((cs.stls && cs.stls.length) ? '<p class="text-[9px] text-green-500 font-bold mt-1">📎 STL ' + cs.stls.length + '개</p>' : (cs.stl ? '<p class="text-[9px] text-green-500 font-bold mt-1">📎 ' + cs.stl + '</p>' : '')) +
        (cs.deadline ? '<p class="text-[9px] text-slate-400 font-bold mt-1">📅 ' + cs.deadline + '</p>' : '') +
      '</div>';
    }).join('');
    var detailHeader = t('case_detail') + ' (' + o.cases.length + t('cases_unit') + ' · ' + t('teeth_total_prefix') + totalTeeth + t('teeth_count') + ')';
    return '<div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">' +
      '<div class="bg-[#001d4a] px-5 py-4 flex justify-between items-center">' +
        '<div><p class="font-black text-white text-sm">' + o.clinic + '</p><p class="text-blue-300 text-[9px] font-bold font-mono mt-0.5">' + o.id + ' · ' + o.date + '</p></div>' +
        '<div class="text-right"><span class="text-xl">' + st.icon + '</span><p class="text-blue-300 text-[9px] font-bold mt-0.5">' + totalTeeth + t('teeth_count') + '</p></div>' +
      '</div>' +
      '<div class="px-5 py-4">' +
        '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">' + t('status_label') + '</p>' +
        '<div class="flex gap-1 mb-2">' + bars + '</div>' +
        '<p class="text-center font-black text-sm text-blue-700">' + st.icon + ' ' + stageLabel + '</p>' +
        designHtml +
        receiveHtml +
        editDeleteHtml +
        histHtml +
      '</div>' +
      '<div class="px-5 pb-5 border-t border-slate-50 pt-4">' +
        '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">' + detailHeader + '</p>' +
        caseRows +
      '</div>' +
      '<div class="px-5 pb-4 text-[9px] text-slate-400 font-bold space-y-0.5 border-t border-slate-50 pt-3">' +
        '<p>📍 ' + o.addr + '</p><p>📞 ' + o.phone + '</p>' +
      '</div>' +
    '</div>';
  }).join('');
}
// ── 완료 주문 페이지 ───────────────────────────────────────
function renderDoneOrders() {
  var c = document.getElementById('doneOrdersContainer');
  if (!c) return;
  var doneOrders = customOrders.filter(function(o){ return o.stage === 'done'; });
  if (!doneOrders.length) {
    c.innerHTML = '<div class="text-center text-slate-400 font-bold text-sm py-10">' + t('done_orders_empty') + '</div>';
    return;
  }
  c.innerHTML = doneOrders.map(function(o) {
    var totalTeeth = o.cases.reduce(function(s,cs){ return s+(cs.teeth?cs.teeth.length:0); },0);
    var latestDesign = o.designVersions && o.designVersions.length ? o.designVersions[o.designVersions.length-1] : null;
    var caseRows = o.cases.map(function(cs, ci) {
      return '<div class="py-1.5 border-b border-slate-50 last:border-0">' +
        '<p class="text-[10px] font-black text-slate-600">' + t('case_nr').replace('#', (ci+1).toString()) + ' · ' + cs.patient + '</p>' +
        '<p class="text-[9px] text-slate-400">' + (cs.teeth||[]).map(function(td){ return td.tooth + ' ' + td.brand; }).join(' / ') + '</p>' +
      '</div>';
    }).join('');
    return '<div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">' +
      '<div class="bg-gradient-to-r from-green-700 to-green-600 px-5 py-4 flex justify-between items-center">' +
        '<div>' +
          '<p class="font-black text-white text-sm">' + o.clinic + '</p>' +
          '<p class="text-green-200 text-[9px] font-bold font-mono mt-0.5">' + o.id + ' · ' + o.date + '</p>' +
        '</div>' +
        '<div class="text-right">' +
          '<span class="text-xl">✅</span>' +
          '<p class="text-green-200 text-[9px] font-bold mt-0.5">' + t('done_status_label') + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="px-5 py-4">' +
        (latestDesign ? '<img src="' + latestDesign.url + '" class="w-full rounded-xl mb-3 max-h-40 object-contain bg-slate-50" loading="lazy">' : '') +
        '<p class="text-[10px] text-slate-500 font-bold mb-2">' + tf('done_cases_teeth_fmt', o.cases.length, totalTeeth) + '</p>' +
        caseRows +
        '<p class="text-[9px] text-slate-400 mt-2">📍 ' + o.addr + '</p>' +
        '<p class="text-[9px] text-slate-400">📞 ' + o.phone + '</p>' +
      '</div>' +
    '</div>';
  }).join('');
}
// ── 주문 삭제 ──────────────────────────────────────────────
async function deleteCustomOrder(orderId) {
  if (!confirm('접수 전 주문을 삭제하시겠습니까?')) return;
  customOrders = customOrders.filter(function(o){ return o.id !== orderId; });
  try {
    await sbDelete('custom_orders', 'id=eq.' + encodeURIComponent(orderId));
  } catch(e) { console.error('[Delete Order]', e); }
  renderCustomOrders();
}
// ── 주문 수정 ──────────────────────────────────────────────
function editCustomOrder(orderId) {
  var ord = customOrders.find(function(o){ return o.id===orderId; });
  if (!ord) return;
  document.getElementById('edit-clinic').value = ord.clinic || '';
  document.getElementById('edit-addr').value   = ord.addr   || '';
  document.getElementById('edit-phone').value  = ord.phone  || '';
  document.getElementById('edit-line').value   = ord.lineId || '';
  var casesDiv = document.getElementById('editCases');
  casesDiv.innerHTML = ord.cases.map(function(cs, i) {
    return '<div class="bg-slate-50 rounded-xl p-3">' +
      '<p class="text-[10px] font-black text-slate-500 mb-2">' + t('case_nr').replace('#', (i+1).toString()) + ' · ' + t('teeth_colon_label') + ' ' +
        (cs.teeth||[]).map(function(td){ return td.tooth; }).join(', ') + '</p>' +
      '<input type="text" id="ecp-' + i + '" value="' + (cs.patient||'').replace(/"/g,'&quot;') + '" placeholder="' + t('case_patient_ph') + '" ' +
        'class="w-full p-2.5 bg-white rounded-xl text-xs font-bold border-2 border-slate-200 mb-2 focus:outline-none focus:border-blue-400">' +
      '<input type="date" id="ecd-' + i + '" value="' + (cs.deadline||'') + '" ' +
        'class="w-full p-2.5 bg-white rounded-xl text-xs font-bold border-2 border-slate-200 mb-2 focus:outline-none focus:border-blue-400">' +
      '<textarea id="ecm-' + i + '" rows="2" placeholder="' + t('memo_ph') + '" ' +
        'class="w-full p-2.5 bg-white rounded-xl text-xs border-2 border-slate-200 resize-none focus:outline-none focus:border-blue-400">' + (cs.memo||'').replace(/</g,'&lt;') + '</textarea>' +
    '</div>';
  }).join('');
  var modal = document.getElementById('editOrderModal');
  modal.dataset.orderId = orderId;
  modal.classList.remove('hidden');
}
async function saveEditOrder() {
  var modal = document.getElementById('editOrderModal');
  var orderId = modal.dataset.orderId;
  var ord = customOrders.find(function(o){ return o.id===orderId; });
  if (!ord) return;
  ord.clinic = document.getElementById('edit-clinic').value.trim() || ord.clinic;
  ord.addr   = document.getElementById('edit-addr').value.trim()   || ord.addr;
  ord.phone  = document.getElementById('edit-phone').value.trim()  || ord.phone;
  ord.lineId = document.getElementById('edit-line').value.trim();
  ord.cases.forEach(function(cs, i) {
    var pEl = document.getElementById('ecp-' + i);
    var dEl = document.getElementById('ecd-' + i);
    var mEl = document.getElementById('ecm-' + i);
    if (pEl) cs.patient  = pEl.value.trim() || cs.patient;
    if (dEl) cs.deadline = dEl.value;
    if (mEl) cs.memo     = mEl.value.trim();
  });
  try {
    await sbPatch('custom_orders', 'id=eq.' + encodeURIComponent(orderId), {
      clinic: ord.clinic, addr: ord.addr, phone: ord.phone, line_id: ord.lineId, cases: ord.cases
    });
  } catch(e) { console.error('[Edit Order]', e); }
  closeEditModal();
  renderCustomOrders();
}
function closeEditModal() {
  document.getElementById('editOrderModal').classList.add('hidden');
}
// ── LINE Flex 메시지 빌더 ───────────────────────────────────
function buildFlexMessage(icon, title, fields, note, subtitle) {
  var bodyContents = [
    { type: 'text', text: icon + '  ' + title, weight: 'bold', size: 'md', color: '#001d4a', wrap: true },
    { type: 'separator', margin: 'md', color: '#e2e8f0' }
  ];
  fields.forEach(function(f) {
    bodyContents.push({
      type: 'box', layout: 'horizontal', margin: 'sm',
      contents: [
        { type: 'text', text: f.label, size: 'sm', color: '#94a3b8', flex: 2, wrap: true },
        { type: 'text', text: String(f.value || '-'), size: 'sm', color: '#1e293b', flex: 3, wrap: true, weight: 'bold' }
      ]
    });
  });
  if (note) {
    bodyContents.push({
      type: 'box', layout: 'vertical', margin: 'lg',
      backgroundColor: '#eff6ff', paddingAll: '12px', cornerRadius: '8px',
      contents: [{ type: 'text', text: note, size: 'xs', color: '#1d4ed8', wrap: true }]
    });
  }
  return {
    type: 'flex',
    altText: icon + ' ' + title,
    contents: {
      type: 'bubble',
      header: {
        type: 'box', layout: 'vertical', backgroundColor: '#001d4a', paddingAll: '20px',
        contents: [
          { type: 'text', text: 'BIOPLANT · Dentalk', color: '#60a5fa', size: 'xs', weight: 'bold' },
          { type: 'text', text: subtitle || 'CNC Custom Order', color: '#93c5fd', size: 'xs' }
        ]
      },
      body: { type: 'box', layout: 'vertical', paddingAll: '20px', spacing: 'sm', contents: bodyContents }
    }
  };
}
async function sendLine(order, stageKey) {
  if (!LINE_PROXY_URL || LINE_PROXY_URL === 'YOUR_CLOUDFLARE_WORKER_URL') return;
  var st = ORDER_STAGES.find(function(s){ return s.key===stageKey; });
  var totalTeeth = order.cases.reduce(function(s,cs){ return s+(cs.teeth?cs.teeth.length:0); },0);
  var lines = [
    '━━━━━━━━━━━━━━━━━━━━',
    st.icon + ' ' + t('stage_' + st.key),
    '━━━━━━━━━━━━━━━━━━━━',
    '🆔 ' + order.id,
    '📅 ' + order.date,
    '🏥 ' + order.clinic,
    '📍 ' + order.addr,
    '📞 ' + order.phone,
  ];
  order.cases.forEach(function(cs, i) {
    lines.push('');
    lines.push('[ ' + t('case_label') + (i+1) + '/' + order.cases.length + ' ] ' + cs.patient);
    if (cs.deadline) lines.push('  ' + t('line_deadline') + ': ' + cs.deadline);
    if (cs.teeth && cs.teeth.length) {
      cs.teeth.forEach(function(th) {
        lines.push('  ' + th.toothName + ' | ' + th.brand + ' ' + th.size + (th.color ? ' / ' + th.color : ''));
      });
    }
    if (cs.memo) lines.push('  ' + t('line_memo') + ': ' + cs.memo);
    if (cs.stls && cs.stls.length) lines.push('  STL: ' + cs.stls.join(', '));
    else if (cs.stl) lines.push('  STL: ' + cs.stl);
  });
  lines.push('');
  lines.push(t('line_total_cases', order.cases.length, totalTeeth));
  lines.push('━━━━━━━━━━━━━━━━━━━━');
  var msg = lines.join('\n');
  try {
    var res = await fetch(LINE_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: LINE_USER_ID, messages: [{ type: 'text', text: msg }] })
    });
    var data = await res.json();
    if (!res.ok) {
      console.error('[LINE] status:', res.status, data);
      alert('[LINE 오류] status: ' + res.status + '\n' + JSON.stringify(data));
    }
    if (order.lineId) {
      var res2 = await fetch(LINE_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: order.lineId, messages: [{ type: 'text', text: msg }] })
      });
      if (!res2.ok) {
        var data2 = await res2.json();
        console.error('[LINE 고객] status:', res2.status, data2);
      }
    }
  } catch(e) {
    console.error('[LINE] fetch error:', e);
    alert('[LINE 연결 오류] Worker URL 또는 네트워크를 확인하세요.\n' + e.message);
  }
}
// ============================================================
// CNC CUSTOM — 관리자 & 고객 워크플로우
// ============================================================
var adminCurrentTab = 'orders';
var productPrices   = JSON.parse(localStorage.getItem('adminProductPrices') || '{}');
var productStock    = JSON.parse(localStorage.getItem('adminProductStock') || '{}');


function adminShowTab(tab) {
  adminCurrentTab = tab;
  ['orders','shopOrders','products','used','forum','users','jobs','webzine','events','ads'].forEach(function(t) {
    var key = t.charAt(0).toUpperCase() + t.slice(1);
    var content = document.getElementById('adminTab' + key);
    var btn     = document.getElementById('adminTabBtn-' + t);
    if (!content || !btn) return;
    if (t === tab) {
      content.classList.remove('hidden');
      btn.className = 'shrink-0 px-3 py-1.5 rounded-xl font-black text-xs bg-[#001d4a] text-white';
    } else {
      content.classList.add('hidden');
      btn.className = 'shrink-0 px-3 py-1.5 rounded-xl font-black text-xs bg-slate-100 text-slate-500';
    }
  });
  if (tab === 'orders')          renderAdminOrders();
  else if (tab === 'shopOrders') renderAdminShopOrders();
  else if (tab === 'products')   renderAdminProducts();
  else if (tab === 'used')       renderAdminUsed();
  else if (tab === 'forum')      renderAdminForum();
  else if (tab === 'users')      renderAdminUsers();
  else if (tab === 'jobs')       renderAdminJobs();
  else if (tab === 'webzine')    renderAdminWebzine();
  else if (tab === 'events')     renderAdminEventsTab();
  else if (tab === 'ads')        renderAdminAds();
}
function isAdmin() {
  return isLoggedIn() && currentUser.role === 'admin';
}
function isRegionLeader() {
  return isLoggedIn() && currentUser.role === 'region_leader';
}
function getLeaderRegion() {
  return currentUser.leaderRegion || null;
}
function canManageRegion(region) {
  if (isAdmin()) return true;
  if (!isRegionLeader()) return false;
  var lr = getLeaderRegion();
  if (!lr) return false;
  // 전국 리더는 모든 지역 관리 가능
  if (lr === 'all') return true;
  // 지역 리더: 해당 지역 + 하위 주 관리 가능
  if (lr === region) return true;
  // region이 'north:chiang_mai' 형태일 때 lr이 'north'이면 관리 가능
  if (region && region.indexOf(':') !== -1 && region.split(':')[0] === lr) return true;
  // lr이 'north:chiang_mai'이고 region이 'north'이면 — 주 리더는 상위 지역 관리 불가
  return false;
}
// leader_region 값을 사람이 읽을 수 있는 라벨로 변환
function _resolveLeaderLabel(leaderRegion) {
  if (!leaderRegion) return '';
  if (leaderRegion === 'all') return '🇹🇭 ' + t('leader_level_all');
  if (leaderRegion.indexOf(':') !== -1) {
    var parts = leaderRegion.split(':');
    var rCfg = FORUM_REGIONS.find(function(r){ return r.key === parts[0]; });
    if (rCfg) {
      var pCfg = rCfg.provinces.find(function(p){ return p.key === parts[1]; });
      return rCfg.icon + ' ' + t(rCfg.labelKey) + ' > ' + (pCfg ? pCfg.label : parts[1]);
    }
  }
  var rCfg2 = FORUM_REGIONS.find(function(r){ return r.key === leaderRegion; });
  return rCfg2 ? (rCfg2.icon + ' ' + t(rCfg2.labelKey)) : leaderRegion;
}
async function saveOrderToSupabase(order) {
  var stripLargeBase64 = function(cases) {
    return cases.map(function(cs) {
      return Object.assign({}, cs, {
        stlUrls: (cs.stlUrls || []).map(function(u) {
          return (u && (u.startsWith('http') || u.length < 1024 * 1024)) ? u : null;
        })
      });
    });
  };
  try {
    // ① 전체 데이터(stlUrls 포함) 저장 시도
    var res = await sbSaveCustomOrder(order, order.cases);
    if (res.ok) return;
    var errText = await res.text();
    console.warn('[Order Save] HTTP', res.status, errText);
    // ② 용량 문제(413)이면 대용량 base64 제거 후 재시도
    var res2 = await sbSaveCustomOrder(order, stripLargeBase64(order.cases));
    if (!res2.ok) {
      var err2 = await res2.text();
      console.error('[Order Save] Retry failed:', res2.status, err2);
    } else {
      console.warn('[Order Save] Saved without large STL data.');
    }
  } catch(e) { console.error('[Order Save]', e); }
}
async function loadOrdersFromSupabase() {
  try {
    var rows = await sbGetCustomOrders(currentUser.nickname, isAdmin());
    customOrders = rows.map(function(r) {
      return {
        id: r.id, clinic: r.clinic, addr: r.addr, phone: r.phone,
        lineId: r.line_id, cases: r.cases || [], stage: r.stage,
        designVersions: r.design_versions || [],
        reviewHistory: r.review_history || [], date: r.date,
        userNickname: r.user_nickname,
        carrier: r.carrier || '', trackingNumber: r.tracking_number || ''
      };
    });
  } catch(e) { console.error('[Order Load]', e); }
}
async function updateOrderInSupabase(orderId, updates) {
  try {
    await sbUpdateCustomOrder(orderId, updates);
  } catch(e) { console.error('[Order Update]', e); }
}
async function sendLineRaw(to, text) {
  if (!LINE_PROXY_URL || !to) return;
  try {
    await fetch(LINE_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: to, messages: [{ type: 'text', text: text }] })
    });
  } catch(e) { console.error('[LINE]', e); }
}
function adminConfirmOrder(orderId) {
  var ord = customOrders.find(function(o){ return o.id===orderId; });
  if (!ord) return;
  ord.stage = 'confirmed';
  updateOrderInSupabase(orderId, { stage: 'confirmed' });
  renderAdminOrders();
  renderCustomOrders();
  sendStatusChangeNotification(ord.lineId, {
    orderId: ord.id, icon: '✅', statusTh: 'ยืนยันแล้ว',
    clinic: ord.clinic, note: 'เมื่อออกแบบเสร็จแล้ว คุณสามารถตรวจสอบได้ในแอป', subtitle: 'CNC Custom Order'
  });
}
async function adminUploadDesign(orderId, input) {
  var file = input.files[0]; if (!file) return;
  var ord = customOrders.find(function(o){ return o.id===orderId; });
  if (!ord) return;
  var ext = file.name.split('.').pop().toLowerCase();
  var ver = ((ord.designVersions||[]).length + 1);
  var fileName = orderId + '_v' + ver + '_' + Date.now() + '.' + ext;
  var isImg = /^(jpg|jpeg|png|gif|webp)$/.test(ext);
  var fileUrl = null;
  // ① Supabase Storage 업로드 시도
  try {
    var storageRes = await fetch(SUPABASE_URL + '/storage/v1/object/designs/' + fileName, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': file.type,
        'x-upsert': 'true'
      },
      body: file
    });
    if (storageRes.ok) {
      fileUrl = SUPABASE_URL + '/storage/v1/object/public/designs/' + fileName;
    }
  } catch(e) {}
  // ② Storage 실패 시 base64 fallback
  if (!fileUrl) {
    fileUrl = await new Promise(function(resolve) {
      var r = new FileReader();
      r.onload = function(e) { resolve(e.target.result); };
      r.readAsDataURL(file);
    });
    isImg = fileUrl.startsWith('data:image');
  }
  if (!ord.designVersions) ord.designVersions = [];
  ord.designVersions.push({ url: fileUrl, date: new Date().toLocaleDateString(), name: file.name });
  ord.stage = 'design_ready';
  updateOrderInSupabase(orderId, { stage: 'design_ready', designVersions: ord.designVersions });
  renderAdminOrders();
  renderCustomOrders();
  // ③ 고객에게 LINE 알림 (이미지 + Flex) — 태국어
  if (ord.lineId) {
    var msgs = [];
    var isPublicImg = isImg && fileUrl.startsWith('https');
    if (isPublicImg) {
      msgs.push({ type: 'image', originalContentUrl: fileUrl, previewImageUrl: fileUrl });
    }
    var dateStr = new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' });
    msgs.push(buildFlexMessage('📐', 'รอตรวจแบบ', [
      {label:'หมายเลขคำสั่งซื้อ', value: ord.id},
      {label:'สถานะ', value: '📐 รอตรวจแบบ'},
      {label:'วันที่', value: dateStr},
      {label:'คลินิก', value: ord.clinic},
      {label:'เวอร์ชัน', value: 'ver.' + ord.designVersions.length}
    ], 'กรุณาตรวจสอบแบบในแอปแล้วเลือกอนุมัติหรือแก้ไข', 'CNC Custom Order'));
    sendLineMessage(ord.lineId, msgs);
  }
}
// LINE 멀티 메시지 (이미지 + 텍스트 조합 지원)
async function sendLineMessage(to, messages) {
  if (!LINE_PROXY_URL || !to) return;
  try {
    await fetch(LINE_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: to, messages: messages })
    });
  } catch(e) { console.error('[LINE]', e); }
}
// 고객 수령 완료
function customerReceiveOrder(orderId) {
  var ord = customOrders.find(function(o){ return o.id===orderId; });
  if (!ord) return;
  if (!confirm('제품을 수령하셨습니까?')) return;
  ord.stage = 'done';
  updateOrderInSupabase(orderId, { stage: 'done' });
  renderCustomOrders();
  _renderAdminOrdersList();
  var dateStrRecv = new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' });
  sendLineMessage(LINE_USER_ID, [buildFlexMessage('📦', 'ส่งมอบแล้ว', [
    {label:'หมายเลขคำสั่งซื้อ', value: ord.id},
    {label:'สถานะ', value: '📦 ส่งมอบแล้ว'},
    {label:'วันที่', value: dateStrRecv},
    {label:'คลินิก', value: ord.clinic}
  ], 'ลูกค้าได้รับสินค้าเรียบร้อยแล้ว คำสั่งซื้อเสร็จสมบูรณ์ ✅', 'CNC Custom Order')]);
}
function customerApproveDesign(orderId) {
  var ord = customOrders.find(function(o){ return o.id===orderId; });
  if (!ord) return;
  ord.stage = 'approved';
  if (!ord.reviewHistory) ord.reviewHistory = [];
  ord.reviewHistory.push({ action:'approved', note:'만족', date:new Date().toLocaleDateString() });
  updateOrderInSupabase(orderId, { stage: 'approved', reviewHistory: ord.reviewHistory });
  renderCustomOrders();
  _renderAdminOrdersList();
  var dateStrAppr = new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' });
  sendLineMessage(LINE_USER_ID, [buildFlexMessage('✅', 'ลูกค้าอนุมัติแบบ', [
    {label:'หมายเลขคำสั่งซื้อ', value: ord.id},
    {label:'สถานะ', value: '✅ อนุมัติแบบแล้ว'},
    {label:'วันที่', value: dateStrAppr},
    {label:'คลินิก', value: ord.clinic}
  ], 'ลูกค้าอนุมัติแบบแล้ว กรุณาเริ่มกระบวนการมิลลิ่ง', 'CNC Custom Order')]);
}
function showRejectPanel(orderId) {
  var panel = document.getElementById('reject-panel-' + orderId);
  if (panel) panel.classList.toggle('hidden');
}
function customerRejectDesign(orderId) {
  var ord = customOrders.find(function(o){ return o.id===orderId; });
  if (!ord) return;
  var noteEl = document.getElementById('reject-note-' + orderId);
  var note = noteEl ? noteEl.value.trim() : '';
  if (!note) { alert('수정 요청사항을 입력해주세요.'); return; }
  ord.stage = 'design_revision';
  if (!ord.reviewHistory) ord.reviewHistory = [];
  ord.reviewHistory.push({ action:'rejected', note:note, date:new Date().toLocaleDateString() });
  updateOrderInSupabase(orderId, { stage: 'design_revision', reviewHistory: ord.reviewHistory });
  renderCustomOrders();
  _renderAdminOrdersList();
  var dateStrRej = new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' });
  sendLineMessage(LINE_USER_ID, [buildFlexMessage('❌', 'ลูกค้าขอแก้ไขแบบ', [
    {label:'หมายเลขคำสั่งซื้อ', value: ord.id},
    {label:'สถานะ', value: '❌ กำลังแก้ไขแบบ'},
    {label:'วันที่', value: dateStrRej},
    {label:'คลินิก', value: ord.clinic},
    {label:'รายละเอียด', value: note}
  ], 'กรุณาแก้ไขแบบแล้วอัปโหลดใหม่', 'CNC Custom Order')]);
}
function adminStartMilling(orderId) {
  var ord = customOrders.find(function(o){ return o.id===orderId; });
  if (!ord) return;
  if (!confirm('밀링을 시작하시겠습니까?')) return;
  ord.stage = 'milling';
  updateOrderInSupabase(orderId, { stage: 'milling' });
  renderAdminOrders();
  renderCustomOrders();
  sendStatusChangeNotification(ord.lineId, {
    orderId: ord.id, icon: '⚙️', statusTh: 'กำลัง CNC มิลลิ่ง',
    clinic: ord.clinic, note: 'เริ่มกระบวนการ CNC มิลลิ่งแล้ว เมื่อเสร็จจะจัดส่งให้ทันที', subtitle: 'CNC Custom Order'
  });
}
function adminShipOrder(orderId) {
  var modal = document.getElementById('shippingModal');
  if (!modal) return;
  modal.dataset.orderId = orderId;
  document.getElementById('ship-carrier').value = '';
  document.getElementById('ship-tracking').value = '';
  document.getElementById('ship-carrier-custom-wrap').classList.add('hidden');
  modal.classList.remove('hidden');
}
function toggleCustomCarrier() {
  var sel = document.getElementById('ship-carrier');
  document.getElementById('ship-carrier-custom-wrap').classList.toggle('hidden', sel.value !== 'custom');
}
function closeShippingModal() {
  document.getElementById('shippingModal').classList.add('hidden');
}
async function adminConfirmShipping() {
  var modal = document.getElementById('shippingModal');
  var orderId = modal.dataset.orderId;
  var sel = document.getElementById('ship-carrier');
  var carrier = sel.value === 'custom'
    ? (document.getElementById('ship-carrier-custom').value.trim())
    : sel.value;
  var trackingNumber = document.getElementById('ship-tracking').value.trim();
  if (!carrier) { alert('배송사를 선택해주세요.'); return; }
  if (!trackingNumber) { alert('송장번호를 입력해주세요.'); return; }
  var ord = customOrders.find(function(o){ return o.id===orderId; });
  if (!ord) return;
  ord.stage = 'shipped';
  ord.carrier = carrier;
  ord.trackingNumber = trackingNumber;
  updateOrderInSupabase(orderId, { stage: 'shipped', carrier: carrier, trackingNumber: trackingNumber });
  closeShippingModal();
  renderAdminOrders();
  renderCustomOrders();
  if (ord.lineId) {
    var shipMsgs = [];
    var latestDesign = ord.designVersions && ord.designVersions.length ? ord.designVersions[ord.designVersions.length-1] : null;
    if (latestDesign && latestDesign.url && latestDesign.url.startsWith('https')) {
      shipMsgs.push({ type: 'image', originalContentUrl: latestDesign.url, previewImageUrl: latestDesign.url });
    }
    var dateStr = new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' });
    shipMsgs.push(buildFlexMessage('🚚', 'ส่งพัสดุแล้ว', [
      {label:'หมายเลขคำสั่งซื้อ', value: ord.id},
      {label:'สถานะ', value: '🚚 ส่งพัสดุแล้ว'},
      {label:'วันที่', value: dateStr},
      {label:'คลินิก', value: ord.clinic},
      {label:'ขนส่ง', value: carrier},
      {label:'เลขพัสดุ', value: trackingNumber}
    ], 'จัดส่งแล้ว กรุณากดปุ่มยืนยันรับสินค้าในแอป', 'CNC Custom Order'));
    sendLineMessage(ord.lineId, shipMsgs);
  }
}
async function renderAdminPanel() {
  var panel = document.getElementById('adminPanel');
  if (!panel) return;
  if (!isAdmin() && !isRegionLeader()) { document.body.classList.remove('is-admin'); return; }
  document.body.classList.add('is-admin');
  renderAdminSummaryCards();
  if (isRegionLeader()) {
    // 리더는 포럼/이벤트/회원 탭만 접근
    adminShowTab('forum');
  } else {
    adminShowTab('orders');
  }
}
async function renderAdminSummaryCards() {
  var container = document.getElementById('adminSummaryCards');
  if (!container) return;
  var renderCards = function(totalMembers, totalPending, todaySignups) {
    var cards = [
      { label: t('admin_total_members'), value: totalMembers, bg: 'bg-[#001d4a]', icon: '👥' },
      { label: t('admin_pending_orders'), value: totalPending, bg: 'bg-amber-500', icon: '📦' },
      { label: t('admin_today_signups'), value: todaySignups, bg: 'bg-green-600', icon: '✨' },
    ];
    container.innerHTML = cards.map(function(c) {
      return '<div class="' + c.bg + ' rounded-2xl p-3 text-center text-white shadow">' +
        '<div class="text-lg mb-0.5">' + c.icon + '</div>' +
        '<div class="font-black text-2xl leading-none">' + c.value + '</div>' +
        '<div class="text-[9px] font-bold opacity-80 mt-1 leading-tight">' + c.label + '</div>' +
      '</div>';
    }).join('');
  };
  // Initial render with loading state
  renderCards('…', '…', '…');
  // Fetch all data from Supabase
  var totalMembers = '—';
  var todaySignups = '—';
  var totalPending = 0;
  try {
    var today = new Date().toISOString().split('T')[0];
    // 병렬로 회원 + 주문 데이터 조회
    var results = await Promise.all([
      sbGet('licenses', 'select=license_number,created_at'),
      sbGetShopOrders(currentUser.nickname, true),
      sbGetCustomOrders(currentUser.nickname, true)
    ]);
    var usersData = results[0];
    var sbShopOrders = results[1];
    var sbCustomOrders = results[2];
    totalMembers = usersData.length;
    todaySignups = usersData.filter(function(u) {
      return u.created_at && u.created_at.startsWith(today);
    }).length;
    var pendingShop = sbShopOrders.filter(function(o){ return o.stage === 'submitted'; }).length;
    var pendingCnc = sbCustomOrders.filter(function(o){ return o.stage === 'submitted'; }).length;
    totalPending = pendingShop + pendingCnc;
  } catch(e) { console.warn('[Summary Cards]', e); }
  renderCards(totalMembers, totalPending, todaySignups);
}
async function adminReuploadStl(orderId, caseIdx, fileIdx, fileName, input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];
  var ord = customOrders.find(function(o){ return o.id===orderId; });
  if (!ord || !ord.cases[caseIdx]) return;
  var btn = input.previousElementSibling;
  if (btn) btn.textContent = '⏳';
  var origExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase() || '.stl';
  var fname = orderId + '_case' + (caseIdx+1) + '_' + fileIdx + '_' + Date.now() + origExt;
  var stlUrl = null;
  // Try Supabase Storage
  try {
    var r = await fetch(SUPABASE_URL + '/storage/v1/object/stl-file/' + fname, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/octet-stream', 'x-upsert': 'true' },
      body: file
    });
    if (r.ok) {
      stlUrl = SUPABASE_URL + '/storage/v1/object/public/stl-file/' + fname;
    }
  } catch(e) {}
  // Fallback: base64
  if (!stlUrl) {
    stlUrl = await new Promise(function(resolve) {
      var reader = new FileReader();
      reader.onload = function(ev) { resolve(ev.target.result); };
      reader.onerror = function() { resolve(null); };
      reader.readAsDataURL(file);
    });
  }
  if (!stlUrl) { if (btn) btn.textContent = '❌'; return; }
  if (!ord.cases[caseIdx].stlUrls) ord.cases[caseIdx].stlUrls = [];
  while (ord.cases[caseIdx].stlUrls.length <= fileIdx) ord.cases[caseIdx].stlUrls.push(null);
  ord.cases[caseIdx].stlUrls[fileIdx] = stlUrl;
  // Save updated cases to Supabase
  try {
    var casesNoLargeBase64 = ord.cases.map(function(cs) {
      return Object.assign({}, cs, {
        stlUrls: (cs.stlUrls || []).map(function(u) {
          return (u && (u.startsWith('http') || u.length < 1024 * 1024)) ? u : null;
        })
      });
    });
    await sbUpdateCustomOrder(orderId, { cases: casesNoLargeBase64 });
  } catch(e) { console.error('[Reupload Save]', e); }
  renderAdminOrders();
}
// ============================================================
// 쇼핑몰 주문 관리
// ============================================================
var SHOP_STAGES = [
  { key:'submitted', label:'주문접수',   icon:'📥', next:'paid' },
  { key:'paid',      label:'결제완료',   icon:'💳', next:'preparing' },
  { key:'preparing', label:'제품준비중', icon:'📦', next:'shipped' },
  { key:'shipped',   label:'배송중',     icon:'🚚', next:'delivered' },
  { key:'delivered', label:'배송완료',   icon:'✅', next:null },
];
// ── 태국어 상태 라벨 (LINE 알림용) ──────────────────────────
var SHOP_STAGE_TH = {
  submitted:'รับคำสั่งซื้อแล้ว', paid:'ชำระเงินแล้ว',
  preparing:'กำลังเตรียมสินค้า', shipped:'กำลังจัดส่ง', delivered:'จัดส่งเรียบร้อย'
};
// ── LINE 상태변경 알림 (태국어) ──────────────────────────────
function sendStatusChangeNotification(lineId, opts) {
  if (!lineId || !LINE_PROXY_URL) return;
  var dateStr = new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' });
  var fields = [
    { label: 'หมายเลขคำสั่งซื้อ', value: opts.orderId },
    { label: 'สถานะ', value: opts.icon + ' ' + opts.statusTh },
    { label: 'วันที่', value: dateStr }
  ];
  if (opts.clinic) fields.push({ label: 'คลินิก', value: opts.clinic });
  if (opts.carrier) fields.push({ label: 'ขนส่ง', value: opts.carrier });
  if (opts.tracking) fields.push({ label: 'เลขพัสดุ', value: opts.tracking });
  if (opts.extraFields) fields = fields.concat(opts.extraFields);
  var note = opts.note || 'สถานะคำสั่งซื้อของคุณมีการเปลี่ยนแปลง';
  var subtitle = opts.subtitle || 'BIOPLANT · Dentalk';
  sendLineMessage(lineId, [buildFlexMessage(opts.icon, opts.statusTh, fields, note, subtitle)]);
}
var currentShopStageTab = 'submitted';
var _cachedShopOrders = [];
function adminShopStageTab(stageKey) {
  currentShopStageTab = stageKey;
  renderAdminShopOrders();
}
async function renderAdminShopOrders() {
  var list = document.getElementById('adminTabShopOrders');
  if (!list) return;
  var orders = JSON.parse(localStorage.getItem('dentalk_shop_orders') || '[]');
  // Supabase에서 최신 데이터 로드
  try {
    var sbOrders = await sbGetShopOrders(currentUser.nickname, isAdmin());
    if (sbOrders && sbOrders.length) {
      orders = sbOrders.map(function(r) {
        return {
          id: r.id, date: r.date, clinic: r.clinic, phone: r.phone,
          address: r.addr, lineId: r.line_id, nickname: r.user_nickname,
          items: r.items || [], stage: r.stage,
          carrier: r.carrier || '', tracking: r.tracking_number || '',
          totalAmount: (r.items || []).reduce(function(s,i){ return s + (i.price||0)*(i.qty||1); }, 0)
        };
      });
      // 메모리 + localStorage 캐시 업데이트
      _cachedShopOrders = orders;
      localStorage.setItem('dentalk_shop_orders', JSON.stringify(orders));
    }
  } catch(e) { console.warn('[Shop Orders Load]', e); }
  // 단계별 카운트
  var counts = {};
  SHOP_STAGES.forEach(function(s){ counts[s.key] = 0; });
  orders.forEach(function(o){ if (counts[o.stage] !== undefined) counts[o.stage]++; });
  // 단계 탭 버튼
  var tabsHtml = '<div class="flex gap-1 overflow-x-auto pb-2 mb-3 -mx-0.5 px-0.5">' +
    SHOP_STAGES.map(function(s){
      var active = s.key === currentShopStageTab;
      var hasOrders = counts[s.key] > 0;
      return '<button onclick="adminShopStageTab(\'' + s.key + '\')" class="shrink-0 px-3 py-2 rounded-xl font-black text-xs transition ' +
        (active ? 'bg-[#001d4a] text-white shadow' : 'bg-slate-100 text-slate-500') + '">' +
        s.icon + ' ' + s.label +
        '<span class="ml-1 font-mono ' + (hasOrders ? 'text-amber-400' : (active ? 'text-slate-300' : 'text-slate-400')) + '">(' + counts[s.key] + ')</span>' +
      '</button>';
    }).join('') + '</div>';
  var filtered = orders.filter(function(o){ return o.stage === currentShopStageTab; });
  var contentHtml;
  if (!filtered.length) {
    contentHtml = '<p class="text-center text-slate-400 text-sm py-8 font-bold">해당 단계의 주문이 없습니다.</p>';
  } else {
    // Stage badge colors
    var stageBadgeClass = {
      submitted:'bg-amber-100 text-amber-700',
      paid:'bg-blue-100 text-blue-700',
      preparing:'bg-purple-100 text-purple-700',
      shipped:'bg-cyan-100 text-cyan-700',
      delivered:'bg-green-100 text-green-700'
    };
    contentHtml = filtered.map(function(o){
      var stage = SHOP_STAGES.find(function(s){ return s.key===o.stage; }) || SHOP_STAGES[0];
      var nextStage = stage.next ? SHOP_STAGES.find(function(s){ return s.key===stage.next; }) : null;
      var itemsHtml = o.items.map(function(i){
        return '<div class="flex justify-between text-[10px] gap-1"><span class="flex-1 font-bold truncate">' + i.name + '</span><span class="font-mono text-slate-400">' + i.code + '</span><span class="font-black">×' + i.qty + '</span><span class="font-mono font-black">' + (i.price*i.qty).toLocaleString() + '</span></div>';
      }).join('');
      var advanceBtn = nextStage
        ? '<button onclick="adminAdvanceShopOrder(\'' + o.id + '\')" class="w-full mt-2 py-2 bg-blue-600 text-white rounded-xl font-black text-xs active:scale-95 transition">' + nextStage.icon + ' ' + nextStage.label + ' → LINE</button>'
        : '<div class="mt-2 text-center"><p class="text-[10px] font-black text-green-500">✅ ' + t('shipped_status') + '</p></div>';
      var stageDropdown = '<div class="mt-2">' +
        '<label class="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">' + t('admin_change_status') + '</label>' +
        '<select onchange="adminChangeShopOrderStage(\'' + o.id + '\',this.value)" class="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-blue-400 bg-white">' +
        SHOP_STAGES.map(function(s) {
          return '<option value="' + s.key + '"' + (s.key === o.stage ? ' selected' : '') + '>' + s.icon + ' ' + s.label + '</option>';
        }).join('') +
        '</select></div>';
      var badgeCls = stageBadgeClass[o.stage] || 'bg-slate-100 text-slate-600';
      return '<div class="bg-white rounded-2xl shadow-sm overflow-hidden">' +
        // Table-style header row: status badge | customer name | date | total
        '<div class="px-4 py-3 border-b border-slate-50">' +
          '<div class="flex items-center justify-between gap-2 mb-1">' +
            '<span class="text-[10px] font-black px-2 py-0.5 rounded-full ' + badgeCls + '">' + stage.icon + ' ' + stage.label + '</span>' +
            '<span class="text-[9px] font-mono text-slate-400">' + o.date + '</span>' +
          '</div>' +
          '<div class="flex items-end justify-between gap-2">' +
            '<div class="min-w-0">' +
              '<p class="font-black text-slate-800 text-sm truncate">' + o.clinic + '</p>' +
              '<p class="text-[9px] font-mono text-slate-400">' + o.id + '</p>' +
            '</div>' +
            '<p class="font-black text-blue-700 text-sm shrink-0">' + (o.totalAmount||0).toLocaleString() + ' <span class="text-[9px] font-bold">THB</span></p>' +
          '</div>' +
        '</div>' +
        '<div class="px-4 pt-2 pb-4">' +
          '<p class="text-[9px] text-slate-400 mb-1">📞 ' + o.phone + ' · 📍 ' + o.address + '</p>' +
          (o.lineId ? '<p class="text-[9px] text-green-500 font-bold mb-1">💬 Line: ' + o.lineId + '</p>' : '') +
          (o.carrier ? '<p class="text-[9px] text-blue-500 font-bold mb-1">🚚 ' + o.carrier + (o.tracking ? ' · ' + o.tracking : '') + '</p>' : '') +
          '<div class="bg-slate-50 rounded-xl p-2 space-y-0.5 mb-1">' + itemsHtml + '</div>' +
          advanceBtn +
          stageDropdown +
        '</div>' +
      '</div>';
    }).join('');
  }
  list.innerHTML = tabsHtml + '<div class="space-y-3">' + contentHtml + '</div>';
}
function adminAdvanceShopOrder(orderId) {
  var orders = _cachedShopOrders.length ? _cachedShopOrders : JSON.parse(localStorage.getItem('dentalk_shop_orders') || '[]');
  var o = orders.find(function(x){ return x.id===orderId; });
  if (!o) return;
  var stage = SHOP_STAGES.find(function(s){ return s.key===o.stage; });
  if (!stage || !stage.next) return;
  // 배송 단계는 배송사/송장번호 입력 모달을 먼저 표시
  if (stage.next === 'shipped') {
    openShopShippingModal(orderId);
    return;
  }
  _doAdvanceShopOrder(orderId, stage.next, null, null);
}
function adminChangeShopOrderStage(orderId, newStage) {
  if (newStage === 'shipped') {
    var orders = _cachedShopOrders.length ? _cachedShopOrders : JSON.parse(localStorage.getItem('dentalk_shop_orders') || '[]');
    var o = orders.find(function(x){ return x.id===orderId; });
    if (o && !o.carrier) {
      openShopShippingModal(orderId);
      return;
    }
  }
  _doAdvanceShopOrder(orderId, newStage, null, null);
  renderAdminSummaryCards();
}
function openShopShippingModal(orderId) {
  var modal = document.getElementById('shopShippingModal');
  if (!modal) return;
  modal.dataset.orderId = orderId;
  document.getElementById('sship-carrier').value = '';
  document.getElementById('sship-tracking').value = '';
  document.getElementById('sship-carrier-custom-wrap').classList.add('hidden');
  modal.classList.remove('hidden');
}
function closeShopShippingModal() {
  document.getElementById('shopShippingModal').classList.add('hidden');
}
function toggleShopCustomCarrier() {
  var sel = document.getElementById('sship-carrier');
  document.getElementById('sship-carrier-custom-wrap').classList.toggle('hidden', sel.value !== 'custom');
}
function adminConfirmShopShipping() {
  var modal = document.getElementById('shopShippingModal');
  var orderId = modal.dataset.orderId;
  var sel = document.getElementById('sship-carrier');
  var carrier = sel.value === 'custom'
    ? document.getElementById('sship-carrier-custom').value.trim()
    : sel.value;
  var tracking = document.getElementById('sship-tracking').value.trim();
  if (!carrier) { alert('배송사를 선택해주세요.'); return; }
  if (!tracking) { alert('송장번호를 입력해주세요.'); return; }
  closeShopShippingModal();
  _doAdvanceShopOrder(orderId, 'shipped', carrier, tracking);
}
function _doAdvanceShopOrder(orderId, nextKey, carrier, tracking) {
  var orders = _cachedShopOrders.length ? _cachedShopOrders : JSON.parse(localStorage.getItem('dentalk_shop_orders') || '[]');
  var o = orders.find(function(x){ return x.id===orderId; });
  if (!o) return;
  o.stage = nextKey;
  if (carrier) o.carrier = carrier;
  if (tracking) o.tracking = tracking;
  var nextStage = SHOP_STAGES.find(function(s){ return s.key===nextKey; });
  _cachedShopOrders = orders;
  localStorage.setItem('dentalk_shop_orders', JSON.stringify(orders));
  // Supabase 업데이트
  var sbUpdates = { stage: nextKey };
  if (carrier)  sbUpdates.carrier         = carrier;
  if (tracking) sbUpdates.tracking_number = tracking;
  sbUpdateShopOrder(orderId, sbUpdates).catch(function(e){ console.error('[Shop Order Update]', e); });
  // 고객에게 LINE flex 발송 (태국어)
  var shopStageTh = SHOP_STAGE_TH[nextKey] || nextKey;
  var dateStrShop = new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' });
  if (o.lineId) {
    var itemRows = (o.items || []).map(function(i) {
      return { label: i.name, value: '[' + i.code + '] ×' + i.qty + '  ' + (i.price * i.qty).toLocaleString() + ' THB' };
    });
    var fields = [
      { label: 'หมายเลขคำสั่งซื้อ', value: o.id },
      { label: 'สถานะ', value: nextStage.icon + ' ' + shopStageTh },
      { label: 'วันที่', value: dateStrShop },
      { label: 'คลินิก', value: o.clinic },
    ];
    if (carrier)  fields.push({ label: 'ขนส่ง', value: carrier });
    if (tracking) fields.push({ label: 'เลขพัสดุ', value: tracking });
    fields = fields.concat(itemRows);
    fields.push({ label: 'รวม', value: (o.totalAmount || 0).toLocaleString() + ' THB' });
    sendLineMessage(o.lineId, [buildFlexMessage(nextStage.icon, shopStageTh, fields, 'สอบถาม: Line @bioplant_th', 'Shop Order')]);
  }
  // 관리자에게도 flex 알림 (태국어)
  var adminFields = [
    { label: 'หมายเลขคำสั่งซื้อ', value: o.id },
    { label: 'คลินิก', value: o.clinic },
    { label: 'สถานะใหม่', value: nextStage.icon + ' ' + shopStageTh },
    { label: 'วันที่', value: dateStrShop },
  ];
  if (carrier)  adminFields.push({ label: 'ขนส่ง', value: carrier });
  if (tracking) adminFields.push({ label: 'เลขพัสดุ', value: tracking });
  sendLineMessage(LINE_USER_ID, [buildFlexMessage('🔄', 'เปลี่ยนสถานะคำสั่งซื้อ', adminFields, null, 'Shop Order')]);
  renderAdminShopOrders();
}
function renderAdminUsed() {
  var list = document.getElementById('adminTabUsed');
  if (!list) return;
  if (!usedItems.length) { list.innerHTML = '<p class="text-center text-slate-400 text-sm py-8 font-bold">중고 게시물이 없습니다.</p>'; return; }
  var condLabel = {new:'Like New', good:'Good', fair:'Fair'};
  var condColor = {new:'bg-green-100 text-green-700', good:'bg-blue-100 text-blue-700', fair:'bg-yellow-100 text-yellow-700'};
  list.innerHTML = usedItems.map(function(item, i) {
    return '<div class="bg-white rounded-2xl shadow-sm p-4">' +
      '<div class="flex justify-between items-start gap-3">' +
        (item.image ? '<img src="' + item.image + '" class="w-14 h-14 rounded-xl object-cover shrink-0" loading="lazy">' : '<div class="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">📦</div>') +
        '<div class="flex-1 min-w-0">' +
          '<p class="font-black text-slate-800 text-sm truncate">' + item.name + '</p>' +
          '<p class="text-[9px] font-mono text-slate-400">' + item.code + '</p>' +
          '<p class="font-black text-blue-700 text-xs mt-0.5">' + item.price.toLocaleString() + ' THB</p>' +
          '<span class="inline-block text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-1 ' + condColor[item.cond] + '">' + condLabel[item.cond] + '</span>' +
        '</div>' +
        '<button onclick="adminDeleteUsed(' + i + ')" class="shrink-0 px-2 py-1 bg-red-50 text-red-500 rounded-lg font-black text-[10px] active:scale-95 transition">🗑 삭제</button>' +
      '</div>' +
      '<div class="mt-2 pt-2 border-t border-slate-100 flex justify-between text-[9px] text-slate-400">' +
        '<span>' + item.seller + ' · ' + item.date + '</span>' +
        '<span>👁 ' + (item.views||0) + '</span>' +
      '</div>' +
    '</div>';
  }).join('');
}
function adminDeleteUsed(i) {
  if (!confirm('이 게시물을 삭제하시겠습니까?')) return;
  var removed = usedItems[i];
  usedItems.splice(i, 1);
  renderUsed();
  renderAdminUsed();
  if (removed && (removed._sbId || typeof removed.id === 'string')) {
    sbDeleteUsedItem(removed._sbId || removed.id).catch(function(e){ console.error('[Admin Used Delete]', e); });
  }
}
function renderAdminForum() {
  var list = document.getElementById('adminTabForum');
  if (!list) return;
  if (!posts.length) { list.innerHTML = '<p class="text-center text-slate-400 text-sm py-8 font-bold">' + t('forum_empty') + '</p>'; return; }
  list.innerHTML = posts.map(function(post, i) {
    var catBadge = post.category === 'implant'
      ? '<span class="bg-blue-100 text-blue-700 text-[8px] font-black px-1.5 py-0.5 rounded-full">🦷 임플란트</span>'
      : '<span class="bg-purple-100 text-purple-700 text-[8px] font-black px-1.5 py-0.5 rounded-full">💎 보철</span>';
    var regionBadge = '';
    if (post.region && post.region !== 'all') {
      var rCfg = FORUM_REGIONS.find(function(r){ return r.key === post.region; });
      var pLabel = '';
      if (post.province && post.province !== 'all' && rCfg) {
        var pCfg = rCfg.provinces.find(function(x){ return x.key === post.province; });
        if (pCfg) pLabel = pCfg.label;
      }
      var rLabel = rCfg ? (rCfg.icon + ' ' + t(rCfg.labelKey)) : post.region;
      regionBadge = '<span class="bg-emerald-100 text-emerald-700 text-[8px] font-black px-1.5 py-0.5 rounded-full">' + rLabel + (pLabel ? ' · ' + pLabel : '') + '</span>';
    }
    return '<div class="bg-white rounded-2xl shadow-sm p-4">' +
      '<div class="flex justify-between items-start gap-2">' +
        '<div class="flex-1 min-w-0">' +
          '<div class="flex items-center gap-2 flex-wrap mb-1">' + catBadge + regionBadge + '</div>' +
          '<p class="font-black text-slate-800 text-sm leading-snug">' + post.title + '</p>' +
          '<p class="text-[10px] text-slate-400 mt-1 line-clamp-2">' + post.body + '</p>' +
          '<p class="text-[9px] text-slate-300 mt-1">' + post.author + ' · ' + (post.date||'') + ' · 👁 ' + (post.views||0) + ' · 💬 ' + (post.comments?post.comments.length:0) + '</p>' +
        '</div>' +
        '<button onclick="adminDeletePost(' + i + ')" class="shrink-0 px-2 py-1 bg-red-50 text-red-500 rounded-lg font-black text-[10px] active:scale-95 transition">🗑 삭제</button>' +
      '</div>' +
    '</div>';
  }).join('');
}
function adminDeletePost(i) {
  if (!confirm('이 게시물을 삭제하시겠습니까?')) return;
  var removed = posts[i];
  posts.splice(i, 1);
  renderForum();
  renderAdminForum();
  if (removed && (removed._sbId || typeof removed.id === 'string')) {
    sbDeleteForumPost(removed._sbId || removed.id).catch(function(e){ console.error('[Admin Post Delete]', e); });
  }
}
async function renderAdminOrders() {
  var list = document.getElementById('adminTabOrders');
  if (!list) return;
  list.innerHTML = '<p class="text-center text-slate-400 text-sm py-8 font-bold">로딩 중...</p>';
  await loadOrdersFromSupabase();
  _renderAdminOrdersList();
}
var adminOrderSubTab = 'new';
function adminShowOrderSubTab(tab) {
  adminOrderSubTab = tab;
  ['new','active','done'].forEach(function(name) {
    var el  = document.getElementById('adminOrderSub-' + name);
    var btn = document.getElementById('adminOrderSubBtn-' + name);
    if (!el || !btn) return;
    if (name === tab) { el.classList.remove('hidden'); } else { el.classList.add('hidden'); }
    btn.className = name === tab
      ? 'flex-1 py-1.5 rounded-xl font-black text-[10px] bg-[#001d4a] text-white'
      : 'flex-1 py-1.5 rounded-xl font-black text-[10px] bg-slate-100 text-slate-500';
  });
}
function _buildAdminOrderCard(o) {
  var stageLabel = t('stage_' + o.stage) || o.stage;
  var totalTeeth = o.cases.reduce(function(s,cs){ return s+(cs.teeth?cs.teeth.length:0); },0);
  // STL 다운로드 링크 (케이스당 최대 10개)
  var stlHtml = o.cases.map(function(cs, ci) {
    // 신규 배열 형식 또는 구버전 단일 필드 모두 처리
    var names = (cs.stls && cs.stls.length) ? cs.stls : (cs.stl ? [cs.stl] : []);
    var urls  = (cs.stlUrls && cs.stlUrls.length) ? cs.stlUrls : (cs.stlUrl ? [cs.stlUrl] : []);
    if (!names.length) return '';
    var filesHtml = names.map(function(name, fi) {
      var url = urls[fi] || null;
      return '<div class="flex items-center justify-between gap-1 py-1 border-b border-slate-50 last:border-0">' +
        '<div class="flex items-center gap-1 min-w-0">' +
          '<span class="text-xs">🧊</span>' +
          '<p class="text-[9px] text-slate-500 truncate max-w-[120px] font-bold">' + name + '</p>' +
        '</div>' +
        '<div class="flex gap-1 flex-shrink-0">' +
          (url
            ? (url.startsWith('http') ? '<button onclick="openStlViewer(\'' + url + '\',\'' + name.replace(/'/g,"\\'") + '\')" class="px-2 py-1 bg-blue-600 text-white rounded-lg font-black text-[8px] active:scale-95 transition">👁</button>' : '') +
              '<a href="' + url + '" download="' + name + '" class="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg font-black text-[8px] active:scale-95 transition inline-flex items-center">📥</a>'
            : '<label class="cursor-pointer"><span class="px-2 py-1 bg-orange-100 text-orange-600 rounded-lg font-black text-[8px]">📎 재업로드</span><input type="file" class="hidden" onchange="adminReuploadStl(\'' + o.id + '\',' + ci + ',' + fi + ',\'' + name + '\',this)"></label>') +
        '</div>' +
      '</div>';
    }).join('');
    return '<div class="py-1">' +
      '<p class="text-[9px] font-black text-slate-400 mb-1">케이스 ' + (ci+1) + ' · ' + (cs.patient||'-') + ' · STL ' + names.length + '개</p>' +
      filesHtml +
    '</div>';
  }).join('');
  var actionHtml = '';
  if (o.stage === 'submitted') {
    actionHtml = '<button onclick="adminConfirmOrder(\'' + o.id + '\')" class="w-full py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs mt-3 active:scale-95 transition">✅ 접수 확인 → LINE 발송</button>';
  } else if (o.stage === 'confirmed' || o.stage === 'design_revision') {
    var vNote = (o.designVersions && o.designVersions.length) ? ' (ver.'+(o.designVersions.length+1)+')' : '';
    actionHtml = '<div class="mt-3"><label class="block cursor-pointer">' +
      '<div class="w-full py-2.5 bg-amber-500 text-white rounded-xl font-black text-xs text-center active:scale-95 transition">📐 디자인 업로드' + vNote + '</div>' +
      '<input type="file" accept="image/*,.pdf" class="hidden" onchange="adminUploadDesign(\'' + o.id + '\',this)"></label></div>';
  } else if (o.stage === 'design_ready') {
    var latest = (o.designVersions && o.designVersions.length) ? o.designVersions[o.designVersions.length-1] : null;
    actionHtml = '<div class="mt-3 bg-blue-50 rounded-xl p-3">' +
      '<p class="text-[9px] font-black text-blue-600 mb-2">📐 고객 검토 대기 중 (ver.' + (o.designVersions?o.designVersions.length:1) + ')</p>' +
      (latest ? '<img src="' + latest.url + '" class="w-full rounded-lg max-h-28 object-contain bg-white mb-1" loading="lazy">' : '') +
      '<p class="text-[8px] text-slate-400">고객이 만족/불만족을 선택할 때까지 대기합니다.</p></div>';
  } else if (o.stage === 'approved') {
    actionHtml = '<button onclick="adminStartMilling(\'' + o.id + '\')" class="w-full py-2.5 bg-purple-600 text-white rounded-xl font-black text-xs mt-3 active:scale-95 transition">⚙️ 밀링 시작 → LINE 발송</button>';
  } else if (o.stage === 'milling') {
    actionHtml = '<button onclick="adminShipOrder(\'' + o.id + '\')" class="w-full py-2.5 bg-green-600 text-white rounded-xl font-black text-xs mt-3 active:scale-95 transition">🚚 배송 처리 → LINE 발송</button>';
  } else if (o.stage === 'shipped') {
    actionHtml = '<div class="mt-3 bg-green-50 rounded-xl p-3">' +
      '<p class="text-[9px] font-black text-green-600 mb-1">🚚 ' + t('shipped_status') + '</p>' +
      (o.carrier ? '<p class="text-[9px] text-slate-500">' + t('carrier_label') + ': ' + o.carrier + '</p>' : '') +
      (o.trackingNumber ? '<p class="text-[9px] font-mono text-slate-600 font-bold">' + t('tracking_label') + ': ' + o.trackingNumber + '</p>' : '') +
    '</div>';
  } else if (o.stage === 'done') {
    actionHtml = '<div class="mt-3 bg-slate-50 rounded-xl p-2 text-center"><p class="text-[9px] font-black text-slate-400">✅ ' + t('received_status') + '</p></div>';
  }
  var histHtml = '';
  if (o.reviewHistory && o.reviewHistory.length) {
    histHtml = '<div class="mt-2 border-t border-slate-100 pt-2">' +
      '<p class="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">' + tf('review_history_label', o.reviewHistory.length) + '</p>' +
      o.reviewHistory.map(function(r){
        return '<div class="flex gap-1 items-start text-[8px] text-slate-400 mb-0.5">' +
          '<span>' + (r.action==='approved'?'✅':'❌') + '</span>' +
          '<span class="flex-1">' + r.date + (r.note?' · '+r.note:'') + '</span></div>';
      }).join('') +
    '</div>';
  }
  return '<div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">' +
    '<div class="bg-[#001d4a] px-4 py-3 flex justify-between items-center">' +
      '<div><p class="font-black text-white text-sm">' + o.clinic + '</p>' +
           '<p class="text-blue-300 text-[9px] font-bold font-mono mt-0.5">' + o.id + ' · ' + o.date + '</p></div>' +
      '<span class="text-[10px] font-black px-2 py-1 rounded-lg bg-white/10 text-white">' + stageLabel + '</span>' +
    '</div>' +
    '<div class="px-4 py-3">' +
      '<p class="text-[10px] text-slate-500 font-bold mb-1">' + o.cases.length + '케이스 · ' + totalTeeth + '치아</p>' +
      '<p class="text-[9px] text-slate-400">📍 ' + o.addr + '</p>' +
      '<p class="text-[9px] text-slate-400">📞 ' + o.phone + '</p>' +
      (o.lineId ? '<p class="text-[9px] text-green-500 font-bold">💬 Line: ' + o.lineId + '</p>' : '<p class="text-[9px] text-red-300">⚠️ Line ID 없음</p>') +
      (stlHtml ? '<div class="mt-2 pt-2 border-t border-slate-100">' + stlHtml + '</div>' : '') +
      actionHtml +
      histHtml +
      '<div class="mt-3 pt-3 border-t border-slate-100">' +
        '<label class="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">' + t('admin_custom_change_stage') + '</label>' +
        '<select onchange="adminChangeCustomOrderStage(\'' + o.id + '\',this.value)" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-400 bg-white">' +
        ORDER_STAGES.map(function(s) {
          var sl = t('stage_' + s.key) || s.key;
          return '<option value="' + s.key + '"' + (s.key === o.stage ? ' selected' : '') + '>' + s.icon + ' ' + sl + '</option>';
        }).join('') +
        '</select>' +
      '</div>' +
    '</div>' +
  '</div>';
}
async function adminChangeCustomOrderStage(orderId, newStage) {
  var ord = customOrders.find(function(o){ return o.id === orderId; });
  if (!ord || ord.stage === newStage) return;
  var oldStage = ord.stage;
  ord.stage = newStage;
  await updateOrderInSupabase(orderId, { stage: newStage });
  _renderAdminOrdersList();
  renderCustomOrders();
  renderAdminSummaryCards();
  // LINE 알림: 고객에게 상태 변경 알림 (태국어)
  var stageObj = ORDER_STAGES.find(function(s){ return s.key === newStage; });
  var CUSTOM_STAGE_TH = {
    submitted:'รอการยืนยัน', confirmed:'ยืนยันแล้ว', design_ready:'รอตรวจแบบ',
    design_revision:'กำลังแก้ไขแบบ', approved:'อนุมัติแบบแล้ว',
    milling:'กำลัง CNC มิลลิ่ง', shipped:'ส่งพัสดุแล้ว', done:'ส่งมอบแล้ว'
  };
  var stageTh = CUSTOM_STAGE_TH[newStage] || newStage;
  var oldStageTh = CUSTOM_STAGE_TH[oldStage] || oldStage;
  if (stageObj) {
    sendStatusChangeNotification(ord.lineId, {
      orderId: ord.id, icon: stageObj.icon, statusTh: stageTh,
      clinic: ord.clinic, note: 'สถานะคำสั่งซื้อของคุณมีการเปลี่ยนแปลง', subtitle: 'CNC Custom Order'
    });
  }
  // 관리자에게도 알림
  var dateStr = new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' });
  sendLineMessage(LINE_USER_ID, [buildFlexMessage('🔄', 'เปลี่ยนสถานะคำสั่งซื้อ', [
    { label: 'หมายเลขคำสั่งซื้อ', value: ord.id },
    { label: 'คลินิก', value: ord.clinic },
    { label: 'สถานะเดิม', value: oldStageTh },
    { label: 'สถานะใหม่', value: stageTh },
    { label: 'วันที่', value: dateStr }
  ], null, 'CNC Custom Order')]);
}
function _renderAdminOrdersList() {
  var list = document.getElementById('adminTabOrders');
  if (!list) return;
  var newOrders    = customOrders.filter(function(o){ return o.stage === 'submitted'; });
  var activeOrders = customOrders.filter(function(o){ return ['confirmed','design_revision','design_ready','approved','milling','shipped'].indexOf(o.stage) !== -1; });
  var doneOrders   = customOrders.filter(function(o){ return o.stage === 'done'; });
  var emptyMsg = '<p class="col-span-2 text-center text-slate-400 text-sm py-8 font-bold">' + t('admin_orders_empty') + '</p>';
  list.innerHTML =
    '<div class="flex gap-1 mb-3">' +
      '<button onclick="adminShowOrderSubTab(\'new\')" id="adminOrderSubBtn-new" class="flex-1 py-1.5 rounded-xl font-black text-[10px] bg-[#001d4a] text-white">' + t('admin_orders_new') + ' (' + newOrders.length + ')</button>' +
      '<button onclick="adminShowOrderSubTab(\'active\')" id="adminOrderSubBtn-active" class="flex-1 py-1.5 rounded-xl font-black text-[10px] bg-slate-100 text-slate-500">' + t('admin_orders_active') + ' (' + activeOrders.length + ')</button>' +
      '<button onclick="adminShowOrderSubTab(\'done\')" id="adminOrderSubBtn-done" class="flex-1 py-1.5 rounded-xl font-black text-[10px] bg-slate-100 text-slate-500">' + t('admin_orders_done') + ' (' + doneOrders.length + ')</button>' +
    '</div>' +
    '<div id="adminOrderSub-new" class="grid grid-cols-2 gap-3">'    + (newOrders.length    ? newOrders.map(_buildAdminOrderCard).join('')    : emptyMsg) + '</div>' +
    '<div id="adminOrderSub-active" class="hidden grid grid-cols-2 gap-3">' + (activeOrders.length ? activeOrders.map(_buildAdminOrderCard).join('') : emptyMsg) + '</div>' +
    '<div id="adminOrderSub-done"   class="hidden grid grid-cols-2 gap-3">' + (doneOrders.length   ? doneOrders.map(_buildAdminOrderCard).join('')   : emptyMsg) + '</div>';
  adminShowOrderSubTab(adminOrderSubTab);
}
// ── 상품 가격 + 재고 관리 ───────────────────────────────────
function isInStock(productId) {
  return productStock[productId] !== false; // 기본값: 재고 있음
}
function renderAdminProducts() {
  var list = document.getElementById('adminTabProducts');
  if (!list) return;
  list.innerHTML = PRODUCTS.map(function(p) {
    var price   = productPrices[p.id] !== undefined ? productPrices[p.id] : p.price;
    var inStock = isInStock(p.id);
    var stockBtn = inStock
      ? '<button onclick="adminToggleStock(\'' + p.id + '\')" class="shrink-0 px-2 py-1 bg-green-50 text-green-600 border border-green-200 rounded-xl font-black text-[10px] active:scale-95 transition whitespace-nowrap">✅ 재고 있음</button>'
      : '<button onclick="adminToggleStock(\'' + p.id + '\')" class="shrink-0 px-2 py-1 bg-red-50 text-red-500 border border-red-200 rounded-xl font-black text-[10px] active:scale-95 transition whitespace-nowrap">❌ 품절</button>';
    return '<div class="bg-white rounded-xl p-4 mb-3 shadow-sm">' +
      '<div class="flex items-start gap-3">' +
        '<div class="flex-1 min-w-0">' +
          '<p class="font-black text-slate-800 text-xs truncate">' + p.title + '</p>' +
          '<p class="text-[9px] text-slate-400 leading-tight">' + p.subtitle + '</p>' +
        '</div>' +
        stockBtn +
      '</div>' +
      '<div class="flex items-center gap-1.5 mt-2">' +
        '<input type="number" value="' + price + '" min="0" ' +
          'onchange="adminSaveProductPrice(\'' + p.id + '\',this.value)" ' +
          'class="flex-1 text-right font-black text-xs border border-slate-200 rounded-xl px-2 py-1.5 focus:outline-none focus:border-blue-400">' +
        '<span class="text-[10px] text-slate-400 font-bold">THB</span>' +
      '</div>' +
    '</div>';
  }).join('');
}
function adminSaveProductPrice(id, val) {
  var price = parseInt(val, 10);
  if (isNaN(price) || price < 0) return;
  productPrices[id] = price;
  localStorage.setItem('adminProductPrices', JSON.stringify(productPrices));
  var p = PRODUCTS.find(function(p){ return p.id === id; });
  if (p) p.price = price;
}
function adminToggleStock(id) {
  productStock[id] = !isInStock(id);
  localStorage.setItem('adminProductStock', JSON.stringify(productStock));
  renderAdminProducts();
  // 쇼핑몰 목록도 즉시 반영
  if (currentPage === 'shop-items' || currentPage === 'shop') renderShop();
}
// ── 회원 관리 ──────────────────────────────────────────────
async function renderAdminUsers() {
  var list = document.getElementById('adminTabUsers');
  if (!list) return;
  list.innerHTML = '<p class="text-center text-slate-400 text-sm py-8 font-bold">' + t('admin_loading') + '</p>';
  try {
    var users = await authGetAllUsers();
    _allUsersCache = users; // 직책 점유 확인용 캐시
    if (!users.length) { list.innerHTML = '<p class="text-center text-slate-400 text-sm py-8 font-bold">' + t('admin_no_users') + '</p>'; return; }

    var pendingUsers = users.filter(function(u){ return u.is_active === false || u.is_active === null || u.is_active === undefined; });
    var otherUsers   = users.filter(function(u){ return u.is_active === true; });

    var makeUserCard = function(u, isPending) {
      var isAdminU  = u.role === 'admin';
      var isLeaderU = u.role === 'region_leader';
      var safeNick = (u.nickname||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");
      var isActive = u.is_active === true;
      var actionBtns;
      if (isAdminU) {
        actionBtns = '<span class="shrink-0 text-[9px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-xl">Admin</span>';
      } else if (isPending) {
        actionBtns = '<div class="flex gap-1 shrink-0">' +
          '<button onclick="adminApproveUser(\'' + safeNick + '\')" class="px-2.5 py-1.5 rounded-xl font-black text-[10px] bg-green-50 text-green-600 active:scale-95 transition">' + t('admin_user_approve') + '</button>' +
          '<button onclick="adminRejectUser(\'' + safeNick + '\')" class="px-2.5 py-1.5 rounded-xl font-black text-[10px] bg-red-50 text-red-500 active:scale-95 transition">' + t('admin_user_reject') + '</button>' +
        '</div>';
      } else {
        actionBtns = '<button onclick="adminToggleUser(\'' + safeNick + '\',' + isActive + ')" ' +
          'class="shrink-0 px-3 py-1.5 rounded-xl font-black text-[10px] ' +
          (isActive ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600') + ' active:scale-95 transition">' +
          (isActive ? t('admin_user_block') : t('admin_user_unblock')) + '</button>';
      }
      var badge;
      if (isPending) {
        badge = '<span class="inline-block mt-2 px-2 py-0.5 rounded-full text-[8px] font-black bg-amber-100 text-amber-600">' + t('admin_user_pending_badge') + '</span>';
      } else {
        badge = '<span class="inline-block mt-2 px-2 py-0.5 rounded-full text-[8px] font-black ' +
          (isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500') + '">' +
          (isActive ? t('admin_user_active_badge') : t('admin_user_blocked_badge')) + '</span>';
      }
      // 리더 배지 + 지역 + 직책 표시 (계층형)
      var leaderBadge = '';
      if (isLeaderU) {
        var lrLabel = _resolveLeaderLabel(u.leader_region);
        var titleLabel = u.leader_title ? t(_titleKeyToLabelKey(u.leader_title)) : '';
        leaderBadge = '<span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[8px] font-black bg-purple-100 text-purple-700">⭐ ' + lrLabel + (titleLabel ? ' · ' + titleLabel : '') + '</span>';
      }
      // 리더 지정/해임 — 피라미드 계층 (관리자 전용, admin/pending 제외)
      var leaderCtrl = '';
      if (!isAdminU && !isPending && isActive) {
        var curLevel = '';
        var curRegion = '';
        var curProvince = '';
        var curTitle = (isLeaderU && u.leader_title) ? u.leader_title : '';
        if (isLeaderU && u.leader_region) {
          if (u.leader_region === 'all') { curLevel = 'all'; }
          else if (u.leader_region.indexOf(':') !== -1) {
            var parts = u.leader_region.split(':');
            curLevel = 'province'; curRegion = parts[0]; curProvince = u.leader_region;
          } else { curLevel = 'region'; curRegion = u.leader_region; }
        }
        var levelOpts = '<option value="">' + t('leader_select_level') + '</option>' +
          '<option value="all"' + (curLevel==='all'?' selected':'') + '>🇹🇭 ' + t('leader_level_all') + '</option>' +
          '<option value="region"' + (curLevel==='region'?' selected':'') + '>📍 ' + t('leader_level_region') + '</option>' +
          '<option value="province"' + (curLevel==='province'?' selected':'') + '>🏘 ' + t('leader_level_province') + '</option>';
        var regionOpts = '<option value="">' + t('leader_select_region') + '</option>';
        FORUM_REGIONS.forEach(function(r) {
          if (r.key === 'all') return;
          regionOpts += '<option value="' + r.key + '"' + (curRegion===r.key?' selected':'') + '>' + r.icon + ' ' + t(r.labelKey) + '</option>';
        });
        var provinceOpts = '<option value="">' + t('leader_select_province') + '</option>';
        if (curRegion) {
          var rCfg = FORUM_REGIONS.find(function(r){ return r.key === curRegion; });
          if (rCfg) rCfg.provinces.forEach(function(p) {
            provinceOpts += '<option value="' + rCfg.key + ':' + p.key + '"' + (curProvince===(rCfg.key+':'+p.key)?' selected':'') + '>' + p.label + '</option>';
          });
        }
        // 직책 드롭다운 — 레벨에 따라 다른 직책 표시
        var titleList = curLevel === 'all' ? LEADER_TITLES_NATIONAL : curLevel === 'region' ? LEADER_TITLES_REGIONAL : curLevel === 'province' ? LEADER_TITLES_PROVINCE : [];
        var titleOpts = '<option value="">' + t('leader_select_title') + '</option>';
        titleList.forEach(function(ti) {
          var occupied = _isTitleOccupied(u.leader_region || '', ti.key, u.nickname);
          titleOpts += '<option value="' + ti.key + '"' + (curTitle===ti.key?' selected':'') + (occupied?' disabled':'') + '>' + t(ti.labelKey) + (occupied ? ' ✓' : '') + '</option>';
        });
        leaderCtrl = '<div class="mt-2 space-y-1.5">' +
          (isLeaderU
            ? '<button onclick="adminRemoveLeader(\'' + safeNick + '\')" class="px-2 py-1 rounded-lg font-black text-[9px] bg-red-50 text-red-500 active:scale-95 transition">' + t('leader_remove') + '</button>'
            : '') +
          '<div class="flex items-center gap-1.5 flex-wrap">' +
            '<select id="leader-level-' + safeNick + '" onchange="adminLeaderLevelChanged(\'' + safeNick + '\')" class="border border-slate-200 rounded-lg px-2 py-1 text-[9px] font-bold">' + levelOpts + '</select>' +
            '<select id="leader-region-' + safeNick + '" onchange="adminLeaderRegionChanged(\'' + safeNick + '\')" class="border border-slate-200 rounded-lg px-2 py-1 text-[9px] font-bold" style="' + (curLevel==='region'||curLevel==='province'?'':'display:none') + '">' + regionOpts + '</select>' +
            '<select id="leader-province-' + safeNick + '" onchange="adminLeaderProvinceChanged(\'' + safeNick + '\')" class="border border-slate-200 rounded-lg px-2 py-1 text-[9px] font-bold" style="' + (curLevel==='province'?'':'display:none') + '">' + provinceOpts + '</select>' +
            '<select id="leader-title-' + safeNick + '" class="border border-purple-200 rounded-lg px-2 py-1 text-[9px] font-bold text-purple-700" style="' + (curLevel?'':'display:none') + '">' + titleOpts + '</select>' +
            '<button onclick="adminSetLeader(\'' + safeNick + '\')" class="px-2 py-1 rounded-lg font-black text-[9px] bg-purple-50 text-purple-700 active:scale-95 transition">⭐ ' + t('leader_assign') + '</button>' +
          '</div>' +
        '</div>';
      }
      return '<div class="bg-white rounded-xl p-4 mb-3 shadow-sm">' +
        '<div class="flex justify-between items-start">' +
          '<div class="flex-1 min-w-0">' +
            '<p class="font-black text-slate-800 text-xs truncate">' + (u.clinic_name||'-') + '</p>' +
            '<p class="text-[10px] text-slate-500 font-bold">' + (u.doctor_name||'-') + ' · ' + (u.nickname||'-') + '</p>' +
            '<p class="text-[9px] text-slate-400">' + (u.email||'') + '</p>' +
            '<p class="text-[9px] text-slate-400">' + (u.phone||'') + '</p>' +
            '<p class="text-[9px] font-mono text-slate-300">' + (u.license_number||'') + '</p>' +
          '</div>' +
          actionBtns +
        '</div>' +
        badge + leaderBadge + leaderCtrl +
      '</div>';
    };

    var html = '';
    // Pending approval section
    if (pendingUsers.length) {
      html += '<div class="mb-4 bg-amber-50 rounded-2xl p-3">' +
        '<p class="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3">' + t('admin_pending_users_title') + ' (' + pendingUsers.length + ')</p>' +
        pendingUsers.map(function(u){ return makeUserCard(u, true); }).join('') +
      '</div>';
    } else {
      html += '<div class="mb-4 p-3 bg-slate-50 rounded-xl">' +
        '<p class="text-[10px] text-slate-400 font-bold text-center">' + t('admin_no_pending_users') + '</p>' +
      '</div>';
    }
    // All members section
    if (otherUsers.length) {
      html += '<p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">' + t('admin_all_users_title') + ' (' + otherUsers.length + ')</p>';
      html += otherUsers.map(function(u){ return makeUserCard(u, false); }).join('');
    }
    list.innerHTML = html;
  } catch(e) {
    list.innerHTML = '<p class="text-center text-red-400 text-sm py-8 font-bold">' + t('admin_error') + '</p>';
  }
}
async function adminApproveUser(nickname) {
  if (!confirm(nickname + ': ' + t('admin_user_approve') + '?')) return;
  await _setUserActiveState(nickname, true);
}
async function adminRejectUser(nickname) {
  if (!confirm(nickname + ': ' + t('admin_user_reject') + '?')) return;
  await _setUserActiveState(nickname, false);
}
async function _setUserActiveState(nickname, active) {
  try {
    var res = await authSetUserActive(nickname, active);
    if (res.ok) { renderAdminUsers(); renderAdminSummaryCards(); }
    else alert(t('admin_load_fail'));
  } catch(e) { alert(t('admin_error') + ' ' + e.message); }
}
async function adminToggleUser(nickname, currentActive) {
  var newActive = !currentActive;
  if (!confirm(newActive ? nickname + ' 회원을 승인하시겠습니까?' : nickname + ' 회원을 차단하시겠습니까?')) return;
  try {
    var res = await authSetUserActive(nickname, newActive);
    if (res.ok) renderAdminUsers();
    else alert('업데이트 실패');
  } catch(e) { alert('오류: ' + e.message); }
}
// ── 지역 리더 관리 (피라미드 계층형 + 직책) ─────────────────
// 직책 key → labelKey 변환
function _titleKeyToLabelKey(key) {
  var map = { president:'title_president', vice_president:'title_vice_president', secretary:'title_secretary', director:'title_director', auditor:'title_auditor', representative:'title_representative' };
  return map[key] || key;
}
// 특정 region+title 조합이 이미 다른 사용자에게 배정되었는지 확인
var _allUsersCache = [];
function _isTitleOccupied(region, titleKey, excludeNickname) {
  return _allUsersCache.some(function(u) {
    return u.role === 'region_leader' && u.leader_region === region && u.leader_title === titleKey && u.nickname !== excludeNickname;
  });
}
// 레벨에 맞는 직책 목록 반환
function _getTitlesForLevel(lv) {
  if (lv === 'all') return LEADER_TITLES_NATIONAL;
  if (lv === 'region') return LEADER_TITLES_REGIONAL;
  if (lv === 'province') return LEADER_TITLES_PROVINCE;
  return [];
}
// 직책 드롭다운 HTML 갱신
function _refreshTitleOpts(nickname, region, lv) {
  var esc = nickname.replace(/'/g,"\\'");
  var titleSel = document.getElementById('leader-title-' + esc);
  if (!titleSel) return;
  titleSel.style.display = lv ? '' : 'none';
  var titles = _getTitlesForLevel(lv);
  var html = '<option value="">' + t('leader_select_title') + '</option>';
  titles.forEach(function(ti) {
    var occupied = _isTitleOccupied(region || '', ti.key, nickname);
    html += '<option value="' + ti.key + '"' + (occupied ? ' disabled' : '') + '>' + t(ti.labelKey) + (occupied ? ' ✓' : '') + '</option>';
  });
  titleSel.innerHTML = html;
}
// 레벨 선택 변경 시
function adminLeaderLevelChanged(nickname) {
  var esc = nickname.replace(/'/g,"\\'");
  var levelSel = document.getElementById('leader-level-' + esc);
  var regionSel = document.getElementById('leader-region-' + esc);
  var provinceSel = document.getElementById('leader-province-' + esc);
  if (!levelSel) return;
  var lv = levelSel.value;
  regionSel.style.display = (lv === 'region' || lv === 'province') ? '' : 'none';
  provinceSel.style.display = (lv === 'province') ? '' : 'none';
  if (lv === 'all' || lv === '') { regionSel.value = ''; provinceSel.value = ''; }
  if (lv === 'region') provinceSel.value = '';
  var region = lv === 'all' ? 'all' : regionSel.value || '';
  _refreshTitleOpts(nickname, region, lv);
}
// 지역 선택 변경 시
function adminLeaderRegionChanged(nickname) {
  var esc = nickname.replace(/'/g,"\\'");
  var levelSel = document.getElementById('leader-level-' + esc);
  var regionSel = document.getElementById('leader-region-' + esc);
  var provinceSel = document.getElementById('leader-province-' + esc);
  if (!regionSel || !provinceSel) return;
  var regionKey = regionSel.value;
  var html = '<option value="">' + t('leader_select_province') + '</option>';
  var rCfg = FORUM_REGIONS.find(function(r){ return r.key === regionKey; });
  if (rCfg) rCfg.provinces.forEach(function(p) {
    html += '<option value="' + rCfg.key + ':' + p.key + '">' + p.label + '</option>';
  });
  provinceSel.innerHTML = html;
  // 직책 드롭다운도 갱신 (지역 변경 시 해당 지역의 점유 상태 반영)
  var lv = levelSel ? levelSel.value : '';
  var region = lv === 'province' ? '' : regionKey; // province 레벨이면 주 선택 후 갱신
  if (lv === 'region') _refreshTitleOpts(nickname, regionKey, lv);
}
// 주 선택 변경 시 직책 갱신 (province 레벨)
function adminLeaderProvinceChanged(nickname) {
  var esc = nickname.replace(/'/g,"\\'");
  var provinceSel = document.getElementById('leader-province-' + esc);
  if (!provinceSel) return;
  _refreshTitleOpts(nickname, provinceSel.value || '', 'province');
}
// 리더 지정
async function adminSetLeader(nickname) {
  var esc = nickname.replace(/'/g,"\\'");
  var levelSel = document.getElementById('leader-level-' + esc);
  var titleSel = document.getElementById('leader-title-' + esc);
  if (!levelSel || !levelSel.value) { alert(t('leader_select_level')); return; }
  if (!titleSel || !titleSel.value) { alert(t('leader_select_title')); return; }
  var lv = levelSel.value;
  var title = titleSel.value;
  var region = '';
  if (lv === 'all') {
    region = 'all';
  } else if (lv === 'region') {
    var rSel = document.getElementById('leader-region-' + esc);
    if (!rSel || !rSel.value) { alert(t('leader_select_region')); return; }
    region = rSel.value;
  } else if (lv === 'province') {
    var rSel2 = document.getElementById('leader-region-' + esc);
    var pSel = document.getElementById('leader-province-' + esc);
    if (!rSel2 || !rSel2.value) { alert(t('leader_select_region')); return; }
    if (!pSel || !pSel.value) { alert(t('leader_select_province')); return; }
    region = pSel.value;
  }
  // 점유 확인
  if (_isTitleOccupied(region, title, nickname)) {
    alert(t('leader_title_occupied')); return;
  }
  var lbl = _resolveLeaderLabel(region);
  var titleLabel = t(_titleKeyToLabelKey(title));
  if (!confirm(nickname + ' → ⭐ ' + lbl + ' · ' + titleLabel + '?')) return;
  try {
    var res = await authSetUserRole(nickname, 'region_leader', region, title);
    if (res.ok) { await _loadLeaderCache(); renderAdminUsers(); }
    else alert(t('admin_error'));
  } catch(e) { alert(t('admin_error') + ' ' + e.message); }
}
async function adminRemoveLeader(nickname) {
  if (!confirm(nickname + ': ' + t('leader_remove') + '?')) return;
  try {
    var res = await authSetUserRole(nickname, 'user', null, null);
    if (res.ok) { await _loadLeaderCache(); renderAdminUsers(); }
    else alert(t('admin_error'));
  } catch(e) { alert(t('admin_error') + ' ' + e.message); }
}
// ── 이벤트 관리 ────────────────────────────────────────────
function renderAdminEventsTab() {
  var list = document.getElementById('adminTabEvents');
  if (!list) return;
  var evRows = events_.length
    ? events_.map(function(ev) {
        var evId = typeof ev.id === 'string' ? "'" + ev.id + "'" : ev.id;
        var badge = ev.type === 'meetup'
          ? '<span class="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 mr-1">🤝</span>'
          : '<span class="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 mr-1">📅</span>';
        return '<div class="bg-white rounded-xl p-4 mb-2 shadow-sm flex items-center gap-3">' +
          '<div class="flex-1 min-w-0">' +
            '<p class="font-black text-xs text-slate-800 truncate">' + badge + ev.event + '</p>' +
            '<p class="text-[10px] text-slate-400">' + ev.date + ' · ' + ev.loc + (ev.createdBy ? ' · ' + ev.createdBy : '') + '</p>' +
          '</div>' +
          '<button onclick="adminDeleteEvent(' + evId + ')" class="shrink-0 px-3 py-1.5 bg-red-50 text-red-500 rounded-xl font-black text-[10px]">삭제</button>' +
        '</div>';
      }).join('')
    : '<p class="text-center text-slate-400 text-sm py-4 font-bold">이벤트가 없습니다.</p>';
  list.innerHTML =
    '<div class="bg-white rounded-xl p-4 mb-4 shadow-sm">' +
      '<p class="font-black text-xs text-slate-700 mb-3">' + t('admin_new_event_title') + '</p>' +
      '<input id="adminEventDate" type="date" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold mb-2 focus:outline-none focus:border-blue-400">' +
      '<input id="adminEventName" type="text" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold mb-2 focus:outline-none focus:border-blue-400" placeholder="' + t('admin_event_name_ph') + '">' +
      '<input id="adminEventLoc"  type="text" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold mb-3 focus:outline-none focus:border-blue-400" placeholder="' + t('admin_event_loc_ph') + '">' +
      '<button onclick="adminAddEvent()" class="w-full py-2.5 bg-[#001d4a] text-white rounded-xl font-black text-xs active:scale-95 transition">' + t('admin_event_add_btn') + '</button>' +
    '</div>' +
    evRows;
}
function adminAddEvent() {
  var date = (document.getElementById('adminEventDate').value || '').trim();
  var name = (document.getElementById('adminEventName').value || '').trim();
  var loc  = (document.getElementById('adminEventLoc').value  || '').trim();
  if (!date || !name || !loc) { alert(t('admin_event_fill_alert')); return; }
  var newEv = { id: Date.now(), date: date, event: name, loc: loc,
    type: 'event', region: 'all',
    createdBy: isLoggedIn() ? currentUser.nickname : null };
  events_.push(newEv);
  renderAdminEventsTab();
  renderEvents();
  renderHomeEventsPreview();
  // Supabase 저장 (비동기)
  sbSaveEvent(newEv).then(function(saved) {
    if (saved && saved.id) {
      var idx = events_.findIndex(function(x){ return x === newEv; });
      if (idx !== -1) events_[idx]._sbId = saved.id;
    }
  }).catch(function(e){ console.error('[Event Save]', e); });
}
function adminDeleteEvent(id) {
  if (!confirm('이벤트를 삭제하시겠습니까?')) return;
  var removed = events_.find(function(e){ return e.id === id; });
  events_ = events_.filter(function(e){ return e.id !== id; });
  renderAdminEventsTab();
  renderEvents();
  renderHomeEventsPreview();
  if (removed && (removed._sbId || typeof removed.id === 'string')) {
    sbDeleteEvent(removed._sbId || removed.id).catch(function(e){ console.error('[Event Delete]', e); });
  }
}
// ============================================================
// USED MARKET
// ============================================================
function renderUsed() {
  var list = document.getElementById('usedList');
  if (!list) return;
  if (!usedItems.length) {
    list.innerHTML = '<div class="col-span-5 text-center text-slate-400 font-bold text-sm py-12">' + t('used_empty') + '</div>';
    return;
  }
  var condMap   = {new:'bg-green-100 text-green-700',good:'bg-blue-100 text-blue-700',fair:'bg-yellow-100 text-yellow-700'};
  var condLabel = {new:t('cond_new'),good:t('cond_good'),fair:t('cond_fair')};
  list.innerHTML = usedItems.map(function(item) {
    var thumb = item.image
      ? '<img src="' + item.image + '" class="w-full h-full object-cover" loading="lazy">'
      : '<div class="w-full h-full flex items-center justify-center"><span class="text-slate-300 text-2xl">📷</span></div>';
    var badge = '<span class="inline-block text-[8px] font-black px-1.5 py-0.5 rounded-full ' + condMap[item.cond||'fair'] + '">' + condLabel[item.cond||'fair'] + '</span>';
    var date   = (item.date||'').slice(5); // MM-DD
    return '<div class="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer active:scale-[.97] transition" onclick="openUsedDetail(' + item.id + ')">' +
      '<div class="aspect-square bg-slate-50 overflow-hidden">' + thumb + '</div>' +
      '<div class="p-1.5 space-y-1">' +
        badge +
        '<p class="font-black text-slate-800 text-[10px] leading-snug line-clamp-2">' + item.name + '</p>' +
        '<p class="font-black text-blue-700 text-[10px] font-mono">฿' + item.price.toLocaleString() + '</p>' +
        '<p class="text-[8px] text-slate-300 font-bold">' + date + '</p>' +
      '</div>' +
    '</div>';
  }).join('');
}
function usedToggleWrite() {
  var form = document.getElementById('usedWriteForm');
  var btn  = document.getElementById('usedWriteBtn');
  if (!form) return;
  var hidden = form.classList.contains('hidden');
  form.classList.toggle('hidden', !hidden);
  if (btn) btn.classList.toggle('hidden', hidden);
}
function previewPhoto() {
  var file = document.getElementById('u-photo').files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var prev = document.getElementById('u-photo-preview');
    prev.innerHTML = '<img src="' + e.target.result + '" class="w-full h-full object-cover">';
  };
  reader.readAsDataURL(file);
}
function submitUsed() {
  var name    = document.getElementById('u-name').value.trim();
  var price   = parseInt(document.getElementById('u-price').value,10)||0;
  var contact = document.getElementById('u-contact').value.trim();
  if (!name||!price||!contact) { alert(t('used_fill_error')); return; }
  function addItem(imgData) {
    var seller = isLoggedIn() ? (currentUser.nickname || 'Me') : 'Me';
    var newItem = {
      id: Date.now(),
      name: name,
      code: document.getElementById('u-code').value.trim() || '-',
      price: price,
      cond: document.getElementById('u-cond').value,
      desc: document.getElementById('u-desc').value.trim() || '-',
      contact: contact,
      seller: seller,
      date: new Date().toISOString().slice(0,10),
      views: 0,
      image: imgData || null,
    };
    usedItems.unshift(newItem);
    ['u-name','u-code','u-price','u-desc','u-contact'].forEach(function(id){ document.getElementById(id).value=''; });
    document.getElementById('u-photo').value = '';
    document.getElementById('u-photo-preview').innerHTML = '<span class="text-3xl mb-1">📷</span><span class="text-xs font-bold">' + t('used_photo_add') + '</span>';
    // 폼 닫기
    var form = document.getElementById('usedWriteForm');
    var btn  = document.getElementById('usedWriteBtn');
    if (form) form.classList.add('hidden');
    if (btn)  btn.classList.remove('hidden');
    renderUsed();
    // Supabase 저장 (비동기)
    sbSaveUsedItem(newItem).then(function(saved) {
      // Supabase가 생성한 UUID로 id 교체
      if (saved && saved.id) {
        var idx = usedItems.findIndex(function(x){ return x === newItem; });
        if (idx !== -1) usedItems[idx]._sbId = saved.id;
      }
    }).catch(function(e){ console.error('[Used Save]', e); });
  }
  var file = document.getElementById('u-photo').files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function(e){ addItem(e.target.result); };
    reader.readAsDataURL(file);
  } else {
    addItem(null);
  }
}
function deleteUsed(i) {
  var item = usedItems[i];
  usedItems.splice(i, 1);
  renderUsed();
  if (item && (item._sbId || typeof item.id === 'string')) {
    sbDeleteUsedItem(item._sbId || item.id).catch(function(e){ console.error('[Used Delete]', e); });
  }
}
function showContact(c) { document.getElementById('usedContactText').textContent=c; openModal('usedContactModal'); }
function openUsedDetail(id) {
  var item = usedItems.find(function(x){ return x.id===id; });
  if (!item) return;
  item.views = (item.views||0) + 1;
  renderUsed();
  if (item._sbId || typeof item.id === 'string') {
    sbUpdateUsedItem(item._sbId || item.id, { views: item.views }).catch(function(){});
  }
  var condLabel = {new:t('cond_new'),good:t('cond_good'),fair:t('cond_fair')};
  var condColor = {new:'bg-green-100 text-green-700',good:'bg-blue-100 text-blue-700',fair:'bg-yellow-100 text-yellow-700'};
  document.getElementById('udp-name').textContent   = item.name;
  document.getElementById('udp-code').textContent   = item.code;
  document.getElementById('udp-price').textContent  = item.price.toLocaleString() + ' THB';
  document.getElementById('udp-cond').textContent   = condLabel[item.cond];
  document.getElementById('udp-cond').className     = 'text-xs font-black px-2 py-1 rounded-lg ' + condColor[item.cond];
  document.getElementById('udp-desc').textContent   = item.desc;
  document.getElementById('udp-meta').textContent   = item.seller + ' · ' + item.date;
  document.getElementById('udp-views').textContent  = item.views;
  document.getElementById('udp-contactBtn').onclick = function(){ showContact(item.contact); };
  var deleteBtn = document.getElementById('udp-deleteBtn');
  // 삭제 버튼: 로그인 상태이고 본인 게시물일 때만 표시
  var canDelete = isLoggedIn() && (item.seller === 'Me' || item.seller === currentUser.nickname);
  if (deleteBtn) {
    deleteBtn.style.display = canDelete ? '' : 'none';
    deleteBtn.onclick = function(){
      var idx = usedItems.findIndex(function(x){ return x.id===id; });
      if (idx !== -1) {
        var removed = usedItems[idx];
        usedItems.splice(idx, 1);
        if (removed && (removed._sbId || typeof removed.id === 'string')) {
          sbDeleteUsedItem(removed._sbId || removed.id).catch(function(){});
        }
      }
      goBack();
    };
  }
  var imgWrap = document.getElementById('udp-imageWrap');
  var imgEl   = document.getElementById('udp-image');
  if (item.image) { imgEl.src = item.image; imgWrap.classList.remove('hidden'); }
  else { imgWrap.classList.add('hidden'); imgEl.src = ''; }
  goDetailPage('used-detail', item.name, 'used');
}
function openForumDetail(id) {
  if (LOCKED.includes('forum') && !isLoggedIn()) { openLoginModal('forum'); return; }
  var post = posts.find(function(x){ return x.id===id; });
  if (!post) return;
  post.views = (post.views||0) + 1;
  currentForumPostId = id;
  renderForum();
  // Supabase 조회수 업데이트 (비동기)
  if (post._sbId || typeof post.id === 'string') {
    sbUpdateForumPost(post._sbId || post.id, { views: post.views }).catch(function(){});
  }
  // 카테고리 뱃지 (i18n)
  var tabCfg = FORUM_CATEGORIES.find(function(x){ return x.key === post.category; });
  var catText = tabCfg ? ((tabCfg.icon || '') + ' ' + t(tabCfg.labelKey)) : post.category;
  document.getElementById('fdp-catBadge').textContent = catText;
  document.getElementById('fdp-title').textContent  = post.title;
  document.getElementById('fdp-body').textContent   = post.body;
  // 작성자 + 리더 배지
  var authorEl = document.getElementById('fdp-author');
  var _li = _getLeaderInfo(post.author);
  var authorBadge = _li ? ' ⭐ ' + _resolveLeaderLabel(_li.region) + (_li.title ? ' · ' + t(_titleKeyToLabelKey(_li.title)) : '') : '';
  authorEl.innerHTML = '<span class="font-black text-slate-500">' + post.author + '</span>' +
    (authorBadge ? '<span class="text-purple-600 font-black">' + authorBadge + '</span>' : '') +
    ' · ' + (post.date||'');
  document.getElementById('fdp-views').textContent  = post.views;
  // 리더/관리자 액션 버튼 (고정/삭제)
  var leaderActionsEl = document.getElementById('fdp-leaderActions');
  if (leaderActionsEl) {
    var canManage = canManageRegion(post.region);
    if (canManage) {
      var postSbId = post._sbId || post.id;
      var pinLabel = post.is_pinned ? t('forum_unpin') : t('forum_pin');
      var pinIcon  = post.is_pinned ? '📌' : '📌';
      leaderActionsEl.innerHTML =
        '<div class="flex gap-2 mt-3">' +
          '<button onclick="leaderTogglePin(' + post.id + ')" class="flex-1 py-2 rounded-xl font-black text-[10px] border-2 ' +
            (post.is_pinned ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-500') +
            ' active:scale-95 transition">' + pinIcon + ' ' + pinLabel + '</button>' +
          '<button onclick="leaderDeletePost(' + post.id + ')" class="px-4 py-2 rounded-xl font-black text-[10px] border-2 border-red-200 text-red-500 active:scale-95 transition">🗑 ' + t('forum_delete') + '</button>' +
        '</div>';
      leaderActionsEl.classList.remove('hidden');
    } else {
      leaderActionsEl.classList.add('hidden');
    }
  }
  // 이미지 갤러리 슬라이더
  forumGalleryImages = (post.images && post.images.length) ? post.images : [];
  forumGalleryIndex  = 0;
  var gallery = document.getElementById('fdp-gallery');
  if (forumGalleryImages.length) {
    gallery.classList.remove('hidden');
    renderForumGallery();
  } else {
    gallery.classList.add('hidden');
  }
  // 댓글
  renderComments(post);
  updateNicknameDisplays();
  goDetailPage('forum-detail', post.title, 'forum');
}
function renderForumGallery() {
  var track = document.getElementById('fdp-galleryTrack');
  var dots  = document.getElementById('fdp-galleryDots');
  var prev  = document.getElementById('fdp-galleryPrev');
  var next  = document.getElementById('fdp-galleryNext');
  if (!track) return;
  track.innerHTML = forumGalleryImages.map(function(src){
    return '<div class="shrink-0 w-full h-full flex items-center justify-center" style="flex:0 0 100%">' +
      '<img src="' + src + '" style="max-width:100%;max-height:240px;object-fit:contain" loading="lazy">' +
    '</div>';
  }).join('');
  track.style.transform = 'translateX(-' + (forumGalleryIndex * 100) + '%)';
  // 닷 인디케이터
  if (dots) {
    dots.innerHTML = forumGalleryImages.map(function(_, i){
      return '<div class="w-1.5 h-1.5 rounded-full transition-all ' + (i === forumGalleryIndex ? 'bg-white scale-125' : 'bg-white/40') + '"></div>';
    }).join('');
  }
  // prev/next 버튼 표시 여부
  if (prev) prev.classList.toggle('hidden', forumGalleryImages.length <= 1);
  if (next) next.classList.toggle('hidden', forumGalleryImages.length <= 1);
}
function forumGallerySlide(dir) {
  forumGalleryIndex = (forumGalleryIndex + dir + forumGalleryImages.length) % forumGalleryImages.length;
  renderForumGallery();
}
// ============================================================
// FORUM
// ============================================================
// 리더 배지 표시용 캐시 (renderAdminUsers에서 로드)
var _leaderCache = {};
async function _loadLeaderCache() {
  try {
    var users = await authGetAllUsers();
    _leaderCache = {};
    users.forEach(function(u) {
      if (u.role === 'region_leader') _leaderCache[u.nickname] = { region: u.leader_region, title: u.leader_title || '' };
      if (u.role === 'admin') _leaderCache[u.nickname] = '__admin__';
    });
  } catch(e) {}
}
function _isAuthorLeader(nickname) {
  return _leaderCache[nickname] && _leaderCache[nickname] !== '__admin__';
}
function _isAuthorAdmin(nickname) {
  return _leaderCache[nickname] === '__admin__';
}
function _getLeaderInfo(nickname) {
  var v = _leaderCache[nickname];
  if (!v || v === '__admin__') return null;
  return v; // { region, title }
}
async function leaderTogglePin(postId) {
  var post = posts.find(function(p){ return p.id === postId; });
  if (!post) return;
  post.is_pinned = !post.is_pinned;
  var sbId = post._sbId || post.id;
  if (typeof sbId === 'string') {
    try { await sbUpdateForumPost(sbId, { is_pinned: post.is_pinned }); } catch(e) { console.error('[Pin]', e); }
  }
  renderForum();
  openForumDetail(postId);
}
async function leaderDeletePost(postId) {
  if (!confirm(t('forum_delete_confirm'))) return;
  var post = posts.find(function(p){ return p.id === postId; });
  if (!post) return;
  var sbId = post._sbId || post.id;
  posts = posts.filter(function(p){ return p.id !== postId; });
  if (typeof sbId === 'string') {
    try { await sbDeleteForumPost(sbId); } catch(e) { console.error('[Delete Post]', e); }
  }
  renderForum();
  goBack();
}
function forumTab(cat) {
  forumCategory = cat;
  renderForum();
}
function forumRegionTab(region) {
  forumRegion   = region;
  forumProvince = 'all';
  renderForum();
}
function forumProvinceTab(province) {
  forumProvince = province;
  renderForum();
}
function forumToggleWrite() {
  var form = document.getElementById('forumWriteForm');
  var btn  = document.getElementById('forumWriteBtn');
  if (!form) return;
  var isHidden = form.classList.contains('hidden');
  form.classList.toggle('hidden', !isHidden);
  if (isHidden) {
    _updateProvinceSelect();
    updateNicknameDisplays();
  }
}
// 글쓰기 폼: 지역 변경 시 주(province) 드롭다운 갱신
function _updateProvinceSelect() {
  var regionSel   = document.getElementById('postRegion');
  var provinceSel = document.getElementById('postProvince');
  if (!regionSel || !provinceSel) return;
  var regionKey = regionSel.value;
  var regionCfg = FORUM_REGIONS.find(function(r){ return r.key === regionKey; });
  var provinces = (regionCfg && regionCfg.provinces) ? regionCfg.provinces : [];
  if (!provinces.length) {
    provinceSel.innerHTML = '<option value="all">-</option>';
    provinceSel.disabled  = true;
  } else {
    provinceSel.disabled  = false;
    provinceSel.innerHTML = provinces.map(function(p){
      return '<option value="' + p.key + '">' + p.label + '</option>';
    }).join('');
  }
  // 현재 선택된 지역에 맞게 초기화
  if (regionKey === forumRegion && forumProvince !== 'all') {
    provinceSel.value = forumProvince;
  }
}
function renderForum() {
  // 지역 탭 (대분류)
  var regionBar = document.getElementById('forumRegionBar');
  if (regionBar) {
    regionBar.innerHTML = FORUM_REGIONS.map(function(r) {
      var active = forumRegion === r.key;
      return '<button onclick="forumRegionTab(\'' + r.key + '\')" class="shrink-0 px-4 py-2 rounded-2xl font-black text-xs transition ' +
        (active ? 'bg-emerald-600 text-white shadow' : 'bg-white text-slate-500 border border-slate-200') + '">' +
        r.icon + ' ' + t(r.labelKey) + '</button>';
    }).join('');
  }
  // 주(province) 서브탭 — 대분류가 선택된 경우만
  var provinceBar = document.getElementById('forumProvinceBar');
  if (provinceBar) {
    var curRegion = FORUM_REGIONS.find(function(r){ return r.key === forumRegion; });
    var provinces = (curRegion && curRegion.provinces && curRegion.provinces.length) ? curRegion.provinces : [];
    if (provinces.length) {
      provinceBar.classList.remove('hidden');
      provinceBar.innerHTML =
        '<button onclick="forumProvinceTab(\'all\')" class="shrink-0 px-3 py-1.5 rounded-xl font-black text-[11px] transition ' +
        (forumProvince === 'all' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-white text-slate-400 border border-slate-200') + '">' +
        t('forum_region_all') + '</button>' +
        provinces.map(function(p) {
          var active = forumProvince === p.key;
          return '<button onclick="forumProvinceTab(\'' + p.key + '\')" class="shrink-0 px-3 py-1.5 rounded-xl font-black text-[11px] transition ' +
            (active ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-white text-slate-400 border border-slate-200') + '">' +
            p.label + '</button>';
        }).join('');
    } else {
      provinceBar.classList.add('hidden');
      provinceBar.innerHTML = '';
    }
  }
  // 필터링: 지역 + 주
  var filtered = posts.filter(function(p){
    if (forumRegion === 'all') return true;
    if (forumProvince !== 'all') return p.province === forumProvince;
    return p.region === forumRegion;
  });
  // 고정 글 먼저 정렬
  var pinned = filtered.filter(function(p){ return p.is_pinned; });
  var notPinned = filtered.filter(function(p){ return !p.is_pinned; });
  var sorted = pinned.concat(notPinned);
  document.getElementById('postList').innerHTML = sorted.length ? sorted.map(function(p){
    var hasImg = p.images && p.images.length;
    var imgCount = hasImg ? p.images.length : 0;
    var commentCount = p.comments ? p.comments.length : 0;
    // 썸네일 영역
    var thumbHtml = hasImg
      ? '<div class="relative shrink-0">' +
          '<img src="' + p.images[0] + '" class="w-[72px] h-[72px] rounded-2xl object-cover" loading="lazy">' +
          (imgCount > 1 ? '<span class="absolute bottom-1 right-1 text-[9px] font-black bg-black/60 text-white px-1.5 py-0.5 rounded-full">+' + (imgCount - 1) + '</span>' : '') +
        '</div>'
      : '';
    // 카테고리 뱃지
    var catCfg  = FORUM_CATEGORIES.find(function(x){ return x.key === p.category; }) || {};
    var catIcon  = catCfg.icon || '📌';
    var tabLabel = catCfg;
    // 고정 배지
    var pinnedBadge = p.is_pinned
      ? '<span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">📌 ' + t('forum_pinned') + '</span>' : '';
    // 리더 배지 (작성자가 리더인 경우 — 직책 포함)
    var _pli = _getLeaderInfo(p.author);
    var authorLeaderBadge = _pli
      ? '<span class="text-[9px] font-black text-purple-600" title="' + _resolveLeaderLabel(_pli.region) + (_pli.title ? ' · ' + t(_titleKeyToLabelKey(_pli.title)) : '') + '">⭐</span>' : '';
    // 지역/주 뱃지
    var regionBadge = '';
    if (p.region && p.region !== 'all') {
      var rCfg = FORUM_REGIONS.find(function(r){ return r.key === p.region; });
      var pLabel = '';
      if (p.province && p.province !== 'all' && rCfg) {
        var pCfg = rCfg.provinces.find(function(x){ return x.key === p.province; });
        if (pCfg) pLabel = pCfg.label;
      }
      var rLabel = rCfg ? (rCfg.icon + ' ' + t(rCfg.labelKey)) : p.region;
      regionBadge = '<span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">' +
        rLabel + (pLabel ? ' · ' + pLabel : '') + '</span>';
    }
    return '<div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer active:bg-slate-50 transition" onclick="openForumDetail(' + p.id + ')">' +
      '<div class="p-4 flex gap-3 items-start">' +
        '<div class="flex-1 min-w-0">' +
          '<div class="flex items-center gap-1.5 flex-wrap mb-1.5">' +
            pinnedBadge +
            '<span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">' + catIcon + ' ' + (tabLabel.key ? t(tabLabel.labelKey) : p.category) + '</span>' +
            regionBadge +
          '</div>' +
          '<p class="font-black text-slate-800 text-sm leading-snug mb-1 line-clamp-2">' + p.title + '</p>' +
          '<p class="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-2">' + p.body + '</p>' +
          '<div class="flex items-center gap-2 text-[10px] text-slate-300 font-bold">' +
            '<span class="text-slate-500 font-black">' + p.author + '</span>' +
            authorLeaderBadge +
            '<span>·</span>' +
            '<span>' + (p.date||'') + '</span>' +
            '<span>·</span>' +
            '<span>👁 ' + (p.views||0) + '</span>' +
            '<span>·</span>' +
            '<span>💬 ' + commentCount + '</span>' +
          '</div>' +
        '</div>' +
        thumbHtml +
      '</div>' +
    '</div>';
  }).join('') : '<p class="text-center text-slate-400 text-sm py-12">' + t('forum_empty') + '</p>';
}
function previewForumPhotos() {
  var input = document.getElementById('forumPhotos');
  var files = Array.from(input.files).slice(0, 5);
  forumPhotos = [];
  var preview = document.getElementById('forumPhotoPreview');
  preview.innerHTML = '';
  if (!files.length) { preview.classList.add('hidden'); return; }
  preview.classList.remove('hidden');
  var loaded = 0;
  files.forEach(function(file, i) {
    var reader = new FileReader();
    reader.onload = function(e) {
      forumPhotos[i] = e.target.result;
      loaded++;
      if (loaded === files.length) {
        preview.innerHTML = forumPhotos.filter(Boolean).map(function(src, idx){
          return '<div class="relative">' +
            '<img src="' + src + '" class="w-16 h-16 rounded-xl object-cover">' +
            '<button onclick="removeForumPhoto(' + idx + ')" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-black flex items-center justify-center leading-none">✕</button>' +
          '</div>';
        }).join('');
      }
    };
    reader.readAsDataURL(file);
  });
}
function removeForumPhoto(idx) {
  forumPhotos[idx] = null;
  var preview = document.getElementById('forumPhotoPreview');
  var valid = forumPhotos.filter(Boolean);
  if (!valid.length) { preview.classList.add('hidden'); preview.innerHTML = ''; return; }
  preview.innerHTML = forumPhotos.filter(Boolean).map(function(src, i){
    return '<div class="relative">' +
      '<img src="' + src + '" class="w-16 h-16 rounded-xl object-cover">' +
      '<button onclick="removeForumPhoto(' + i + ')" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-black flex items-center justify-center leading-none">✕</button>' +
    '</div>';
  }).join('');
}
function submitPost() {
  var tt  = document.getElementById('postTitle').value.trim();
  var b   = document.getElementById('postBody').value.trim();
  var cat = (document.getElementById('postCategory') || {}).value || forumCategory;
  if (!tt || !b) return;
  var auth     = currentUser.nickname || t('anon_patient');
  var today    = new Date().toISOString().slice(0,10);
  var regionEl   = document.getElementById('postRegion');
  var provinceEl = document.getElementById('postProvince');
  var reg = regionEl   ? regionEl.value   : 'all';
  var prv = provinceEl ? provinceEl.value : 'all';
  var newPost = {id:Date.now(), category:cat, region:reg, province:prv, title:tt, body:b, author:auth, images:forumPhotos.filter(Boolean).slice(), comments:[], views:0, date:today};
  posts.unshift(newPost);
  document.getElementById('postTitle').value  = '';
  document.getElementById('postBody').value   = '';
  document.getElementById('forumPhotoPreview').innerHTML = '';
  document.getElementById('forumPhotoPreview').classList.add('hidden');
  document.getElementById('forumPhotos').value = '';
  forumPhotos = [];
  // 글 작성 후 지역 필터 & 폼 닫기
  if (reg && reg !== 'all') { forumRegion = reg; forumProvince = prv || 'all'; }
  var form = document.getElementById('forumWriteForm');
  if (form) form.classList.add('hidden');
  renderForum();
  // Supabase 저장 (비동기)
  sbSaveForumPost(newPost).then(function(saved) {
    if (saved && saved.id) {
      var idx = posts.findIndex(function(x){ return x === newPost; });
      if (idx !== -1) posts[idx]._sbId = saved.id;
    }
  }).catch(function(e){ console.error('[Post Save]', e); });
}
function renderComments(post) {
  var el = document.getElementById('fdp-comments');
  if (!post.comments || !post.comments.length) {
    el.innerHTML = '<p class="text-xs text-slate-300 font-bold">' + t('forum_no_comments') + '</p>';
    return;
  }
  el.innerHTML = post.comments.map(function(c){
    return '<div class="bg-slate-50 rounded-2xl p-3">' +
      '<div class="flex items-center gap-2 mb-1">' +
        '<span class="text-xs font-black text-slate-700">' + c.author + '</span>' +
        '<span class="text-[10px] text-slate-300">' + c.date + '</span>' +
      '</div>' +
      '<p class="text-sm text-slate-600 leading-relaxed">' + c.text + '</p>' +
    '</div>';
  }).join('');
}
function submitComment() {
  var text = document.getElementById('commentInput').value.trim();
  if (!text) return;
  var post = posts.find(function(x){ return x.id===currentForumPostId; });
  if (!post) return;
  if (!post.comments) post.comments = [];
  var auth  = currentUser.nickname || t('anon_patient');
  var today = new Date().toISOString().slice(0,10);
  post.comments.push({author: auth, text: text, date: today});
  document.getElementById('commentInput').value = '';
  renderComments(post);
  renderForum();
  // Supabase 댓글 업데이트 (비동기)
  if (post._sbId || typeof post.id === 'string') {
    sbUpdateForumPost(post._sbId || post.id, { comments: post.comments }).catch(function(){});
  }
}
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
            : '<div class="w-full h-full flex items-center justify-center"><span class="text-slate-300 text-xl">📷</span></div>';
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
  } catch(e) { console.warn('Supabase PATCH 실패:', e); }
  var msg = document.getElementById('profileSavedMsg');
  if (msg) { msg.classList.remove('hidden'); setTimeout(function(){ msg.classList.add('hidden'); }, 2500); }
  renderProfileSettings();
  // 잠시 후 폼 닫기
  setTimeout(function(){ toggleProfileEditInline(); }, 1500);
}
function openProfileEdit() {
  if (!isLoggedIn()) { alert(t('login_required')); return; }
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
  } catch(e) { console.warn('Supabase PATCH 실패 (로컬에는 저장됨):', e); }
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
  activityTab('msg');
  openModal('myActivityModal');
}
function activityTab(name) {
  ['msg','posts'].forEach(function(tab){
    var btn  = document.getElementById('atab-'+tab);
    var pane = document.getElementById('activity-'+tab);
    if (btn)  btn.className  = 'flex-1 py-2 rounded-xl font-black text-xs ' + (tab===name?'bg-[#001d4a] text-white':'bg-slate-100 text-slate-500');
    if (pane) pane.classList.toggle('hidden', tab!==name);
  });
  if (name==='msg')   renderMyMsgs();
  if (name==='posts') renderMyPosts();
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
  if (!to||!subject||!body) { alert('받는 사람, 제목, 내용을 모두 입력해주세요.'); return; }
  messages.push({ id:Date.now(), from:currentUser.nickname, to:to, subject:subject, body:body, date:new Date().toLocaleDateString(), read:false });
  closeModal('composeModal');
  renderMyMsgs();
  alert('쪽지를 보냈습니다!');
}
// ============================================================
// JOBS (구인구직)
// ============================================================
var JOB_TYPES = [
  { key:'all',               labelKey:'job_type_all',        icon:'💼', color:'bg-slate-100 text-slate-600' },
  { key:'dentist_hire',      labelKey:'job_type_dentist',    icon:'🦷', color:'bg-blue-100 text-blue-700' },
  { key:'staff_hire',        labelKey:'job_type_staff',      icon:'👩‍⚕️', color:'bg-purple-100 text-purple-700' },
  { key:'equipment_transfer',labelKey:'job_type_equipment',  icon:'🔧', color:'bg-amber-100 text-amber-700' },
];
var jobsList = [];
var jobTypeFilter = 'all';
var jobRegionFilter = 'all';
var _viewingJobId = null;

function renderJobs() {
  // 로그인 유저: 글쓰기 버튼
  var writeBtn = document.getElementById('jobsWriteBtn');
  if (writeBtn) writeBtn.classList.toggle('hidden', !isLoggedIn());

  // type 탭
  var typeBar = document.getElementById('jobTypeBar');
  if (typeBar) {
    typeBar.innerHTML = JOB_TYPES.map(function(jt) {
      var active = jobTypeFilter === jt.key;
      return '<button onclick="jobFilterType(\'' + jt.key + '\')" class="shrink-0 px-3 py-1.5 rounded-xl font-black text-[11px] transition ' +
        (active ? 'bg-[#001d4a] text-white shadow' : 'bg-white text-slate-500 border border-slate-200') + '">' +
        jt.icon + ' ' + t(jt.labelKey) + '</button>';
    }).join('');
  }

  // 지역 필터
  var regionBar = document.getElementById('jobRegionBar');
  if (regionBar) {
    regionBar.innerHTML = FORUM_REGIONS.map(function(r) {
      var active = jobRegionFilter === r.key;
      return '<button onclick="jobFilterRegion(\'' + r.key + '\')" class="shrink-0 px-2.5 py-1 rounded-lg font-bold text-[10px] transition ' +
        (active ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-400 border border-slate-100') + '">' +
        r.icon + ' ' + t(r.labelKey) + '</button>';
    }).join('');
  }

  // 필터링
  var filtered = jobsList;
  if (jobTypeFilter !== 'all') {
    filtered = filtered.filter(function(j){ return j.type === jobTypeFilter; });
  }
  if (jobRegionFilter !== 'all') {
    filtered = filtered.filter(function(j){ return j.region === jobRegionFilter; });
  }

  var list = document.getElementById('jobsList');
  if (!list) return;
  if (!filtered.length) {
    list.innerHTML = '<p class="text-center text-slate-400 font-bold text-sm py-12">' + t('job_empty') + '</p>';
    return;
  }
  list.innerHTML = filtered.map(function(j) {
    var typeCfg = JOB_TYPES.find(function(jt){ return jt.key === j.type; }) || JOB_TYPES[1];
    var regionCfg = FORUM_REGIONS.find(function(r){ return r.key === j.region; });
    var regionLabel = regionCfg ? (regionCfg.icon + ' ' + t(regionCfg.labelKey)) : (j.region || '');
    var provinceLbl = j.province ? ' · ' + j.province.replace(/_/g, ' ') : '';
    var dateStr = j.date ? j.date.slice(0,10) : '';
    var jid = typeof j.id === 'string' ? "'" + j.id + "'" : j.id;
    return '<div class="bg-white rounded-2xl shadow-sm p-4 cursor-pointer active:scale-[.98] transition" onclick="openJobDetail(' + jid + ')">' +
      '<div class="flex items-start gap-3">' +
        '<div class="text-2xl mt-0.5">' + typeCfg.icon + '</div>' +
        '<div class="flex-1 min-w-0">' +
          '<div class="flex items-center gap-1.5 mb-1">' +
            '<span class="inline-block text-[8px] font-black px-1.5 py-0.5 rounded-full ' + typeCfg.color + '">' + t(typeCfg.labelKey) + '</span>' +
            (regionLabel ? '<span class="text-[8px] font-bold text-slate-400">' + regionLabel + provinceLbl + '</span>' : '') +
          '</div>' +
          '<p class="font-black text-slate-800 text-sm leading-snug mb-1 truncate">' + j.title + '</p>' +
          '<div class="flex items-center gap-2 text-[9px] text-slate-300 font-bold">' +
            (j.salary_range ? '<span class="text-green-500 font-black">' + j.salary_range + '</span><span>·</span>' : '') +
            '<span>' + dateStr + '</span>' +
            '<span>·</span>' +
            '<span>' + (j.user_id || '') + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function jobFilterType(type) {
  jobTypeFilter = type;
  renderJobs();
}
function jobFilterRegion(region) {
  jobRegionFilter = region;
  renderJobs();
}

function openJobDetail(id) {
  var job = jobsList.find(function(j){ return j.id === id; });
  if (!job) return;
  _viewingJobId = id;
  var typeCfg = JOB_TYPES.find(function(jt){ return jt.key === job.type; }) || JOB_TYPES[1];
  var regionCfg = FORUM_REGIONS.find(function(r){ return r.key === job.region; });
  var regionLabel = regionCfg ? (regionCfg.icon + ' ' + t(regionCfg.labelKey)) : '';
  var provinceLbl = job.province ? ' · ' + job.province.replace(/_/g, ' ') : '';

  document.getElementById('jd-typeBadge').className = 'inline-block text-[10px] font-black px-2.5 py-1 rounded-full ' + typeCfg.color;
  document.getElementById('jd-typeBadge').textContent = typeCfg.icon + ' ' + t(typeCfg.labelKey);
  document.getElementById('jd-regionBadge').textContent = regionLabel + provinceLbl;
  document.getElementById('jd-title').textContent = job.title;
  document.getElementById('jd-author').textContent = job.user_id || '';
  document.getElementById('jd-date').textContent = job.date ? job.date.slice(0,10) : '';

  // 급여
  var salaryWrap = document.getElementById('jd-salaryWrap');
  if (job.salary_range) {
    document.getElementById('jd-salary').textContent = job.salary_range;
    salaryWrap.classList.remove('hidden');
  } else { salaryWrap.classList.add('hidden'); }

  // 설명
  document.getElementById('jd-desc').textContent = job.description || '';

  // 요구사항
  var reqWrap = document.getElementById('jd-reqWrap');
  if (job.requirements) {
    document.getElementById('jd-req').textContent = job.requirements;
    reqWrap.classList.remove('hidden');
  } else { reqWrap.classList.add('hidden'); }

  // 연락처
  var contactWrap = document.getElementById('jd-contactWrap');
  if (job.contact) {
    document.getElementById('jd-contact').textContent = job.contact;
    contactWrap.classList.remove('hidden');
  } else { contactWrap.classList.add('hidden'); }

  // 본인 글 삭제 버튼
  var ownerActions = document.getElementById('jd-ownerActions');
  var isOwner = isLoggedIn() && (currentUser.nickname === job.user_id || isAdmin());
  ownerActions.classList.toggle('hidden', !isOwner);

  goDetailPage('job-detail', job.title, 'jobs');
}

async function deleteMyJob() {
  if (!confirm(t('job_delete_confirm'))) return;
  var id = _viewingJobId;
  jobsList = jobsList.filter(function(j){ return j.id !== id; });
  if (typeof id === 'string') {
    try { await sbDeleteJob(id); } catch(e) { console.error('[Job Delete]', e); }
  }
  goPage('jobs');
}

// 글쓰기 폼
function toggleJobForm() {
  var wrap = document.getElementById('jobFormWrap');
  if (!wrap) return;
  if (wrap.classList.contains('hidden')) {
    var typeOpts = JOB_TYPES.filter(function(jt){ return jt.key !== 'all'; }).map(function(jt) {
      return '<option value="' + jt.key + '">' + jt.icon + ' ' + t(jt.labelKey) + '</option>';
    }).join('');
    var regionOpts = FORUM_REGIONS.filter(function(r){ return r.key !== 'all'; }).map(function(r) {
      return '<option value="' + r.key + '">' + r.icon + ' ' + t(r.labelKey) + '</option>';
    }).join('');
    wrap.innerHTML =
      '<div class="bg-white rounded-2xl p-4 shadow-sm space-y-2">' +
        '<p class="font-black text-xs text-slate-700">' + t('job_form_title') + '</p>' +
        '<select id="job-type" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold">' + typeOpts + '</select>' +
        '<input id="job-title" type="text" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" placeholder="' + t('job_title_ph') + '">' +
        '<textarea id="job-desc" rows="4" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold resize-none" placeholder="' + t('job_desc_ph') + '"></textarea>' +
        '<input id="job-salary" type="text" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" placeholder="' + t('job_salary_ph') + '">' +
        '<textarea id="job-req" rows="3" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold resize-none" placeholder="' + t('job_req_ph') + '"></textarea>' +
        '<div class="flex gap-2">' +
          '<select id="job-region" class="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" onchange="jobFormRegionChange()">' + regionOpts + '</select>' +
          '<select id="job-province" class="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"></select>' +
        '</div>' +
        '<input id="job-contact" type="text" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" placeholder="' + t('job_contact_ph') + '">' +
        '<button onclick="submitJob()" class="w-full py-2.5 bg-[#001d4a] text-white rounded-xl font-black text-xs active:scale-95 transition">' + t('job_submit_btn') + '</button>' +
      '</div>';
    jobFormRegionChange();
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
  }
}

function jobFormRegionChange() {
  var regionKey = document.getElementById('job-region').value;
  var provinceSel = document.getElementById('job-province');
  if (!provinceSel) return;
  var regionCfg = FORUM_REGIONS.find(function(r){ return r.key === regionKey; });
  var provinces = regionCfg ? regionCfg.provinces : [];
  provinceSel.innerHTML = '<option value="">' + t('job_province_ph') + '</option>' +
    provinces.map(function(p) {
      return '<option value="' + p.key + '">' + p.label + '</option>';
    }).join('');
}

async function submitJob() {
  var title   = (document.getElementById('job-title').value || '').trim();
  var desc    = (document.getElementById('job-desc').value || '').trim();
  var type    = document.getElementById('job-type').value;
  var salary  = (document.getElementById('job-salary').value || '').trim();
  var req     = (document.getElementById('job-req').value || '').trim();
  var region  = document.getElementById('job-region').value;
  var prov    = document.getElementById('job-province').value;
  var contact = (document.getElementById('job-contact').value || '').trim();
  if (!title || !desc) { alert(t('job_fill_alert')); return; }
  var job = {
    user_id:      currentUser.nickname || '',
    type:         type,
    region:       region || null,
    province:     prov || null,
    title:        title,
    description:  desc,
    salary_range: salary || null,
    requirements: req || null,
    contact:      contact || null,
    is_active:    true,
  };
  try {
    var saved = await sbSaveJob(job);
    if (saved) {
      jobsList.unshift({
        id: saved.id, user_id: saved.user_id, type: saved.type,
        region: saved.region, province: saved.province, title: saved.title,
        description: saved.description, salary_range: saved.salary_range,
        requirements: saved.requirements, contact: saved.contact,
        date: saved.created_at,
      });
    }
  } catch(e) { console.error('[Job Save]', e); }
  document.getElementById('jobFormWrap').classList.add('hidden');
  renderJobs();
}

// 관리자 패널: 구인구직 관리
function renderAdminJobs() {
  var el = document.getElementById('adminTabJobs');
  if (!el) return;
  if (!jobsList.length) {
    el.innerHTML = '<p class="text-center text-slate-400 text-sm py-8 font-bold">' + t('job_empty') + '</p>';
    return;
  }
  el.innerHTML = jobsList.map(function(j) {
    var jid = typeof j.id === 'string' ? "'" + j.id + "'" : j.id;
    var typeCfg = JOB_TYPES.find(function(jt){ return jt.key === j.type; }) || JOB_TYPES[1];
    return '<div class="bg-white rounded-xl p-3 mb-2 shadow-sm flex items-center gap-3">' +
      '<div class="text-xl">' + typeCfg.icon + '</div>' +
      '<div class="flex-1 min-w-0">' +
        '<p class="font-black text-xs text-slate-800 truncate">' + j.title + '</p>' +
        '<p class="text-[9px] text-slate-400">' + t(typeCfg.labelKey) + ' · ' + (j.user_id || '') + '</p>' +
      '</div>' +
      '<button onclick="adminDeleteJob(' + jid + ')" class="shrink-0 px-3 py-1.5 bg-red-50 text-red-500 rounded-xl font-black text-[10px]">' + t('forum_delete') + '</button>' +
    '</div>';
  }).join('');
}

async function adminDeleteJob(id) {
  if (!confirm(t('job_delete_confirm'))) return;
  jobsList = jobsList.filter(function(j){ return j.id !== id; });
  if (typeof id === 'string') {
    try { await sbDeleteJob(id); } catch(e) { console.error('[Job Delete]', e); }
  }
  renderAdminJobs();
  renderJobs();
}

// ============================================================
// WEBZINE
// ============================================================
var WEBZINE_CATEGORIES = [
  { key:'all',       labelKey:'wz_cat_all',       icon:'📰' },
  { key:'implant',   labelKey:'wz_cat_implant',   icon:'🦷' },
  { key:'prosthetic',labelKey:'wz_cat_prosthetic', icon:'🔧' },
  { key:'review',    labelKey:'wz_cat_review',    icon:'⭐' },
  { key:'news',      labelKey:'wz_cat_news',      icon:'📢' },
  { key:'education', labelKey:'wz_cat_education', icon:'📚' },
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
    list.innerHTML = '<p class="col-span-2 text-center text-slate-400 font-bold text-sm py-12">' + t('wz_empty') + '</p>';
    return;
  }
  list.innerHTML = filtered.map(function(a) {
    var catCfg = WEBZINE_CATEGORIES.find(function(c){ return c.key === a.category; }) || {};
    var thumb = a.thumbnail_url
      ? '<img src="' + a.thumbnail_url + '" class="w-full h-full object-cover" loading="lazy">'
      : '<div class="w-full h-full flex items-center justify-center bg-slate-100"><span class="text-3xl opacity-20">📰</span></div>';
    var dateStr = a.date ? a.date.slice(0,10) : '';
    var aid = typeof a.id === 'string' ? "'" + a.id + "'" : a.id;
    return '<div class="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer active:scale-[.97] transition" onclick="openWebzineDetail(' + aid + ')">' +
      '<div class="aspect-[4/3] overflow-hidden">' + thumb + '</div>' +
      '<div class="p-3">' +
        '<span class="inline-block text-[8px] font-black px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 mb-1">' + (catCfg.icon || '') + ' ' + t(catCfg.labelKey || 'wz_cat_news') + '</span>' +
        '<p class="font-black text-slate-800 text-xs leading-snug line-clamp-2 mb-1">' + a.title + '</p>' +
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
function _renderMarkdown(md) {
  // 간단한 마크다운 → HTML 변환
  var html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3 class="font-black text-slate-800 text-base mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-black text-slate-800 text-lg mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-black text-slate-800 text-xl mt-6 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full rounded-xl my-3" loading="lazy">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank">$1</a>')
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
  var latest = webzineArticles.filter(function(a){ return a.title; }).slice(0, 3);
  if (!latest.length) {
    el.innerHTML =
      '<div class="col-span-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-8 text-center">' +
        '<p class="text-2xl mb-1 opacity-30">📰</p>' +
        '<p class="text-[11px] font-black text-slate-300">' + t('wz_home_empty') + '</p>' +
      '</div>';
    return;
  }
  el.innerHTML = latest.map(function(a) {
    var catCfg = WEBZINE_CATEGORIES.find(function(c){ return c.key === a.category; }) || {};
    var thumb = a.thumbnail_url
      ? '<img src="' + a.thumbnail_url + '" class="w-full h-full object-cover" loading="lazy">'
      : '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50"><span class="text-2xl opacity-20">📰</span></div>';
    var dateStr = a.date ? a.date.slice(5, 10).replace('-', '/') : '';
    var aid = typeof a.id === 'string' ? "'" + a.id + "'" : a.id;
    return '<div class="rounded-xl overflow-hidden bg-white shadow-sm cursor-pointer active:scale-[.97] transition" onclick="openWebzineDetail(' + aid + ')">' +
      '<div class="aspect-square overflow-hidden relative">' + thumb +
        '<span class="absolute top-1 left-1 text-[7px] font-black px-1.5 py-0.5 rounded-full bg-white/80 backdrop-blur-sm text-slate-600">' + (catCfg.icon || '📰') + ' ' + t(catCfg.labelKey || 'wz_cat_news') + '</span>' +
      '</div>' +
      '<div class="p-1.5">' +
        '<p class="font-black text-[9px] text-slate-700 leading-tight line-clamp-2 mb-0.5">' + a.title + '</p>' +
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
  if (!title || !body) { alert(t('wz_fill_alert')); return; }
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
  } catch(e) { console.error('[Webzine Save]', e); }
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
      (a.thumbnail_url ? '<img src="' + a.thumbnail_url + '" class="w-12 h-12 rounded-lg object-cover shrink-0" loading="lazy">' : '<div class="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0"><span class="text-lg opacity-30">📰</span></div>') +
      '<div class="flex-1 min-w-0">' +
        '<p class="font-black text-xs text-slate-800 truncate">' + a.title + '</p>' +
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
// ============================================================
// EVENTS
// ============================================================
function renderEvents() {
  var el = document.getElementById('eventList');
  if (!el) return;
  if (!events_.length) {
    el.innerHTML = '<p class="text-center text-slate-400 font-bold text-sm py-12">' + t('home_events_empty') + '</p>';
    return;
  }
  // 모임 생성 버튼 (로그인 유저)
  var createBtn = isLoggedIn()
    ? '<button onclick="toggleMeetupForm()" class="w-full py-3 bg-[#001d4a] text-white rounded-2xl font-black text-xs mb-4 active:scale-95 transition">➕ ' + t('meetup_create_btn') + '</button>' +
      '<div id="meetupFormWrap" class="hidden mb-4"></div>'
    : '';
  el.innerHTML = createBtn + events_.map(function(e) {
    var parts = (e.date||'').split('-');
    var monthNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    var monthIdx = parseInt(parts[1]||1, 10) - 1;
    var monthStr = monthNames[monthIdx] || (parts[1]||'');
    var dayStr   = parts[2] ? parseInt(parts[2], 10) : '';
    var yearStr  = parts[0] || '';
    var typeBadge = e.type === 'meetup'
      ? '<span class="inline-block text-[8px] font-black px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 mb-1">🤝 ' + t('meetup_badge') + '</span>'
      : '<span class="inline-block text-[8px] font-black px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 mb-1">📅 ' + t('event_badge') + '</span>';
    var rsvpCount = (e._rsvpCount !== undefined) ? e._rsvpCount : '';
    var rsvpLabel = rsvpCount !== '' ? '<span class="text-[9px] font-black text-green-600 mt-1">👥 ' + rsvpCount + ' ' + t('rsvp_attendees') + '</span>' : '';
    var evId = typeof e.id === 'string' ? "'" + e.id + "'" : e.id;
    // 리더/관리자 삭제 버튼
    var canDel = canManageRegion(e.region || 'all') || (isLoggedIn() && e.createdBy === currentUser.nickname);
    var delBtn = canDel
      ? '<button onclick="event.stopPropagation();leaderDeleteEvent(' + evId + ')" class="shrink-0 ml-1 w-7 h-7 rounded-lg bg-red-50 text-red-400 text-xs font-black flex items-center justify-center active:scale-90">✕</button>'
      : '';
    return '<div class="bg-white rounded-2xl shadow-sm overflow-hidden flex cursor-pointer active:scale-[.98] transition" onclick="openEventDetail(' + evId + ')">' +
      '<div class="bg-[#001d4a] flex flex-col items-center justify-center px-5 py-5 shrink-0 min-w-[72px]">' +
        '<span class="text-blue-300 text-[10px] font-black uppercase tracking-widest">' + monthStr + '</span>' +
        '<span class="text-white text-3xl font-black leading-none mt-0.5">' + dayStr + '</span>' +
        '<span class="text-blue-400 text-[10px] font-bold mt-0.5">' + yearStr + '</span>' +
      '</div>' +
      '<div class="flex-1 p-4 min-w-0 flex items-center">' +
        '<div class="flex-1 min-w-0">' +
          typeBadge +
          '<p class="font-black text-slate-800 text-sm leading-snug">' + e.event + '</p>' +
          '<p class="text-xs text-slate-400 font-bold mt-1">📍 ' + e.loc + '</p>' +
          rsvpLabel +
        '</div>' +
        '<span class="text-slate-300 text-lg font-black shrink-0 ml-2">›</span>' +
        delBtn +
      '</div>' +
    '</div>';
  }).join('');
  // 비동기 RSVP 카운트 로드
  _loadEventRsvpCounts();
}
async function _loadEventRsvpCounts() {
  for (var i = 0; i < events_.length; i++) {
    var ev = events_[i];
    var sbId = ev._sbId || ev.id;
    if (typeof sbId !== 'string') continue;
    try {
      var rsvps = await sbGetEventRsvps(sbId);
      var count = rsvps.filter(function(r){ return r.status === 'attending'; }).length;
      ev._rsvpCount = count;
    } catch(e) { ev._rsvpCount = 0; }
  }
  // 카운트 업데이트 후 리스트 UI만 재반영
  var el = document.getElementById('eventList');
  if (!el) return;
  var items = el.querySelectorAll('[data-rsvp-count]');
  events_.forEach(function(ev) {
    var badge = document.getElementById('rsvp-count-' + (ev._sbId || ev.id));
    if (badge && ev._rsvpCount !== undefined) badge.textContent = '👥 ' + ev._rsvpCount + ' ' + t('rsvp_attendees');
  });
}
function openEventDetail(id) {
  var ev = events_.find(function(e){ return e.id === id; });
  if (!ev) return;
  var parts = (ev.date||'').split('-');
  var monthNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  var monthIdx = parseInt(parts[1]||1, 10) - 1;
  document.getElementById('edp-month').textContent = monthNames[monthIdx] || (parts[1]||'');
  document.getElementById('edp-day').textContent   = parts[2] ? parseInt(parts[2], 10) : '';
  document.getElementById('edp-year').textContent  = parts[0] || '';
  document.getElementById('edp-title').textContent = ev.event;
  document.getElementById('edp-locText').textContent = ev.loc;
  // 타입 배지
  var typeBadgeEl = document.getElementById('edp-typeBadge');
  if (typeBadgeEl) {
    typeBadgeEl.innerHTML = ev.type === 'meetup'
      ? '<span class="text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">🤝 ' + t('meetup_badge') + '</span>'
      : '<span class="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">📅 ' + t('event_badge') + '</span>';
  }
  // 작성자
  var creatorEl = document.getElementById('edp-creator');
  if (creatorEl) {
    creatorEl.textContent = ev.createdBy ? (t('meetup_created_by') + ' ' + ev.createdBy) : '';
  }
  var descWrap = document.getElementById('edp-descWrap');
  var descEl   = document.getElementById('edp-desc');
  if (ev.desc) {
    descEl.textContent = ev.desc;
    descWrap.classList.remove('hidden');
  } else {
    descWrap.classList.add('hidden');
  }
  document.getElementById('edp-imageWrap').classList.add('hidden');
  goDetailPage('event-detail', ev.event, 'events');
  // RSVP 로드
  _loadEventDetailRsvp(ev);
}
var _currentDetailEvent = null;
async function _loadEventDetailRsvp(ev) {
  _currentDetailEvent = ev;
  var sbId = ev._sbId || ev.id;
  var rsvpWrap = document.getElementById('edp-rsvpWrap');
  if (!rsvpWrap) return;
  rsvpWrap.classList.remove('hidden');
  var rsvpBtns = document.getElementById('edp-rsvpBtns');
  var attendeeList = document.getElementById('edp-attendeeList');
  var countEl = document.getElementById('edp-rsvpCount');
  if (!isLoggedIn()) {
    rsvpBtns.innerHTML = '<p class="text-xs text-slate-400 font-bold">' + t('rsvp_login_required') + '</p>';
  } else {
    rsvpBtns.innerHTML =
      '<button id="edp-rsvpYes" onclick="toggleRsvp(\'attending\')" class="flex-1 py-2.5 rounded-xl font-black text-xs border-2 transition active:scale-95">' + t('rsvp_attend') + '</button>' +
      '<button id="edp-rsvpNo" onclick="toggleRsvp(\'not_attending\')" class="flex-1 py-2.5 rounded-xl font-black text-xs border-2 transition active:scale-95">' + t('rsvp_not_attend') + '</button>';
  }
  // 참석자 로드
  if (typeof sbId !== 'string') {
    countEl.textContent = '0 ' + t('rsvp_attendees');
    attendeeList.innerHTML = '';
    return;
  }
  try {
    var attendees = await sbGetRsvpAttendees(sbId);
    countEl.textContent = attendees.length + ' ' + t('rsvp_attendees');
    ev._rsvpCount = attendees.length;
    attendeeList.innerHTML = attendees.length
      ? attendees.map(function(a) {
          return '<div class="flex items-center gap-2 py-1.5 border-b border-slate-50 last:border-0">' +
            '<span class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">👤</span>' +
            '<span class="font-black text-xs text-slate-700">' + a.nickname + '</span>' +
            '<span class="text-[10px] text-slate-400">' + (a.clinic || '') + '</span>' +
          '</div>';
        }).join('')
      : '<p class="text-xs text-slate-400 font-bold py-2">' + t('rsvp_no_attendees') + '</p>';
    // 현재 유저 RSVP 상태 반영
    if (isLoggedIn()) {
      var myRsvp = attendees.find(function(a){ return a.nickname === currentUser.nickname; });
      _updateRsvpButtons(myRsvp ? 'attending' : null);
      // not_attending 상태도 확인
      if (!myRsvp) {
        var allRsvps = await sbGetEventRsvps(sbId);
        var mine = allRsvps.find(function(r){ return r.user_id === currentUser.nickname; });
        if (mine) _updateRsvpButtons(mine.status);
      }
    }
  } catch(e) {
    console.warn('[RSVP Load]', e);
    countEl.textContent = '0 ' + t('rsvp_attendees');
    attendeeList.innerHTML = '';
  }
}
function _updateRsvpButtons(status) {
  var yesBtn = document.getElementById('edp-rsvpYes');
  var noBtn  = document.getElementById('edp-rsvpNo');
  if (!yesBtn || !noBtn) return;
  if (status === 'attending') {
    yesBtn.className = 'flex-1 py-2.5 rounded-xl font-black text-xs border-2 border-green-500 bg-green-50 text-green-700 transition active:scale-95';
    noBtn.className  = 'flex-1 py-2.5 rounded-xl font-black text-xs border-2 border-slate-200 bg-white text-slate-400 transition active:scale-95';
  } else if (status === 'not_attending') {
    yesBtn.className = 'flex-1 py-2.5 rounded-xl font-black text-xs border-2 border-slate-200 bg-white text-slate-400 transition active:scale-95';
    noBtn.className  = 'flex-1 py-2.5 rounded-xl font-black text-xs border-2 border-red-500 bg-red-50 text-red-700 transition active:scale-95';
  } else {
    yesBtn.className = 'flex-1 py-2.5 rounded-xl font-black text-xs border-2 border-slate-200 bg-white text-slate-600 transition active:scale-95';
    noBtn.className  = 'flex-1 py-2.5 rounded-xl font-black text-xs border-2 border-slate-200 bg-white text-slate-600 transition active:scale-95';
  }
}
async function toggleRsvp(status) {
  if (!isLoggedIn() || !_currentDetailEvent) return;
  var ev = _currentDetailEvent;
  var sbId = ev._sbId || ev.id;
  if (typeof sbId !== 'string') { alert(t('rsvp_error')); return; }
  try {
    await sbUpsertRsvp(sbId, currentUser.nickname, status);
    _updateRsvpButtons(status);
    _loadEventDetailRsvp(ev);
  } catch(e) {
    console.error('[RSVP]', e);
    alert(t('rsvp_error'));
  }
}
async function leaderDeleteEvent(id) {
  if (!confirm(t('event_delete_confirm'))) return;
  var removed = events_.find(function(e){ return e.id === id; });
  events_ = events_.filter(function(e){ return e.id !== id; });
  renderEvents();
  renderHomeEventsPreview();
  if (removed && (removed._sbId || typeof removed.id === 'string')) {
    sbDeleteEvent(removed._sbId || removed.id).catch(function(e){ console.error('[Event Delete]', e); });
  }
}
// ============================================================
// MEETUP — 일반 유저 모임 생성
// ============================================================
function toggleMeetupForm() {
  var wrap = document.getElementById('meetupFormWrap');
  if (!wrap) return;
  if (wrap.classList.contains('hidden')) {
    var regionOpts = FORUM_REGIONS.map(function(r) {
      return '<option value="' + r.key + '">' + r.icon + ' ' + t(r.labelKey) + '</option>';
    }).join('');
    wrap.innerHTML =
      '<div class="bg-white rounded-2xl p-4 shadow-sm space-y-2">' +
        '<p class="font-black text-xs text-slate-700">' + t('meetup_form_title') + '</p>' +
        '<input id="meetup-title" type="text" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-400" placeholder="' + t('meetup_title_ph') + '">' +
        '<input id="meetup-date" type="date" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-400">' +
        '<input id="meetup-loc" type="text" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-400" placeholder="' + t('meetup_loc_ph') + '">' +
        '<select id="meetup-region" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-400">' + regionOpts + '</select>' +
        '<textarea id="meetup-desc" rows="3" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-400 resize-none" placeholder="' + t('meetup_desc_ph') + '"></textarea>' +
        '<button onclick="submitMeetup()" class="w-full py-2.5 bg-purple-600 text-white rounded-xl font-black text-xs active:scale-95 transition">' + t('meetup_submit_btn') + '</button>' +
      '</div>';
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
  }
}
async function submitMeetup() {
  var title  = (document.getElementById('meetup-title').value || '').trim();
  var date   = (document.getElementById('meetup-date').value || '').trim();
  var loc    = (document.getElementById('meetup-loc').value || '').trim();
  var region = (document.getElementById('meetup-region').value || 'all');
  var desc   = (document.getElementById('meetup-desc').value || '').trim();
  if (!title || !date || !loc) { alert(t('meetup_fill_alert')); return; }
  var newEv = {
    id: Date.now(), date: date, event: title, loc: loc, desc: desc,
    type: 'meetup', region: region,
    createdBy: currentUser.nickname || ''
  };
  events_.unshift(newEv);
  document.getElementById('meetupFormWrap').classList.add('hidden');
  renderEvents();
  renderHomeEventsPreview();
  try {
    var saved = await sbSaveEvent(newEv);
    if (saved && saved.id) {
      var idx = events_.findIndex(function(x){ return x === newEv; });
      if (idx !== -1) { events_[idx]._sbId = saved.id; events_[idx].id = saved.id; }
    }
  } catch(e) { console.error('[Meetup Save]', e); }
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
// ADMIN — 광고 관리 (Ad Manager)
// ============================================================
var _adminBanners = [];
var _adminAdEditId = null;
var _adminAdImageUrl = '';
var _adminAdImageFile = null;

async function renderAdminAds() {
  var el = document.getElementById('adminTabAds');
  if (!el) return;

  // 로딩 표시
  el.innerHTML = '<p class="text-center text-slate-400 text-sm py-8 font-bold">Loading...</p>';

  try {
    _adminBanners = await sbGetAllBanners() || [];
  } catch(e) {
    console.error('[AdminAds]', e);
    _adminBanners = [];
  }

  _adminAdEditId = null;
  _adminAdImageUrl = '';
  _adminAdImageFile = null;
  _renderAdminAdsUI();
}

function _renderAdminAdsUI() {
  var el = document.getElementById('adminTabAds');
  if (!el) return;

  var today = new Date().toISOString().slice(0, 10);
  var activeBanners = _adminBanners.filter(function(b) { return b.is_active; });
  var totalClicks = 0, totalImpressions = 0;
  _adminBanners.forEach(function(b) {
    totalClicks += b.clicks || 0;
    totalImpressions += b.impressions || 0;
  });
  var avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) + '%' : '0%';

  // 요약 카드
  var summaryHtml =
    '<div class="grid grid-cols-2 gap-2 mb-4">' +
      '<div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-3 text-white">' +
        '<p class="text-[10px] font-bold opacity-80">' + t('admin_ads_summary_active') + '</p>' +
        '<p class="text-xl font-black">' + activeBanners.length + '</p>' +
      '</div>' +
      '<div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-3 text-white">' +
        '<p class="text-[10px] font-bold opacity-80">' + t('admin_ads_summary_clicks') + '</p>' +
        '<p class="text-xl font-black">' + totalClicks.toLocaleString() + '</p>' +
      '</div>' +
      '<div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-3 text-white">' +
        '<p class="text-[10px] font-bold opacity-80">' + t('admin_ads_summary_impressions') + '</p>' +
        '<p class="text-xl font-black">' + totalImpressions.toLocaleString() + '</p>' +
      '</div>' +
      '<div class="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-3 text-white">' +
        '<p class="text-[10px] font-bold opacity-80">' + t('admin_ads_summary_ctr') + '</p>' +
        '<p class="text-xl font-black">' + avgCtr + '</p>' +
      '</div>' +
    '</div>';

  // 등록/수정 폼
  var isEditing = !!_adminAdEditId;
  var editBanner = isEditing ? _adminBanners.find(function(b) { return b.id === _adminAdEditId; }) : null;
  var formTitle = isEditing ? t('admin_ads_editing') : t('admin_ads_form_title');
  var submitLabel = isEditing ? t('admin_ads_save') : t('admin_ads_submit');

  var posOptions = ['home_top','home_mid','forum_top','shop_bottom'].map(function(p) {
    var sel = editBanner && editBanner.position === p ? ' selected' : (!editBanner && p === 'home_top' ? ' selected' : '');
    return '<option value="' + p + '"' + sel + '>' + p + '</option>';
  }).join('');

  var imgPreview = '';
  if (_adminAdImageUrl) {
    imgPreview = '<img src="' + _adminAdImageUrl + '" class="w-full h-24 object-cover rounded-xl mt-1">';
  } else if (editBanner && editBanner.image_url) {
    imgPreview = '<img src="' + editBanner.image_url + '" class="w-full h-24 object-cover rounded-xl mt-1">';
  }

  var cancelBtn = isEditing
    ? '<button onclick="adminAdCancelEdit()" class="w-full py-2.5 bg-slate-200 text-slate-600 rounded-xl font-black text-xs mt-1.5">' + t('admin_ads_cancel') + '</button>'
    : '';

  var formHtml =
    '<div class="bg-white rounded-xl p-4 mb-4 shadow-sm">' +
      '<p class="font-black text-xs text-slate-700 mb-3">' + formTitle + '</p>' +
      '<input id="adminAdAdvertiser" type="text" placeholder="' + t('admin_ads_advertiser_ph') + '" value="' + (editBanner ? (editBanner.advertiser_name || '') : '') + '" class="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-2 font-bold">' +
      '<div class="mb-2">' +
        '<label class="block text-[10px] font-bold text-slate-500 mb-1">' + t('admin_ads_image') + '</label>' +
        '<div id="adminAdImageDrop" onclick="document.getElementById(\'adminAdImageInput\').click()" class="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-center cursor-pointer hover:border-blue-400 transition">' +
          '<p class="text-xs text-slate-400 font-bold">' + (isEditing ? t('admin_ads_image_change') : t('admin_ads_image_upload')) + '</p>' +
          imgPreview +
        '</div>' +
        '<input id="adminAdImageInput" type="file" accept="image/*" class="hidden" onchange="adminAdImageSelected(this)">' +
      '</div>' +
      '<input id="adminAdLink" type="url" placeholder="' + t('admin_ads_link_ph') + '" value="' + (editBanner ? (editBanner.link_url || '') : '') + '" class="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-2 font-bold">' +
      '<div class="mb-2">' +
        '<label class="block text-[10px] font-bold text-slate-500 mb-1">' + t('admin_ads_position') + '</label>' +
        '<select id="adminAdPosition" class="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold">' + posOptions + '</select>' +
      '</div>' +
      '<div class="grid grid-cols-2 gap-2 mb-2">' +
        '<div>' +
          '<label class="block text-[10px] font-bold text-slate-500 mb-1">' + t('admin_ads_start') + '</label>' +
          '<input id="adminAdStart" type="date" value="' + (editBanner ? editBanner.start_date : today) + '" class="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold">' +
        '</div>' +
        '<div>' +
          '<label class="block text-[10px] font-bold text-slate-500 mb-1">' + t('admin_ads_end') + '</label>' +
          '<input id="adminAdEnd" type="date" value="' + (editBanner ? editBanner.end_date : '') + '" class="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold">' +
        '</div>' +
      '</div>' +
      '<button onclick="adminAdSubmit()" class="w-full py-2.5 bg-[#001d4a] text-white rounded-xl font-black text-xs active:scale-95 transition">' + submitLabel + '</button>' +
      cancelBtn +
    '</div>';

  // 배너 목록 테이블
  var listHtml;
  if (!_adminBanners.length) {
    listHtml = '<p class="text-center text-slate-400 text-sm py-4 font-bold">' + t('admin_ads_empty') + '</p>';
  } else {
    var rows = _adminBanners.map(function(b) {
      var ctr = b.impressions > 0 ? ((b.clicks / b.impressions) * 100).toFixed(1) + '%' : '0%';
      var statusClass = b.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500';
      var statusText = b.is_active ? t('admin_ads_active') : t('admin_ads_inactive');
      var bid = "'" + b.id + "'";
      return '<div class="bg-white rounded-xl p-3 mb-2 shadow-sm">' +
        '<div class="flex items-center gap-2 mb-2">' +
          (b.image_url ? '<img src="' + b.image_url + '" class="w-12 h-12 rounded-lg object-cover shrink-0" loading="lazy">' : '') +
          '<div class="flex-1 min-w-0">' +
            '<p class="font-black text-xs text-slate-800 truncate">' + (b.advertiser_name || '-') + '</p>' +
            '<p class="text-[9px] text-slate-400">' + b.position + ' · ' + (b.start_date || '') + ' ~ ' + (b.end_date || '') + '</p>' +
          '</div>' +
          '<button onclick="adminAdToggle(' + bid + ')" class="shrink-0 px-2 py-1 rounded-full font-black text-[9px] ' + statusClass + '">' + statusText + '</button>' +
        '</div>' +
        '<div class="flex items-center justify-between text-[9px] text-slate-500">' +
          '<span>' + t('admin_ads_col_clicks') + ': <b>' + (b.clicks || 0) + '</b></span>' +
          '<span>' + t('admin_ads_col_impressions') + ': <b>' + (b.impressions || 0) + '</b></span>' +
          '<span>CTR: <b>' + ctr + '</b></span>' +
          '<div class="flex gap-1">' +
            '<button onclick="adminAdEdit(' + bid + ')" class="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-black text-[9px]">' + t('admin_ads_edit') + '</button>' +
            '<button onclick="adminAdDelete(' + bid + ')" class="px-2 py-1 bg-red-50 text-red-500 rounded-lg font-black text-[9px]">' + t('admin_ads_delete') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
    listHtml = '<div class="mb-2"><p class="font-black text-xs text-slate-700 mb-2">' + t('admin_ads_list_title') + '</p>' + rows + '</div>';
  }

  el.innerHTML = summaryHtml + formHtml + listHtml;
}

function adminAdImageSelected(input) {
  if (!input.files || !input.files[0]) return;
  _adminAdImageFile = input.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    _adminAdImageUrl = e.target.result;
    var drop = document.getElementById('adminAdImageDrop');
    if (drop) {
      drop.innerHTML = '<img src="' + _adminAdImageUrl + '" class="w-full h-24 object-cover rounded-xl">';
    }
  };
  reader.readAsDataURL(_adminAdImageFile);
}

async function _adminAdUploadImage(file) {
  var ext = file.name.split('.').pop() || 'jpg';
  var fname = 'banner_' + Date.now() + '.' + ext;
  var r = await fetch(SUPABASE_URL + '/storage/v1/object/banners/' + fname, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Content-Type': file.type || 'image/jpeg',
    },
    body: file,
  });
  if (!r.ok) throw new Error('Image upload failed: HTTP ' + r.status);
  return SUPABASE_URL + '/storage/v1/object/public/banners/' + fname;
}

async function adminAdSubmit() {
  var advertiser = (document.getElementById('adminAdAdvertiser').value || '').trim();
  var link = (document.getElementById('adminAdLink').value || '').trim();
  var position = document.getElementById('adminAdPosition').value;
  var startDate = document.getElementById('adminAdStart').value;
  var endDate = document.getElementById('adminAdEnd').value;

  var isEditing = !!_adminAdEditId;

  // 새 등록시 이미지 필수
  if (!isEditing && !_adminAdImageFile) {
    alert(t('admin_ads_fill_alert'));
    return;
  }
  if (!advertiser || !position) {
    alert(t('admin_ads_fill_alert'));
    return;
  }

  try {
    var imageUrl = '';
    if (_adminAdImageFile) {
      imageUrl = await _adminAdUploadImage(_adminAdImageFile);
    }

    if (isEditing) {
      var updates = {
        advertiser_name: advertiser,
        link_url: link,
        position: position,
        start_date: startDate,
        end_date: endDate,
      };
      if (imageUrl) updates.image_url = imageUrl;
      await sbUpdateBanner(_adminAdEditId, updates);
      alert(t('admin_ads_update_success'));
    } else {
      await sbSaveBanner({
        advertiser_name: advertiser,
        image_url: imageUrl,
        link_url: link,
        position: position,
        start_date: startDate,
        end_date: endDate,
        is_active: true,
      });
    }

    _adminAdEditId = null;
    _adminAdImageUrl = '';
    _adminAdImageFile = null;
    await renderAdminAds();
    // 프론트 배너도 갱신
    await loadAdBanners();
    renderAllAdSlots();
  } catch(e) {
    console.error('[AdminAd Submit]', e);
    alert('Error: ' + e.message);
  }
}

function adminAdEdit(id) {
  _adminAdEditId = id;
  _adminAdImageUrl = '';
  _adminAdImageFile = null;
  _renderAdminAdsUI();
  // 스크롤 위로
  var el = document.getElementById('adminTabAds');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function adminAdCancelEdit() {
  _adminAdEditId = null;
  _adminAdImageUrl = '';
  _adminAdImageFile = null;
  _renderAdminAdsUI();
}

async function adminAdToggle(id) {
  var banner = _adminBanners.find(function(b) { return b.id === id; });
  if (!banner) return;
  var newActive = !banner.is_active;
  try {
    await sbUpdateBanner(id, { is_active: newActive });
    banner.is_active = newActive;
    _renderAdminAdsUI();
    await loadAdBanners();
    renderAllAdSlots();
  } catch(e) {
    console.error('[AdminAd Toggle]', e);
    alert('Error: ' + e.message);
  }
}

async function adminAdDelete(id) {
  if (!confirm(t('admin_ads_delete_confirm'))) return;
  try {
    await sbDeleteBanner(id);
    _adminBanners = _adminBanners.filter(function(b) { return b.id !== id; });
    _renderAdminAdsUI();
    await loadAdBanners();
    renderAllAdSlots();
  } catch(e) {
    console.error('[AdminAd Delete]', e);
    alert('Error: ' + e.message);
  }
}

// ============================================================
// AD BANNERS — 광고 배너 시스템
// ============================================================
var _adBanners = {};          // position → [banner, ...]
var _adSlideIdx = {};         // position → current slide index
var _adSlideTimers = {};      // position → interval id

// position별 활성 배너 fetch → 캐시
async function loadAdBanners() {
  var positions = ['home_top', 'home_mid', 'forum_top', 'shop_bottom'];
  await Promise.all(positions.map(async function(pos) {
    try {
      var rows = await sbGetBannersByPosition(pos);
      _adBanners[pos] = rows || [];
    } catch(e) {
      console.warn('[loadAdBanners]', pos, e);
      _adBanners[pos] = [];
    }
  }));
}

// 공통 배너 렌더링 함수
function renderAdSlot(position, containerId) {
  var el = document.getElementById(containerId);
  if (!el) return;
  var banners = _adBanners[position] || [];
  if (!banners.length) {
    el.innerHTML = '';
    el.classList.add('hidden');
    return;
  }
  el.classList.remove('hidden');

  if (banners.length === 1) {
    // 단일 배너
    var b = banners[0];
    el.innerHTML =
      '<div class="relative rounded-2xl overflow-hidden shadow-sm cursor-pointer active:scale-[.98] transition" onclick="onAdBannerClick(\'' + b.id + '\',\'' + (b.link_url || '').replace(/'/g, "\\'") + '\')">' +
        '<img src="' + b.image_url + '" class="w-full h-auto object-cover" style="max-height:140px" loading="lazy">' +
        '<span class="absolute bottom-1.5 right-2 text-[7px] font-bold text-white/60 bg-black/30 px-1.5 py-0.5 rounded-full">' + t('ad_label') + '</span>' +
      '</div>';
    // impression 기록
    _trackAdImpression(b.id);
    return;
  }

  // 다중 배너 슬라이드
  var slides = banners.map(function(b, i) {
    return '<div class="shrink-0 w-full cursor-pointer" onclick="onAdBannerClick(\'' + b.id + '\',\'' + (b.link_url || '').replace(/'/g, "\\'") + '\')">' +
      '<img src="' + b.image_url + '" class="w-full h-auto object-cover rounded-2xl" style="max-height:140px" loading="lazy">' +
    '</div>';
  }).join('');

  var dots = banners.map(function(_, i) {
    return '<span class="ad-dot w-1.5 h-1.5 rounded-full transition-all ' + (i === 0 ? 'bg-white w-2 h-2' : 'bg-white/40') + '"></span>';
  }).join('');

  el.innerHTML =
    '<div class="relative rounded-2xl overflow-hidden shadow-sm">' +
      '<div class="ad-track flex" style="transition:transform .4s ease" data-pos="' + position + '">' + slides + '</div>' +
      '<div class="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">' + dots + '</div>' +
      '<span class="absolute bottom-1.5 right-2 text-[7px] font-bold text-white/60 bg-black/30 px-1.5 py-0.5 rounded-full">' + t('ad_label') + '</span>' +
    '</div>';

  // 초기화: 슬라이드 + impression
  _adSlideIdx[position] = 0;
  _trackAdImpression(banners[0].id);

  if (_adSlideTimers[position]) clearInterval(_adSlideTimers[position]);
  _adSlideTimers[position] = setInterval(function() {
    var idx = ((_adSlideIdx[position] || 0) + 1) % banners.length;
    _adSlideIdx[position] = idx;
    var track = el.querySelector('.ad-track');
    if (track) track.style.transform = 'translateX(-' + (idx * 100) + '%)';
    var allDots = el.querySelectorAll('.ad-dot');
    allDots.forEach(function(d, di) {
      d.style.width = di === idx ? '8px' : '6px';
      d.style.height = di === idx ? '8px' : '6px';
      d.style.background = di === idx ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)';
    });
    _trackAdImpression(banners[idx].id);
  }, 5000);
}

function onAdBannerClick(bannerId, linkUrl) {
  sbBannerClick(bannerId).catch(function(){});
  if (linkUrl) window.open(linkUrl, '_blank');
}

function _trackAdImpression(bannerId) {
  sbBannerImpression(bannerId).catch(function(){});
}

// 모든 슬롯 렌더링
function renderAllAdSlots() {
  renderAdSlot('home_top',    'adSlotHomeTop');
  renderAdSlot('home_mid',    'adSlotHomeMid');
  renderAdSlot('forum_top',   'adSlotForumTop');
  renderAdSlot('shop_bottom', 'adSlotShopBottom');
}

// ============================================================
// HOME PAGE — banner + categories + forum/events preview
// ============================================================
var _bannerSlide = 0, _bannerInterval = null;

function setBannerSlide(idx) {
  _bannerSlide = idx;
  var track = document.getElementById('homeBannerTrack');
  if (track) track.style.transform = 'translateX(-' + (idx * 100) + '%)';
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
  var catEmoji = {
    'scan-body':  '🔬',
    'q-base':     '💎',
    'ready-made': '🔩',
    'ti-base':    '⚙️',
    'pre-milled': '🔧',
    'multi-unit': '🦷',
    '3d-analog':  '🖨️'
  };
  el.innerHTML = SHOP_CATEGORIES.map(function(cat) {
    return '<button onclick="openShopCategory(\'' + cat.id + '\')" ' +
      'class="bg-white rounded-2xl px-3.5 py-3 shadow-sm flex items-center gap-3 text-left active:bg-slate-50 transition border border-slate-100/80">' +
      '<span class="text-2xl leading-none shrink-0">' + (catEmoji[cat.id] || '📦') + '</span>' +
      '<div class="flex-1 min-w-0">' +
        '<p class="font-black text-slate-800 text-xs leading-snug">' + cat.name + '</p>' +
        '<p class="text-[9px] text-slate-400 font-medium mt-0.5 leading-snug">' + t(catDescKeys[cat.id] || '') + '</p>' +
      '</div>' +
      '<span class="text-slate-300 text-sm shrink-0">›</span>' +
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
  } catch(e) { console.warn('[Used Items Init]', e); }

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
  } catch(e) { console.warn('[Forum Posts Init]', e); }

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
  } catch(e) { console.warn('[Events Init]', e); }

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
  } catch(e) { console.warn('[Webzine Init]', e); renderHomeWebzinePreview(); }

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
  } catch(e) { console.warn('[Jobs Init]', e); }

  // ── Ad Banners (광고 배너) ──────────────────────────────────
  try {
    await loadAdBanners();
    renderAllAdSlots();
  } catch(e) { console.warn('[Banners Init]', e); }
}

// ============================================================
// 통합 검색
// ============================================================
var _searchTimer = null;
function openSearchModal() {
  document.getElementById('searchModal').style.display = 'flex';
  setTimeout(function(){ document.getElementById('searchInput').focus(); }, 100);
}
function closeSearchModal() {
  document.getElementById('searchModal').style.display = 'none';
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
          '<p class="font-black text-sm text-slate-800 truncate">' + r.title + '</p>' +
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
          '<div class="flex-1 min-w-0"><p class="font-black text-sm text-slate-800 truncate">' + r.title + '</p>' +
          '<p class="text-[9px] text-slate-400 mt-0.5">' + (r.created_at || '').slice(0,10) + '</p></div></div>';
      }).join('');
      html += '</div>';
    }
    // 구인구직
    if (results.jobs.length) {
      html += '<div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">' + t('nav_jobs') + ' (' + results.jobs.length + ')</p>';
      html += results.jobs.map(function(r) {
        return '<div class="bg-white rounded-xl p-3 mb-1.5 cursor-pointer active:bg-slate-50 transition shadow-sm" onclick="closeSearchModal();openJobDetail(' + r.id + ')">' +
          '<p class="font-black text-sm text-slate-800 truncate">' + r.title + '</p>' +
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
    console.warn('[Search]', e);
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
  document.getElementById('notifPanel').style.display = 'flex';
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
  document.getElementById('notifPanel').style.display = 'none';
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
    console.warn('[Notifications]', e);
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
    console.warn('[InfiniteScroll]', pageType, e);
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
  var saved = localStorage.getItem('dentalk_lang') || 'en';
  currentLang = saved;
  document.documentElement.lang = currentLang; // 폰트 CSS 즉시 적용
  pendingLang = null;
  document.getElementById('mb-home').classList.add('active');
  updateNavTabs('home');

  // 페이지 로드 시 항상 로그아웃 상태로 시작
  localStorage.removeItem('dentalk_session');

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
});
