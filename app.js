// ============================================================
// 상수 & 데이터
// ============================================================
const LOCKED = ['shop','forum','custom'];
const IMPLANT_BRANDS = ['BIOTEM N','BIOTEM R','Osstem US','Osstem TS','Straumann BL','Straumann TL','Nobel Active','Nobel Replace','Zimmer TSV','Dentium SuperLine','기타'];
const TOOTH_COLORS   = ['A1','A2','A3','A3.5','A4','B1','B2','B3','C1','C2','C3','D2','D3','BL (Bleach)'];
const ORDER_STAGES   = [
  {key:'received',icon:'[1]'},{key:'stl',icon:'[2]'},{key:'design',icon:'[3]'},
  {key:'cnc',icon:'[4]'},{key:'qc',icon:'[5]'},{key:'shipping',icon:'[6]'},{key:'done',icon:'[7]'},
];
const LINE_TOKEN = 'YOUR_LINE_NOTIFY_TOKEN';
// ── Supabase 면허 검증 ──────────────────────────────────────────
// Supabase 프로젝트 생성 후 아래 두 값을 교체하세요.
const SUPABASE_URL      = 'https://ikdlgnpjcmwbsrxvoxvd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZGxnbnBqY213YnNyeHZveHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMTA0MDYsImV4cCI6MjA4NzU4NjQwNn0.amIky4WslMDFBv30n9hcdJx-CWFBOdRvLR9rqwET-_o';
// ============================================================
// 상태
// ============================================================
let currentPage  = 'home';
let prevPage     = 'home';
let currentLang  = 'en';
let pendingLang  = null; // 저장 전 선택된 언어
let currentUser  = { licenseNum:'', nickname:'', email:'', phone:'', address:'', clinicName:'', doctorName:'' };
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
let forumPhotos       = [];
let currentForumPostId = null;
let events_      = [{id:1,date:'2026-03-15',event:'BIOPLANT Factory Tour',loc:'Bangkok'}];
let customOrders = [];
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
  document.getElementById('licenseInput').value = '';
  openModal('loginModal');
}
function openRegisterModal() {
  closeModal('loginModal');
  ['regLicense','regNickname','regName','regClinic','regEmail','regContact'].forEach(function(id){ document.getElementById(id).value=''; });
  openModal('registerModal');
}
async function submitRegistration() {
  var lic      = document.getElementById('regLicense').value.trim();
  var nickname = document.getElementById('regNickname').value.trim();
  var name     = document.getElementById('regName').value.trim();
  var clinic   = document.getElementById('regClinic').value.trim();
  var email    = document.getElementById('regEmail').value.trim();
  var contact  = document.getElementById('regContact').value.trim();
  if (!lic || !nickname || !name || !clinic || !email || !contact) {
    alert('모든 항목을 입력해 주세요.'); return;
  }
  var btn = document.getElementById('regSubmitBtn');
  btn.disabled = true;
  btn.textContent = t('reg_submitting');
  try {
    var res = await fetch(SUPABASE_URL + '/rest/v1/licenses', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ license_number:lic, doctor_name:name, clinic_name:clinic, contact:contact, nickname:nickname, email:email, is_active:false }),
    });
    btn.disabled = false;
    btn.textContent = t('reg_submit');
    if (res.status === 409) { alert(t('reg_duplicate')); return; }
    if (!res.ok) { alert(t('reg_network_error')); return; }
    // 로컬에 프로필 저장 (닉네임·이메일·연락처·치과이름)
    var profile = { nickname:nickname, email:email, phone:contact, address:'', clinicName:clinic, doctorName:name };
    localStorage.setItem('dentalk_profile_' + lic, JSON.stringify(profile));
    alert('신청이 완료되었습니다! 관리자 승인 후 로그인 가능합니다.');
    closeModal('registerModal');
  } catch(e) {
    btn.disabled = false;
    btn.textContent = t('reg_submit');
    alert(t('reg_network_error'));
  }
}
// ── Supabase 면허 검증 함수 ─────────────────────────────────────
async function verifyLicense(licNum) {
  try {
    const url = SUPABASE_URL + '/rest/v1/licenses'
      + '?license_number=eq.' + encodeURIComponent(licNum)
      + '&is_active=eq.true'
      + '&select=doctor_name,clinic_name,nickname,email,phone,address';
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      }
    });
    if (!res.ok) return { ok: false, reason: 'network' };
    const data = await res.json();
    if (!data.length) return { ok: false, reason: 'not_found' };
    return {
      ok: true,
      doctorName: data[0].doctor_name || '',
      clinicName: data[0].clinic_name || '',
      nickname:   data[0].nickname    || '',
      email:      data[0].email       || '',
      phone:      data[0].phone       || '',
      address:    data[0].address     || '',
    };
  } catch (e) {
    return { ok: false, reason: 'network' };
  }
}
async function handleLogin() {
  const lic = document.getElementById('licenseInput').value.trim();
  if (lic.length < 3) { alert(t('login_error')); return; }
  // 로딩 상태
  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.textContent = t('login_verifying');
  const result = await verifyLicense(lic);
  btn.disabled = false;
  btn.textContent = t('login_btn');
  if (!result.ok) {
    alert(result.reason === 'network' ? t('login_network_error') : t('login_not_found'));
    return;
  }
  // 로그인 성공 — Supabase 데이터 우선, localStorage 폴백
  var profileStr = localStorage.getItem('dentalk_profile_' + lic);
  var local      = profileStr ? JSON.parse(profileStr) : {};
  currentUser = {
    licenseNum: lic,
    nickname:   result.nickname   || local.nickname   || result.doctorName || lic,
    email:      result.email      || local.email      || '',
    phone:      result.phone      || local.phone      || '',
    address:    result.address    || local.address    || '',
    clinicName: result.clinicName || local.clinicName || '',
    doctorName: result.doctorName || '',
  };
  // Supabase에서 받은 최신 데이터를 localStorage에도 동기화
  var sync = { nickname:currentUser.nickname, email:currentUser.email, phone:currentUser.phone, address:currentUser.address, clinicName:currentUser.clinicName, doctorName:currentUser.doctorName };
  localStorage.setItem('dentalk_profile_' + lic, JSON.stringify(sync));
  sessionEnd = Date.now() + 30*60*1000;
  extShown   = false;
  document.getElementById('licenseDisplay').textContent = currentUser.nickname;
  var sideNick = document.getElementById('sideNickname');
  if (sideNick) sideNick.textContent = currentUser.nickname;
  document.getElementById('sideLoginArea').classList.add('hidden');
  document.getElementById('sideLoggedArea').classList.remove('hidden');
  document.getElementById('timerWrap').classList.remove('hidden');
  // 게시판 닉네임 표시 업데이트
  updateNicknameDisplays();
  // 프로필 정보 렌더링
  renderProfileSettings();
  if (sessionTimer) clearInterval(sessionTimer);
  sessionTimer = setInterval(tickSession, 1000);
  tickSession();
  closeModal('loginModal');
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
  closeModal('extendModal');
}
function forceLogout() {
  clearInterval(sessionTimer); sessionTimer=null; sessionEnd=null; extShown=false;
  currentUser = { licenseNum:'', nickname:'', email:'', phone:'', address:'', clinicName:'', doctorName:'' };
  document.getElementById('sideLoginArea').classList.remove('hidden');
  document.getElementById('sideLoggedArea').classList.add('hidden');
  document.getElementById('timerWrap').classList.add('hidden');
  renderProfileSettings();
  updateNicknameDisplays();
  if (LOCKED.includes(currentPage)) goPage('home');
  alert(t('session_expired'));
}
function doLogout() {
  clearInterval(sessionTimer); sessionTimer=null; sessionEnd=null; extShown=false;
  currentUser = { licenseNum:'', nickname:'', email:'', phone:'', address:'', clinicName:'', doctorName:'' };
  cart=[]; updateBadge();
  document.getElementById('sideLoginArea').classList.remove('hidden');
  document.getElementById('sideLoggedArea').classList.add('hidden');
  document.getElementById('timerWrap').classList.add('hidden');
  document.getElementById('licenseDisplay').textContent = '-';
  renderProfileSettings();
  updateNicknameDisplays();
  if (LOCKED.includes(currentPage)) goPage('home');
  closeMenu();
}
// ============================================================
// 메뉴 & 페이지 전환
// ============================================================
let menuOpen = false;
function toggleMenu() { menuOpen ? closeMenu() : openMenu(); }
function openMenu() {
  menuOpen = true;
  document.getElementById('sideMenu').classList.add('open');
  document.getElementById('sideOverlay').classList.add('open');
  document.getElementById('hb1').style.cssText = 'transform:translateY(8px) rotate(45deg)';
  document.getElementById('hb2').style.cssText = 'opacity:0';
  document.getElementById('hb3').style.cssText = 'transform:translateY(-8px) rotate(-45deg)';
}
function closeMenu() {
  menuOpen = false;
  document.getElementById('sideMenu').classList.remove('open');
  document.getElementById('sideOverlay').classList.remove('open');
  document.getElementById('hb1').style.cssText = '';
  document.getElementById('hb2').style.cssText = '';
  document.getElementById('hb3').style.cssText = '';
}
function goPage(id) {
  if (LOCKED.includes(id) && !isLoggedIn()) { closeMenu(); openLoginModal(id); return; }
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.menu-btn').forEach(function(b){ b.classList.remove('active'); });
  document.getElementById('page-' + id).classList.add('active');
  var mb = document.getElementById('mb-' + id);
  if (mb) mb.classList.add('active');
  document.getElementById('pageTitle').textContent = t('pt_' + id);
  currentPage = id;
  var btnBack = document.getElementById('btnBack');
  var btnMenu = document.getElementById('btnMenu');
  if (btnBack) { btnBack.classList.add('hidden'); btnBack.classList.remove('flex'); }
  if (btnMenu) btnMenu.classList.remove('hidden');
  closeMenu();
  window.scrollTo(0, 0);
  if (id === 'shop')     renderShop();
  if (id === 'used')     renderUsed();
  if (id === 'forum')  { renderForum(); updateNicknameDisplays(); }
  if (id === 'events')   renderEvents();
  if (id === 'custom')   { customTab('form'); resetCustomForm(); }
  if (id === 'settings') renderProfileSettings();
}
function goDetailPage(pageId, title, fromPage) {
  prevPage = fromPage || currentPage;
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.menu-btn').forEach(function(b){ b.classList.remove('active'); });
  document.getElementById('page-' + pageId).classList.add('active');
  document.getElementById('pageTitle').textContent = title;
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
  {id:'ScanBodyIntraOral',title:'Scan Body (Intra-Oral)',subtitle:'Healing type · Special coating',price:3500,tableType:'dh',connections:[{label:'Ø4.0',type:'N'},{label:'Ø4.0',type:'R'},{label:'Ø5.0',type:'R'},{label:'Ø6.0',type:'R'}],heights:['5','7','9'],codes:[['HSAM4005S','HSAM4007S','HSAM4009S'],['HSAR4005S','HSAR4007S','HSAR4009S'],['HSAR5005S','HSAR5007S','HSAR5009S'],['HSAR6005S','HSAR6007S','HSAR6009S']]},
  {id:'ScanBodyModel',title:'Scan Body (Model)',subtitle:'Stone model scanbody',price:3500,tableType:'dh',connections:[{label:'Ø4.0',type:'N'},{label:'Ø4.0',type:'R'},{label:'Ø5.0',type:'R'},{label:'Ø6.0',type:'R'}],heights:['5','7','9'],codes:[['SMAM4005S','SMAM4007S','SMAM4009S'],['SMAR4005S','SMAR4007S','SMAR4009S'],['SMAR5005S','SMAR5007S','SMAR5009S'],['SMAR6005S','SMAR6007S','SMAR6009S']]},
  {id:'GeoMediIntraOral',title:'Scan Body (GeoMedi Intra-Oral)',subtitle:'Ti-6Al-4V ELI · Short 7.5mm / Long 11.5mm',price:4000,tableType:'simple',rows:[{label:'N',type:'N',items:[{code:'GMS-ASRS',size:'Short 7.5mm'},{code:'GMS-ASRL',size:'Long 11.5mm'}]},{label:'R',type:'R',items:[{code:'GMS-SUROS',size:'Short 7.5mm'},{code:'GMS-SUROL',size:'Long 11.5mm'}]}]},
  {id:'GeoMediModel',title:'Scan Body (GeoMedi Model)',subtitle:'Teflon-coating · Semipermanent',price:4000,tableType:'simple',rows:[{label:'N',type:'N',items:[{code:'SC-ASR',size:'Standard'}]},{label:'R',type:'R',items:[{code:'SC-SURO',size:'Standard'}]}]},
  {id:'QBase',title:'Q-Base (Zirconia Abutment)',subtitle:'H=7mm · 3° taper',price:4500,tableType:'dh',connections:[{label:'Ø4.4',type:'N'},{label:'Ø5.5',type:'R'}],heights:['C1','C3','C5'],codes:[['QBAM4401S','QBAM4403S','QBAM4405S'],['QBAR5501S','QBAR5503S','QBAR5505S']]},
  {id:'ReadyMade30',title:'Ready Made Abutment (Ø3.0 N)',subtitle:'Dual purpose · Torque 20N',price:5000,tableType2:'hxc',colLabels:['C1','C2','C3','C4'],rowLabels:['H 4.0','H 5.5','H 7.0'],codeMatrix:[['SAAT 30514 MSA','SAAT 30524 MSA','SAAT 30534 MSA','SAAT 30544 MSA'],['SAAT 30515 MSA','SAAT 30525 MSA','SAAT 30535 MSA','SAAT 30545 MSA'],['SAAT 30517 MSA','SAAT 30527 MSA','SAAT 30537 MSA','SAAT 30547 MSA']]},
  {id:'ReadyMade45',title:'Ready Made Abutment (Ø4.5 R)',subtitle:'Dual purpose · Torque 30N',price:5000,tableType2:'hxc',colLabels:['C1','C2','C3','C4','C5','C6'],rowLabels:['H 4.0','H 5.5','H 7.0'],codeMatrix:[['SAAT 45514 SA','SAAT 45524 SA','SAAT 45534 SA','SAAT 45544 SA','',''],['SAAT 45515 SA','SAAT 45525 SA','SAAT 45535 SA','SAAT 45545 SA','SAAT 45555 SA','SAAT 45565 SA'],['SAAT 45517 SA','SAAT 45527 SA','SAAT 45537 SA','SAAT 45547 SA','SAAT 45557 SA','SAAT 45567 SA']]},
  {id:'ReadyMade55',title:'Ready Made Abutment (Ø5.5 R)',subtitle:'Dual purpose · Torque 30N',price:5000,tableType2:'hxc',colLabels:['C1','C2','C3','C4','C5','C6'],rowLabels:['H 4.0','H 5.5','H 7.0'],codeMatrix:[['SAAT 55614 SA','SAAT 55624 SA','SAAT 55634 SA','SAAT 55644 SA','',''],['SAAT 55615 SA','SAAT 55625 SA','SAAT 55635 SA','SAAT 55645 SA','SAAT 55655 SA','SAAT 55665 SA'],['SAAT 55617 SA','SAAT 55627 SA','SAAT 55637 SA','SAAT 55647 SA','SAAT 55657 SA','SAAT 55667 SA']]},
  {id:'ReadyMade65',title:'Ready Made Abutment (Ø6.5 R)',subtitle:'Dual purpose · Torque 30N',price:5000,tableType2:'hxc',colLabels:['C1','C2','C3','C4','C5','C6'],rowLabels:['H 4.0','H 5.5','H 7.0'],codeMatrix:[['SAAT 65714 SA','SAAT 65724 SA','SAAT 65734 SA','SAAT 65744 SA','',''],['SAAT 65715 SA','SAAT 65725 SA','SAAT 65735 SA','SAAT 65745 SA','SAAT 65755 SA','SAAT 65765 SA'],['SAAT 65717 SA','SAAT 65727 SA','SAAT 65737 SA','SAAT 65747 SA','SAAT 65757 SA','SAAT 65767 SA']]},
  {id:'TiBase',title:'Ti-base Abutment',subtitle:'Ti+Zr CAD/CAM · H=4mm',price:3800,tableType:'simple',rows:[{label:'Ø4.0',type:'N',items:[{code:'Tibs-011 MSA',size:'H=4mm'}]},{label:'Ø4.5',type:'R',items:[{code:'Tibs-012 SA',size:'H=4mm'}]}]},
  {id:'PreMilledN10',title:'Pre-Milled Abutment (N · H10)',subtitle:'Milling compatible · Torque 20N',price:6000,tableType:'simple',rows:[{label:'AM',type:'N',items:[{code:'PLAM10H AM',size:'Hex'},{code:'PLAM10N AM',size:'NonHex'}]},{label:'VH',type:'N',items:[{code:'PLAM10H VH',size:'Hex'},{code:'PLAM10N VH',size:'NonHex'}]},{label:'RD',type:'N',items:[{code:'PLAM10H RD',size:'Hex'},{code:'PLAM10N RD',size:'NonHex'}]},{label:'II',type:'N',items:[{code:'PLAM10H II',size:'Hex'},{code:'PLAM10N II',size:'NonHex'}]}]},
  {id:'PreMilledR10',title:'Pre-Milled Abutment (R · H10)',subtitle:'Milling compatible · Torque 30N',price:6000,tableType:'simple',rows:[{label:'AM',type:'R',items:[{code:'PLAR10H AM',size:'Hex'},{code:'PLAR10N AM',size:'NonHex'}]},{label:'VH',type:'R',items:[{code:'PLAR10H VH',size:'Hex'},{code:'PLAR10N VH',size:'NonHex'}]},{label:'RD',type:'R',items:[{code:'PLAR10H RD',size:'Hex'},{code:'PLAR10N RD',size:'NonHex'}]},{label:'II',type:'R',items:[{code:'PLAR10H II',size:'Hex'},{code:'PLAR10N II',size:'NonHex'}]}]},
  {id:'MultiUnit',title:'Multi Unit (All-on-X)',subtitle:'Multi Abutment / Scan-Body / Ti-base',price:5500,tableType:'simple',rows:[{label:'Multi Abutment',type:'N',items:[{code:'DBTS MUA',size:'D Ø4.8'}]},{label:'Multi Scan-Body',type:'N',items:[{code:'AMSB48',size:'N+R'}]},{label:'3D LAB Analog N',type:'N',items:[{code:'DLAAF3415S',size:'Narrow'}]},{label:'3D LAB Analog R',type:'R',items:[{code:'DLAAF4015S',size:'Regular'}]}]},
  {id:'GeoMedi3DAnalog',title:'3D-Analog (GeoMedi)',subtitle:'Stone & 3D printed model',price:3200,tableType:'simple',rows:[{label:'N',type:'N',items:[{code:'3D-ASR',size:'Standard'}]},{label:'R',type:'R',items:[{code:'3D-SURO',size:'Standard'}]}]},
];
// ============================================================
// SHOP
// ============================================================
function renderShop() {
  document.getElementById('shopList').innerHTML = PRODUCTS.map(function(p) {
    return '<div onclick="openOrder(\'' + p.id + '\')" class="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-center cursor-pointer border border-transparent active:border-blue-200 active:scale-[.98] transition">' +
      '<div class="flex-1 pr-3"><h3 class="font-black text-slate-800 text-sm leading-tight">' + p.title + '</h3><p class="text-[9px] text-slate-400 font-bold uppercase mt-1 leading-tight">' + p.subtitle + '</p></div>' +
      '<div class="text-right shrink-0"><p class="font-black text-blue-700 text-xs font-mono">' + p.price.toLocaleString() + ' THB</p><p class="text-[10px] text-blue-500 font-black mt-1">' + t('shop_select') + '</p></div>' +
    '</div>';
  }).join('');
}
function openOrder(pid) {
  currentProd = PRODUCTS.find(function(p){ return p.id === pid; });
  if (!currentProd) return;
  tableQtys   = {};
  document.getElementById('orderModalTitle').textContent = currentProd.title;
  document.getElementById('orderModalDesc').textContent  = currentProd.subtitle;
  document.getElementById('orderError').classList.add('hidden');
  renderOrderTable();
  openModal('orderModal');
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
          ? '<td class="py-3 px-1"><div class="flex flex-col items-center gap-1"><span class="text-[8px] text-slate-400 font-mono text-center leading-tight">' + code + '</span><input type="number" min="0" value="0" class="qty-input" oninput="tableQtys[\'' + code + '\']=parseInt(this.value)||0"></div></td>'
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
        html += '<td class="py-3 px-1"><div class="flex flex-col items-center gap-1"><span class="text-[8px] text-slate-400 font-mono text-center">' + code + '</span><input type="number" min="0" value="0" class="qty-input" oninput="tableQtys[\'' + code + '\']=parseInt(this.value)||0"></div></td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
  } else {
    html = '<div class="space-y-2">';
    p.rows.forEach(function(row) {
      row.items.forEach(function(item) {
        html += '<div class="bg-slate-50 rounded-2xl p-4 flex justify-between items-center">' +
          '<div class="flex-1"><div class="flex items-center gap-2 mb-1"><span class="text-[9px] font-black px-1.5 py-0.5 rounded-md tag-' + row.type + '">' + row.type + '</span><span class="font-black text-xs text-slate-700">' + row.label + '</span><span class="text-[9px] text-slate-400 font-bold">' + item.size + '</span></div><p class="text-[9px] text-slate-500 font-mono font-bold">' + item.code + '</p></div>' +
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
function updateBadge() {
  var tot = cart.reduce(function(s,c){ return s+c.qty; }, 0);
  var b = document.getElementById('cartBadge');
  b.textContent = tot;
  b.classList.toggle('hidden', tot===0);
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
function openAddressForm() { closeModal('cartModal'); openModal('addressModal'); }
async function requestPay() {
  var clinic=document.getElementById('clinicName').value.trim();
  var phone=document.getElementById('clinicPhone').value.trim();
  var addr=document.getElementById('fullAddress').value.trim();
  if (!clinic||!phone||!addr) { alert(t('addr_fill_error')); return; }
  var amt = cart.reduce(function(s,c){ return s+c.price*c.qty; },0);
  var qrUrl;
  try {
    var res = await fetch('http://localhost:3000/pay',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cart,address:clinic,phone,detailAddress:addr})});
    qrUrl = (await res.json()).qr_image;
  } catch(e) {
    qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DENTALK_' + Date.now() + '_' + amt + 'THB';
  }
  document.getElementById('qrSummary').innerHTML =
    '<p class="font-black text-slate-500 uppercase text-[9px] mb-2">' + t('qr_summary_title') + '</p>' +
    cart.map(function(c){ return '<div class="flex justify-between gap-2 text-[10px]"><span class="flex-1">' + c.name + '</span><span class="font-mono text-slate-500">' + c.code + '</span><span class="font-black ml-1">×' + c.qty + '</span><span class="font-mono font-black ml-1">' + (c.price*c.qty).toLocaleString() + '</span></div>'; }).join('') +
    '<div class="border-t mt-2 pt-2 flex justify-between font-black text-slate-800"><span>' + t('qr_total') + '</span><span class="font-mono">' + amt.toLocaleString() + ' THB</span></div>';
  document.getElementById('qrImg').src = qrUrl;
  closeModal('addressModal'); openModal('qrModal');
}
function completePayment() { cart=[]; updateBadge(); closeModal('qrModal'); goPage('shop'); }
// ============================================================
// CUSTOM ABUTMENT
// ============================================================
function customTab(tab) {
  var isForm = tab==='form';
  document.getElementById('custom-form').classList.toggle('hidden', !isForm);
  document.getElementById('custom-list').classList.toggle('hidden', isForm);
  var fCls = isForm ? 'flex-1 py-3 rounded-2xl font-black text-sm bg-[#001d4a] text-white shadow' : 'flex-1 py-3 rounded-2xl font-black text-sm bg-slate-200 text-slate-500';
  var lCls = !isForm ? 'flex-1 py-3 rounded-2xl font-black text-sm bg-[#001d4a] text-white shadow' : 'flex-1 py-3 rounded-2xl font-black text-sm bg-slate-200 text-slate-500';
  var fBtn = document.getElementById('ctab-form');
  var lBtn = document.getElementById('ctab-list');
  fBtn.className = fCls; fBtn.textContent = t('custom_tab_new');
  lBtn.className = lCls; lBtn.textContent = t('custom_tab_list');
  if (!isForm) renderCustomOrders();
}
function resetCustomForm() {
  caseCount = 0;
  caseTeeth = {};
  document.getElementById('caseList').innerHTML = '';
  addCase();
  ['cust-clinic','cust-addr','cust-phone','cust-line'].forEach(function(id){ document.getElementById(id).value=''; });
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
    '<input type="text" id="cp-' + id + '" placeholder="' + t('case_patient_ph') + '" class="w-full p-3 bg-white rounded-xl text-sm font-bold outline-none mb-3 border border-slate-100">' +
    '<div class="mb-1"><p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">' + t('case_tooth_hint') + '</p>' + buildToothChart(id) + '</div>' +
    '<div id="teeth-details-' + id + '" class="space-y-2 mt-3 mb-3"></div>' +
    '<input type="date" id="cd-' + id + '" class="w-full p-3 bg-white rounded-xl text-sm font-bold outline-none border border-slate-100 mb-2">' +
    '<div id="stl-drop-' + id + '" onclick="document.getElementById(\'stl-' + id + '\').click()" class="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center mb-2 cursor-pointer bg-white">' +
      '<p class="text-2xl mb-1">📁</p><p class="text-xs font-black text-slate-500">' + t('stl_label') + '</p><p class="text-[9px] text-slate-400 mt-0.5">' + t('stl_hint') + '</p>' +
    '</div>' +
    '<input type="file" id="stl-' + id + '" accept=".stl,.STL" class="hidden" onchange="onStl(' + id + ',this)">' +
    '<textarea id="cm-' + id + '" rows="2" placeholder="' + t('memo_ph') + '" class="w-full p-3 bg-white rounded-xl text-sm outline-none resize-none border border-slate-100"></textarea>';
  document.getElementById('caseList').appendChild(div);
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
function onStl(id, input) {
  var f = input.files[0]; if(!f) return;
  var d = document.getElementById('stl-drop-'+id);
  d.innerHTML = '<p class="text-2xl mb-1">✅</p><p class="text-xs font-black text-green-600">' + f.name + '</p><p class="text-[9px] text-slate-400">' + (f.size/1024).toFixed(1) + ' KB</p>';
  d.className = 'border-2 border-green-200 rounded-xl p-4 text-center mb-2 bg-green-50';
}
function submitCustom() {
  var clinic = document.getElementById('cust-clinic').value.trim();
  var addr   = document.getElementById('cust-addr').value.trim();
  var phone  = document.getElementById('cust-phone').value.trim();
  var lineId = document.getElementById('cust-line').value.trim();
  if (!clinic||!addr||!phone) { alert(t('err_fill_delivery')); return; }
  var cases = [];
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
    var stlFile = document.getElementById('stl-'+i).files[0];
    cases.push({
      patient:  document.getElementById('cp-'+i).value.trim() || t('anon_patient'),
      teeth:    teethData,
      deadline: document.getElementById('cd-'+i).value,
      memo:     document.getElementById('cm-'+i).value.trim(),
      stl:      stlFile ? stlFile.name : null,
    });
  }
  if (!cases.length) { alert(t('err_add_case')); return; }
  var totalTeeth = cases.reduce(function(s,c){ return s+c.teeth.length; },0);
  var oid = 'CA-' + Date.now().toString().slice(-6);
  var order = { id:oid, clinic:clinic, addr:addr, phone:phone, lineId:lineId, cases:cases, stage:'received', date:new Date().toLocaleDateString() };
  customOrders.unshift(order);
  sendLine(order, 'received');
  var msg = tf('order_success_msg', oid, cases.length, totalTeeth);
  if (lineId) msg += t('order_success_line');
  alert(msg);
  customTab('list');
}
function renderCustomOrders() {
  var c = document.getElementById('customOrdersContainer');
  if (!customOrders.length) { c.innerHTML = '<div class="text-center text-slate-400 font-bold text-sm py-10">' + t('custom_empty') + '</div>'; return; }
  c.innerHTML = customOrders.map(function(o) {
    var si = ORDER_STAGES.findIndex(function(s){ return s.key===o.stage; });
    var st = ORDER_STAGES[si];
    var bars = ORDER_STAGES.map(function(s,i){
      var cls = i<si ? 'stage-done' : i===si ? 'stage-current' : 'stage-todo';
      return '<div class="flex-1 flex flex-col items-center gap-1"><div class="w-full h-1.5 rounded-full ' + cls + '"></div><span class="text-[7px] font-bold text-center leading-tight">' + s.icon + '</span></div>';
    }).join('');
    var totalTeeth = o.cases.reduce(function(s,cs){ return s+(cs.teeth?cs.teeth.length:0); },0);
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
        (cs.stl ? '<p class="text-[9px] text-green-500 font-bold mt-1">📎 ' + cs.stl + '</p>' : '') +
        (cs.deadline ? '<p class="text-[9px] text-slate-400 font-bold mt-1">📅 ' + cs.deadline + '</p>' : '') +
      '</div>';
    }).join('');
    var detailHeader = t('case_detail') + ' (' + o.cases.length + t('cases_unit') + ' · ' + t('teeth_total_prefix') + totalTeeth + t('teeth_count') + ')';
    return '<div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">' +
      '<div class="bg-[#001d4a] px-5 py-4 flex justify-between items-center">' +
        '<div><p class="font-black text-white text-sm">' + o.clinic + '</p><p class="text-blue-300 text-[9px] font-bold font-mono mt-0.5">' + o.id + ' · ' + o.date + '</p></div>' +
        '<div class="text-right"><span class="text-xl">' + st.icon + '</span><p class="text-blue-300 text-[9px] font-bold mt-0.5">' + totalTeeth + t('teeth_count') + '</p></div>' +
      '</div>' +
      '<div class="px-5 py-4"><p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">' + t('status_label') + '</p>' +
        '<div class="flex gap-1 mb-2">' + bars + '</div>' +
        '<p class="text-center font-black text-sm text-blue-700">' + st.icon + ' ' + t('stage_' + st.key) + '</p>' +
      '</div>' +
      '<div class="px-5 pb-5 border-t border-slate-50 pt-4">' +
        '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">' + detailHeader + '</p>' +
        caseRows +
      '</div>' +
      '<div class="px-5 pb-4 text-[9px] text-slate-400 font-bold space-y-0.5 border-t border-slate-50 pt-3">' +
        '<p>📍 ' + o.addr + '</p><p>📞 ' + o.phone + '</p>' +
      '</div></div>';
  }).join('');
}
async function sendLine(order, stageKey) {
  if (!LINE_TOKEN || LINE_TOKEN==='YOUR_LINE_NOTIFY_TOKEN') return;
  var st = ORDER_STAGES.find(function(s){ return s.key===stageKey; });
  var totalTeeth = order.cases.reduce(function(s,cs){ return s+(cs.teeth?cs.teeth.length:0); },0);
  var msg = '\n[Dentalk Custom] ' + st.icon + ' ' + t('stage_' + st.key) + '\n' + order.id + '\n' + order.clinic + '\n' + order.cases.length + ' / ' + totalTeeth + '\n' + order.phone;
  try { await fetch('https://notify-api.line.me/api/notify',{method:'POST',headers:{'Authorization':'Bearer '+LINE_TOKEN,'Content-Type':'application/x-www-form-urlencoded'},body:'message='+encodeURIComponent(msg)}); }
  catch(e) {}
}
// ============================================================
// USED MARKET
// ============================================================
function renderUsed() {
  var list = document.getElementById('usedList');
  if (!usedItems.length) { list.innerHTML='<div class="text-center text-slate-400 font-bold text-sm py-10">' + t('used_empty') + '</div>'; return; }
  var condMap   = {new:'bg-green-100 text-green-700',good:'bg-blue-100 text-blue-700',fair:'bg-yellow-100 text-yellow-700'};
  var condLabel = {new:t('cond_new'),good:t('cond_good'),fair:t('cond_fair')};
  list.innerHTML = usedItems.map(function(item,i){
    var thumb = item.image
      ? '<img src="' + item.image + '" class="w-full h-full object-contain">'
      : '<div class="w-full h-full flex items-center justify-center"><span class="text-slate-300 text-xl">📷</span></div>';
    var badge = '<span class="inline-block text-[7px] font-bold px-1 py-0.5 rounded-full ' + condMap[item.cond] + '">' + condLabel[item.cond] + '</span>';
    return '<div class="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer active:scale-95 transition flex flex-col" onclick="openUsedDetail(' + item.id + ')">' +
      '<div class="aspect-square bg-slate-50 overflow-hidden">' + thumb + '</div>' +
      '<div class="p-1.5 flex flex-col gap-0.5">' +
        badge +
        '<p class="font-bold text-slate-800 text-[11px] leading-snug line-clamp-2">' + item.name + '</p>' +
        '<p class="font-black text-blue-700 text-xs">' + item.price.toLocaleString() + ' <span class="text-[9px] font-normal text-slate-500">THB</span></p>' +
        '<p class="text-[9px] text-slate-400">' + item.date + '</p>' +
      '</div>' +
    '</div>';
  }).join('');
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
    usedItems.unshift({id:Date.now(),name:name,code:document.getElementById('u-code').value.trim()||'-',price:price,cond:document.getElementById('u-cond').value,desc:document.getElementById('u-desc').value.trim()||'-',contact:contact,seller:'Me',date:new Date().toISOString().slice(0,10),views:0,image:imgData||null});
    ['u-name','u-code','u-price','u-desc','u-contact'].forEach(function(id){ document.getElementById(id).value=''; });
    document.getElementById('u-photo').value = '';
    document.getElementById('u-photo-preview').innerHTML = '<span class="text-3xl mb-1">📷</span><span class="text-xs font-bold">Add Photo</span>';
    renderUsed();
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
function deleteUsed(i) { usedItems.splice(i,1); renderUsed(); }
function showContact(c) { document.getElementById('usedContactText').textContent=c; openModal('usedContactModal'); }
function openUsedDetail(id) {
  var item = usedItems.find(function(x){ return x.id===id; });
  if (!item) return;
  item.views = (item.views||0) + 1;
  renderUsed();
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
  document.getElementById('udp-deleteBtn').onclick  = function(){
    var idx = usedItems.findIndex(function(x){ return x.id===id; });
    if (idx !== -1) usedItems.splice(idx, 1);
    goBack();
  };
  var imgWrap = document.getElementById('udp-imageWrap');
  var imgEl   = document.getElementById('udp-image');
  if (item.image) { imgEl.src = item.image; imgWrap.classList.remove('hidden'); }
  else { imgWrap.classList.add('hidden'); imgEl.src = ''; }
  goDetailPage('used-detail', item.name, 'used');
}
function openForumDetail(id) {
  var post = posts.find(function(x){ return x.id===id; });
  if (!post) return;
  post.views = (post.views||0) + 1;
  currentForumPostId = id;
  renderForum();
  // 카테고리 뱃지
  document.getElementById('fdp-catBadge').textContent = post.category === 'implant' ? '🦷 임플란트' : '💎 보철';
  document.getElementById('fdp-title').textContent  = post.title;
  document.getElementById('fdp-body').textContent   = post.body;
  document.getElementById('fdp-author').textContent = post.author + ' · ' + (post.date||'');
  document.getElementById('fdp-views').textContent  = post.views;
  // 사진 갤러리
  var photosWrap = document.getElementById('fdp-photos');
  if (post.images && post.images.length) {
    photosWrap.classList.remove('hidden');
    photosWrap.innerHTML = post.images.map(function(src){
      return '<img src="' + src + '" style="display:inline-block;height:180px;border-radius:12px;object-fit:contain;flex-shrink:0">';
    }).join('');
  } else {
    photosWrap.classList.add('hidden');
    photosWrap.innerHTML = '';
  }
  // 댓글
  renderComments(post);
  goDetailPage('forum-detail', post.title, 'forum');
}
// ============================================================
// FORUM
// ============================================================
function forumTab(cat) {
  forumCategory = cat;
  renderForum();
}
function renderForum() {
  var implantBtn    = document.getElementById('ftab-implant');
  var prostheticBtn = document.getElementById('ftab-prosthetic');
  if (implantBtn && prostheticBtn) {
    implantBtn.className    = 'flex-1 py-3 rounded-2xl font-black text-sm shadow ' + (forumCategory === 'implant'    ? 'bg-[#001d4a] text-white' : 'bg-slate-200 text-slate-500');
    prostheticBtn.className = 'flex-1 py-3 rounded-2xl font-black text-sm shadow ' + (forumCategory === 'prosthetic' ? 'bg-[#001d4a] text-white' : 'bg-slate-200 text-slate-500');
  }
  var filtered = posts.filter(function(p){ return p.category === forumCategory; });
  document.getElementById('postList').innerHTML = filtered.length ? filtered.map(function(p){
    var thumb = (p.images && p.images.length) ? '<img src="' + p.images[0] + '" class="w-14 h-14 rounded-xl object-cover shrink-0">' : '';
    return '<div class="bg-white p-4 rounded-2xl border shadow-sm cursor-pointer active:bg-slate-50 flex gap-3 items-start" onclick="openForumDetail(' + p.id + ')">' +
      thumb +
      '<div class="flex-1 min-w-0">' +
        '<p class="font-black text-slate-800 text-sm mb-0.5 leading-snug">' + p.title + '</p>' +
        '<p class="text-xs text-slate-500 leading-relaxed line-clamp-2">' + p.body + '</p>' +
        '<p class="text-[9px] text-slate-300 font-bold mt-2">' + p.author + ' · ' + (p.date||'') + ' · 👁 ' + (p.views||0) + ' · 💬 ' + (p.comments?p.comments.length:0) + '</p>' +
      '</div>' +
    '</div>';
  }).join('') : '<p class="text-center text-slate-400 text-sm py-10">게시물이 없습니다.</p>';
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
        preview.innerHTML = forumPhotos.filter(Boolean).map(function(src){
          return '<img src="' + src + '" class="w-16 h-16 rounded-xl object-cover">';
        }).join('');
      }
    };
    reader.readAsDataURL(file);
  });
}
function submitPost() {
  var tt = document.getElementById('postTitle').value.trim();
  var b  = document.getElementById('postBody').value.trim();
  if (!tt || !b) return;
  var auth  = currentUser.nickname || '익명';
  var today = new Date().toISOString().slice(0,10);
  posts.unshift({id:Date.now(), category:forumCategory, title:tt, body:b, author:auth, images:forumPhotos.filter(Boolean).slice(), comments:[], views:0, date:today});
  document.getElementById('postTitle').value  = '';
  document.getElementById('postBody').value   = '';
  document.getElementById('forumPhotoPreview').innerHTML = '';
  document.getElementById('forumPhotoPreview').classList.add('hidden');
  document.getElementById('forumPhotos').value = '';
  forumPhotos = [];
  renderForum();
}
function renderComments(post) {
  var el = document.getElementById('fdp-comments');
  if (!post.comments || !post.comments.length) {
    el.innerHTML = '<p class="text-xs text-slate-300 font-bold">아직 댓글이 없습니다.</p>';
    return;
  }
  el.innerHTML = post.comments.map(function(c){
    return '<div class="bg-slate-50 rounded-2xl p-3">' +
      '<p class="text-xs font-black text-slate-700 mb-1">' + c.author + ' <span class="text-slate-300 font-normal text-[10px]">' + c.date + '</span></p>' +
      '<p class="text-sm text-slate-600">' + c.text + '</p>' +
    '</div>';
  }).join('');
}
function submitComment() {
  var text = document.getElementById('commentInput').value.trim();
  if (!text) return;
  var post = posts.find(function(x){ return x.id===currentForumPostId; });
  if (!post) return;
  if (!post.comments) post.comments = [];
  var auth  = currentUser.nickname || '익명';
  var today = new Date().toISOString().slice(0,10);
  post.comments.push({author: auth, text: text, date: today});
  document.getElementById('commentInput').value = '';
  renderComments(post);
  renderForum();
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
  var el = document.getElementById('profileInfo');
  if (!el) return;
  if (!isLoggedIn() || !currentUser.nickname) {
    el.innerHTML = '<p class="text-sm text-slate-400 font-bold">로그인 후 확인 가능합니다.</p>';
    return;
  }
  var rows = [
    ['닉네임',  currentUser.nickname,  true],
    ['의사이름', currentUser.doctorName, true],
    ['이메일',  currentUser.email,     false],
    ['전화번호', currentUser.phone,     false],
    ['주소',    currentUser.address,   false],
    ['치과이름', currentUser.clinicName,false],
  ];
  el.innerHTML = '<div class="space-y-2">' +
    rows.map(function(r){
      var val = r[1] || '-';
      var readonly = r[2] ? ' <span class="text-[9px] text-slate-300 font-bold">(변경불가)</span>' : '';
      return '<div class="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">' +
        '<span class="text-xs text-slate-400 font-bold shrink-0 w-20">' + r[0] + readonly + '</span>' +
        '<span class="text-sm font-black text-slate-800 text-right ml-2 break-all">' + val + '</span>' +
      '</div>';
    }).join('') +
  '</div>';
}
function openProfileEdit() {
  if (!isLoggedIn()) { alert('로그인이 필요합니다.'); return; }
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
    await fetch(SUPABASE_URL + '/rest/v1/licenses?license_number=eq.' + encodeURIComponent(currentUser.licenseNum), {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        email:       currentUser.email,
        phone:       currentUser.phone,
        address:     currentUser.address,
        clinic_name: currentUser.clinicName
      })
    });
  } catch(e) { console.warn('Supabase PATCH 실패 (로컬에는 저장됨):', e); }
  closeModal('profileEditModal');
  renderProfileSettings();
  var msg = document.getElementById('profileSavedMsg');
  if (msg) { msg.classList.remove('hidden'); setTimeout(function(){ msg.classList.add('hidden'); }, 2500); }
}
// ============================================================
// EVENTS
// ============================================================
function renderEvents() {
  document.getElementById('eventList').innerHTML = events_.map(function(e){
    return '<div class="bg-white p-5 rounded-2xl border-l-8 border-blue-900 shadow-sm"><p class="text-xs font-black text-slate-400 font-mono uppercase">' + e.date + '</p><p class="font-black text-sm mt-1 text-slate-800">' + e.event + '</p><p class="text-xs text-slate-400 mt-1">📍 ' + e.loc + '</p></div>';
  }).join('');
}
// ============================================================
// SETTINGS - 언어 선택 (저장 전까지 pendingLang에 보관)
// ============================================================
function selectLang(lang) {
  pendingLang = lang;
  ['en','ko','zh','th'].forEach(function(l){
    var b = document.getElementById('lang-'+l);
    b.className = l===lang
      ? 'p-4 rounded-2xl font-black text-sm border-2 border-amber-500 bg-amber-50 text-amber-700'
      : 'p-4 rounded-2xl font-black text-sm border-2 border-transparent bg-slate-50 text-slate-600';
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
  ['en','ko','zh','th'].forEach(function(l){
    var b = document.getElementById('lang-'+l);
    b.className = l===currentLang
      ? 'p-4 rounded-2xl font-black text-sm border-2 border-blue-600 bg-blue-50 text-blue-700'
      : 'p-4 rounded-2xl font-black text-sm border-2 border-transparent bg-slate-50 text-slate-600';
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
  document.getElementById('pageTitle').textContent = t('pt_' + currentPage);
  // 커스텀 탭 버튼 텍스트 업데이트
  var fBtn = document.getElementById('ctab-form');
  var lBtn = document.getElementById('ctab-list');
  if (fBtn) fBtn.textContent = t('custom_tab_new');
  if (lBtn) lBtn.textContent = t('custom_tab_list');
  // 사이드 로그인 버튼
  var sideLoginTxt = document.getElementById('sideLoginTxt');
  if (sideLoginTxt) sideLoginTxt.textContent = t('side_login_btn');
  // 현재 페이지 동적 콘텐츠 재렌더링
  if (currentPage === 'shop')   renderShop();
  if (currentPage === 'used')   renderUsed();
  if (currentPage === 'forum')  renderForum();
  if (currentPage === 'events') renderEvents();
  if (currentPage === 'custom') renderCustomOrders();
  // 설정 저장 버튼 텍스트
  var saveBtn = document.getElementById('saveLangBtn');
  if (saveBtn) saveBtn.textContent = t('settings_save_btn');
  // 저장된 언어 버튼 스타일 반영
  ['en','ko','zh','th'].forEach(function(l){
    var b = document.getElementById('lang-'+l);
    if (!b) return;
    b.className = l===currentLang
      ? 'p-4 rounded-2xl font-black text-sm border-2 border-blue-600 bg-blue-50 text-blue-700'
      : 'p-4 rounded-2xl font-black text-sm border-2 border-transparent bg-slate-50 text-slate-600';
  });
}
// ============================================================
// 모달 유틸
// ============================================================
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
// ============================================================
// 초기화
// ============================================================
window.addEventListener('DOMContentLoaded', function() {
  var saved = localStorage.getItem('dentalk_lang') || 'en';
  currentLang = saved;
  pendingLang = null;
  document.getElementById('mb-home').classList.add('active');
  applyLang();
  renderUsed();
  renderForum();
  renderEvents();
});
