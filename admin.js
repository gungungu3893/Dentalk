// admin.js — 관리자 패널 + 리더 관리 + 통계
// ============================================================
// CNC CUSTOM — 관리자 & 고객 워크플로우
// ============================================================
var adminCurrentTab = 'orders';
var productPrices   = JSON.parse(localStorage.getItem('adminProductPrices') || '{}');
var productStock    = JSON.parse(localStorage.getItem('adminProductStock') || '{}');


function adminShowTab(tab) {
  adminCurrentTab = tab;
  ['orders','shopOrders','products','used','forum','users','jobs','webzine','events','ads','stats','feedback'].forEach(function(t) {
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
  else if (tab === 'stats')      renderAdminStats();
  else if (tab === 'feedback')   renderAdminFeedback();
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
    // HTTP error on full save, retry without large data
    // ② 용량 문제(413)이면 대용량 base64 제거 후 재시도
    var res2 = await sbSaveCustomOrder(order, stripLargeBase64(order.cases));
    if (!res2.ok) {
      var err2 = await res2.text();
      console.error('[Order Save] Retry failed:', res2.status, err2);
    } else {
      // Saved without large STL data
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
  // lineId 없을 때 licenses 테이블에서 line_user_id 조회 후 발송
  if (!ord.lineId && ord.userNickname) {
    sendLinePushText(ord.userNickname, '🦷 คำสั่งซื้อ ' + ord.id + ' สถานะเปลี่ยนเป็น ยืนยันแล้ว\nYour order ' + ord.id + ' status changed to Confirmed.');
  }
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
  if (!note) { showToast('수정 요청사항을 입력해주세요.', 'warning'); return; }
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
  if (!carrier) { showToast('배송사를 선택해주세요.', 'warning'); return; }
  if (!trackingNumber) { showToast('송장번호를 입력해주세요.', 'warning'); return; }
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
  } catch(e) { handleSupabaseError(e, 'Summary Cards'); }
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
  list.innerHTML = dtLoaderHtml();
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
    // lineId 없을 때 licenses 테이블에서 line_user_id 조회 후 발송
    if (!ord.lineId && ord.userNickname) {
      sendLinePushText(ord.userNickname, '🦷 คำสั่งซื้อ ' + ord.id + ' สถานะเปลี่ยนเป็น ' + stageTh + '\nYour order ' + ord.id + ' status changed to ' + newStage + '.');
    }
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
      var creditDisplay = '<div class="flex items-center gap-2 mt-2">' +
        '<span class="text-[10px] font-black px-2 py-0.5 rounded-full" style="background:rgba(212,175,55,0.15);color:#001D4A">💰 ' + (u.credits || 0) + ' ' + t('credit_unit') + '</span>' +
        (!isAdminU ? '<button onclick="openCreditChargeModal(\'' + safeNick + '\',' + (u.credits||0) + ')" class="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#001D4A] active:scale-95 transition">' + t('credit_charge_btn') + '</button>' : '') +
      '</div>';
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
        badge + creditDisplay + leaderBadge + leaderCtrl +
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
    else showToast(t('admin_load_fail'), 'error');
  } catch(e) { handleSupabaseError(e, 'User Active State'); }
}
async function adminToggleUser(nickname, currentActive) {
  var newActive = !currentActive;
  if (!confirm(newActive ? nickname + ' 회원을 승인하시겠습니까?' : nickname + ' 회원을 차단하시겠습니까?')) return;
  try {
    var res = await authSetUserActive(nickname, newActive);
    if (res.ok) renderAdminUsers();
    else showToast(t('admin_load_fail'), 'error');
  } catch(e) { handleSupabaseError(e, 'Toggle User'); }
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
  if (!levelSel || !levelSel.value) { showToast(t('leader_select_level'), 'warning'); return; }
  if (!titleSel || !titleSel.value) { showToast(t('leader_select_title'), 'warning'); return; }
  var lv = levelSel.value;
  var title = titleSel.value;
  var region = '';
  if (lv === 'all') {
    region = 'all';
  } else if (lv === 'region') {
    var rSel = document.getElementById('leader-region-' + esc);
    if (!rSel || !rSel.value) { showToast(t('leader_select_region'), 'warning'); return; }
    region = rSel.value;
  } else if (lv === 'province') {
    var rSel2 = document.getElementById('leader-region-' + esc);
    var pSel = document.getElementById('leader-province-' + esc);
    if (!rSel2 || !rSel2.value) { showToast(t('leader_select_region'), 'warning'); return; }
    if (!pSel || !pSel.value) { showToast(t('leader_select_province'), 'warning'); return; }
    region = pSel.value;
  }
  // 점유 확인
  if (_isTitleOccupied(region, title, nickname)) {
    showToast(t('leader_title_occupied'), 'error'); return;
  }
  var lbl = _resolveLeaderLabel(region);
  var titleLabel = t(_titleKeyToLabelKey(title));
  if (!confirm(nickname + ' → ⭐ ' + lbl + ' · ' + titleLabel + '?')) return;
  try {
    var res = await authSetUserRole(nickname, 'region_leader', region, title);
    if (res.ok) { await _loadLeaderCache(); renderAdminUsers(); }
    else showToast(t('admin_error'), 'error');
  } catch(e) { handleSupabaseError(e, 'Set Leader'); }
}
async function adminRemoveLeader(nickname) {
  if (!confirm(nickname + ': ' + t('leader_remove') + '?')) return;
  try {
    var res = await authSetUserRole(nickname, 'user', null, null);
    if (res.ok) { await _loadLeaderCache(); renderAdminUsers(); }
    else showToast(t('admin_error'), 'error');
  } catch(e) { handleSupabaseError(e, 'Remove Leader'); }
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
  if (!date || !name || !loc) { showToast(t('admin_event_fill_alert'), 'warning'); return; }
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
// 관리자 통계 대시보드 (Chart.js)
// ============================================================
var _statsCharts = {};
var _statsPeriod = 30; // default: last 30 days

function statsSetPeriod(days) {
  _statsPeriod = days;
  renderAdminStats();
}

async function renderAdminStats() {
  var container = document.getElementById('adminTabStats');
  if (!container) return;
  container.innerHTML = '<p class="text-center text-slate-400 text-sm py-8 font-bold">' + t('admin_loading') + '</p>';

  // Destroy previous chart instances
  Object.keys(_statsCharts).forEach(function(k) { if (_statsCharts[k]) { _statsCharts[k].destroy(); delete _statsCharts[k]; } });

  // Each query is wrapped to return [] on failure so one broken table doesn't crash everything
  function safeFetch(promise, label) {
    return promise.then(function(data) {
      return Array.isArray(data) ? data : [];
    }).catch(function(e) {
      console.warn('[Stats:' + label + '] query failed, using empty data:', e.message || e);
      return [];
    });
  }

  try {
    var results = await Promise.all([
      safeFetch(sbGetOrderStats(), 'orders'),
      safeFetch(sbGetAllUsers(), 'users'),
      safeFetch(sbGetForumStats(), 'forum_posts'),
      safeFetch(sbGetForumCommentStats(), 'forum_comments'),
    ]);
    var allOrders = results[0];
    var allUsers  = results[1];
    var forumPosts = results[2];
    var forumComments = results[3];

    var now = new Date();
    var periodStart = new Date(now - _statsPeriod * 24*60*60*1000).toISOString().slice(0,10);
    var thisMonth = now.toISOString().slice(0,7);

    // ─── Summary calculations ──────────────────────────────
    var periodOrders = allOrders.filter(function(o){ return o.created_at && o.created_at.slice(0,10) >= periodStart; });
    var periodRevenue = 0;
    periodOrders.forEach(function(o) {
      if (o.items) o.items.forEach(function(i){ periodRevenue += (i.price||0)*(i.qty||1); });
    });
    var activeMembers = allUsers.filter(function(u){ return u.is_active === true; }).length;
    var totalMembers = allUsers.length;
    // Use active count if available, otherwise total count for display
    var displayMembers = activeMembers > 0 ? activeMembers : totalMembers;
    var periodSignups = allUsers.filter(function(u){ return u.created_at && u.created_at.slice(0,10) >= periodStart; }).length;
    var periodForumPosts = forumPosts.filter(function(p){ return p.created_at && p.created_at.slice(0,10) >= periodStart; }).length;

    // ─── Top 5 products ────────────────────────────────────
    var productCount = {};
    var productRevenue = {};
    allOrders.forEach(function(o) {
      if (o.items) o.items.forEach(function(item) {
        var key = item.name || item.code || 'Unknown';
        productCount[key] = (productCount[key] || 0) + (item.qty || 1);
        productRevenue[key] = (productRevenue[key] || 0) + (item.price||0) * (item.qty||1);
      });
    });
    var topProducts = Object.keys(productCount).map(function(k){ return { name:k, qty:productCount[k], revenue:productRevenue[k]||0 }; })
      .sort(function(a,b){ return b.qty - a.qty; }).slice(0,5);

    // ─── Category revenue (for pie chart) ──────────────────
    var catRevenue = {};
    allOrders.forEach(function(o) {
      if (o.items) o.items.forEach(function(item) {
        var cat = _guessCategoryFromName(item.name || item.code || '');
        catRevenue[cat] = (catRevenue[cat] || 0) + (item.price||0) * (item.qty||1);
      });
    });

    // ─── Daily/Weekly/Monthly grouping ─────────────────────
    var groupLabels = [], groupOrderCounts = [], groupRevenues = [];
    var groupSignups = [], groupForumActivity = [];
    if (_statsPeriod <= 14) {
      // Daily grouping
      for (var d = _statsPeriod - 1; d >= 0; d--) {
        var dt = new Date(now - d * 24*60*60*1000);
        var key = dt.toISOString().slice(0,10);
        var label = (dt.getMonth()+1) + '/' + dt.getDate();
        groupLabels.push(label);
        groupOrderCounts.push(allOrders.filter(function(o){ return o.created_at && o.created_at.slice(0,10) === key; }).length);
        var rev = 0;
        allOrders.filter(function(o){ return o.created_at && o.created_at.slice(0,10) === key; }).forEach(function(o){
          if(o.items) o.items.forEach(function(i){ rev += (i.price||0)*(i.qty||1); });
        });
        groupRevenues.push(rev);
        groupSignups.push(allUsers.filter(function(u){ return u.created_at && u.created_at.slice(0,10) === key; }).length);
        var fp = forumPosts.filter(function(p){ return p.created_at && p.created_at.slice(0,10) === key; }).length;
        var fc = forumComments.filter(function(c){ return c.created_at && c.created_at.slice(0,10) === key; }).length;
        groupForumActivity.push(fp + fc);
      }
    } else if (_statsPeriod <= 60) {
      // Weekly grouping
      var weeks = Math.ceil(_statsPeriod / 7);
      for (var w = weeks - 1; w >= 0; w--) {
        var wEnd = new Date(now - w * 7 * 24*60*60*1000);
        var wStart = new Date(wEnd - 6 * 24*60*60*1000);
        var ws = wStart.toISOString().slice(0,10);
        var we = wEnd.toISOString().slice(0,10);
        groupLabels.push((wStart.getMonth()+1) + '/' + wStart.getDate());
        groupOrderCounts.push(allOrders.filter(function(o){ return o.created_at && o.created_at.slice(0,10) >= ws && o.created_at.slice(0,10) <= we; }).length);
        var revW = 0;
        allOrders.filter(function(o){ return o.created_at && o.created_at.slice(0,10) >= ws && o.created_at.slice(0,10) <= we; }).forEach(function(o){
          if(o.items) o.items.forEach(function(i){ revW += (i.price||0)*(i.qty||1); });
        });
        groupRevenues.push(revW);
        groupSignups.push(allUsers.filter(function(u){ return u.created_at && u.created_at.slice(0,10) >= ws && u.created_at.slice(0,10) <= we; }).length);
        var fpW = forumPosts.filter(function(p){ return p.created_at && p.created_at.slice(0,10) >= ws && p.created_at.slice(0,10) <= we; }).length;
        var fcW = forumComments.filter(function(c){ return c.created_at && c.created_at.slice(0,10) >= ws && c.created_at.slice(0,10) <= we; }).length;
        groupForumActivity.push(fpW + fcW);
      }
    } else {
      // Monthly grouping
      var months = Math.ceil(_statsPeriod / 30);
      for (var m = months - 1; m >= 0; m--) {
        var md = new Date(now.getFullYear(), now.getMonth() - m, 1);
        var mk = md.toISOString().slice(0,7);
        groupLabels.push(md.toLocaleString('en', { month:'short' }));
        groupOrderCounts.push(allOrders.filter(function(o){ return o.created_at && o.created_at.slice(0,7) === mk; }).length);
        var revM = 0;
        allOrders.filter(function(o){ return o.created_at && o.created_at.slice(0,7) === mk; }).forEach(function(o){
          if(o.items) o.items.forEach(function(i){ revM += (i.price||0)*(i.qty||1); });
        });
        groupRevenues.push(revM);
        groupSignups.push(allUsers.filter(function(u){ return u.created_at && u.created_at.slice(0,7) === mk; }).length);
        var fpM = forumPosts.filter(function(p){ return p.created_at && p.created_at.slice(0,7) === mk; }).length;
        var fcM = forumComments.filter(function(c){ return c.created_at && c.created_at.slice(0,7) === mk; }).length;
        groupForumActivity.push(fpM + fcM);
      }
    }

    // ─── Render HTML (compact single-screen layout) ────────
    var html = '';

    // ① Period filter tabs (top bar)
    html += '<div class="flex items-center gap-1 mb-3">';
    [7,30,90].forEach(function(d) {
      var active = _statsPeriod === d;
      var lbl = d === 7 ? '7D' : d === 30 ? '30D' : '90D';
      html += '<button onclick="statsSetPeriod(' + d + ')" class="px-3 py-1.5 rounded-lg font-black text-[10px] transition ' +
        (active ? 'bg-[#001d4a] text-white shadow' : 'bg-slate-100 text-slate-400 hover:bg-slate-200') + '">' + lbl + '</button>';
    });
    html += '<span class="ml-auto text-[9px] text-slate-300 font-bold">' + (t('stats_dashboard') || 'DASHBOARD') + '</span>';
    html += '</div>';

    // ② Summary cards — 4 in a row
    html += '<div class="grid grid-cols-4 gap-2 mb-3">';
    html += _statCard('💰', t('stats_monthly_revenue') || 'Revenue', periodRevenue.toLocaleString() + '฿', 'bg-gradient-to-br from-green-500 to-emerald-700');
    html += _statCard('📦', t('stats_monthly_orders') || 'Orders', periodOrders.length, 'bg-gradient-to-br from-amber-500 to-orange-700');
    html += _statCard('✨', t('stats_weekly_signups') || 'Signups', periodSignups, 'bg-gradient-to-br from-purple-500 to-violet-700');
    html += _statCard('👥', t('stats_total_members') || 'Members', displayMembers, 'bg-gradient-to-br from-blue-500 to-indigo-700');
    html += '</div>';

    // ③ Charts — 2x2 grid (desktop), 1 col (mobile)
    html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">';
    // Top-left: Orders line chart
    html += '<div class="bg-white rounded-xl p-3 shadow-sm border border-slate-100">';
    html += '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">' + (t('stats_monthly_trend') || 'ORDERS & REVENUE') + '</p>';
    html += '<div style="height:200px"><canvas id="chartOrders"></canvas></div>';
    html += '</div>';
    // Top-right: Category pie chart
    html += '<div class="bg-white rounded-xl p-3 shadow-sm border border-slate-100">';
    html += '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">' + (t('stats_category_revenue') || 'REVENUE BY CATEGORY') + '</p>';
    html += '<div style="height:200px"><canvas id="chartCategoryPie"></canvas></div>';
    html += '</div>';
    // Bottom-left: Signups bar chart
    html += '<div class="bg-white rounded-xl p-3 shadow-sm border border-slate-100">';
    html += '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">' + (t('stats_signup_trend') || 'NEW SIGNUPS') + '</p>';
    html += '<div style="height:200px"><canvas id="chartSignups"></canvas></div>';
    html += '</div>';
    // Bottom-right: Forum activity chart
    html += '<div class="bg-white rounded-xl p-3 shadow-sm border border-slate-100">';
    html += '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">' + (t('stats_forum_activity') || 'FORUM ACTIVITY') + '</p>';
    html += '<div style="height:200px"><canvas id="chartForum"></canvas></div>';
    html += '</div>';
    html += '</div>';

    // ④ Top 5 products — compact table
    html += '<div class="bg-white rounded-xl p-3 shadow-sm border border-slate-100">';
    html += '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">' + (t('stats_top_products') || 'TOP PRODUCTS') + '</p>';
    if (topProducts.length) {
      html += '<table class="w-full text-[10px]">';
      html += '<thead><tr class="text-slate-400 font-bold border-b border-slate-100">' +
        '<th class="text-left py-1 pl-1 w-5">#</th>' +
        '<th class="text-left py-1">' + (t('product_name') || 'Product') + '</th>' +
        '<th class="text-right py-1 pr-1">' + (t('qty') || 'Qty') + '</th>' +
        '<th class="text-right py-1 pr-1">' + (t('stats_monthly_revenue') || 'Revenue') + '</th>' +
      '</tr></thead><tbody>';
      var medals = ['🥇','🥈','🥉','4','5'];
      topProducts.forEach(function(p, i) {
        html += '<tr class="' + (i < topProducts.length - 1 ? 'border-b border-slate-50' : '') + '">' +
          '<td class="py-1 pl-1 text-center">' + medals[i] + '</td>' +
          '<td class="py-1 font-bold text-slate-700 truncate max-w-[120px]">' + p.name + '</td>' +
          '<td class="py-1 pr-1 text-right font-mono font-black text-blue-600">' + p.qty + '</td>' +
          '<td class="py-1 pr-1 text-right font-mono text-slate-500">' + p.revenue.toLocaleString() + '฿</td>' +
        '</tr>';
      });
      html += '</tbody></table>';
    } else {
      html += '<p class="text-center text-slate-400 text-[10px] py-3">' + (t('stats_no_data') || 'No data') + '</p>';
    }
    html += '</div>';

    container.innerHTML = html;

    // ─── Create Chart.js charts ────────────────────────────
    if (typeof Chart === 'undefined') {
      console.warn('[Admin Stats] Chart.js not loaded yet');
      container.querySelectorAll('canvas').forEach(function(c) {
        c.parentElement.innerHTML = '<p class="text-center text-slate-400 text-xs py-6 font-bold">Chart.js loading... please retry in a moment.</p>';
      });
      return;
    }

    var chartFont = { family: "'Inter','Noto Sans Thai',sans-serif", size: 9 };
    var gridColor = 'rgba(0,0,0,0.04)';
    var compactLegend = { labels: { font: chartFont, boxWidth: 8, padding: 4 } };

    // 1. Orders line chart (count + revenue dual axis)
    var ctxOrders = document.getElementById('chartOrders');
    if (ctxOrders) {
      _statsCharts.orders = new Chart(ctxOrders, {
        type: 'line',
        data: {
          labels: groupLabels,
          datasets: [
            { label: t('stats_monthly_orders') || 'Orders', data: groupOrderCounts, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#3b82f6', yAxisID: 'y' },
            { label: t('stats_monthly_revenue') || 'Revenue', data: groupRevenues, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#10b981', yAxisID: 'y1' },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: compactLegend },
          scales: {
            x: { grid: { color: gridColor }, ticks: { font: chartFont, maxRotation: 0 } },
            y: { position: 'left', beginAtZero: true, grid: { color: gridColor }, ticks: { font: chartFont, stepSize: 1 } },
            y1: { position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, ticks: { font: chartFont, callback: function(v){ return (v/1000).toFixed(0) + 'k'; } } }
          }
        }
      });
    }

    // 2. Category pie chart
    var ctxPie = document.getElementById('chartCategoryPie');
    if (ctxPie) {
      var catLabels = Object.keys(catRevenue);
      var catValues = catLabels.map(function(k){ return catRevenue[k]; });
      var pieColors = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4'];
      if (catLabels.length === 0) {
        catLabels = ['No data']; catValues = [1]; pieColors = ['#e2e8f0'];
      }
      _statsCharts.categoryPie = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
          labels: catLabels,
          datasets: [{ data: catValues, backgroundColor: pieColors.slice(0, catLabels.length), borderWidth: 2, borderColor: '#fff' }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { font: chartFont, boxWidth: 8, padding: 4 } },
            tooltip: { callbacks: { label: function(ctx) { return ctx.label + ': ' + ctx.parsed.toLocaleString() + ' THB'; } } }
          }
        }
      });
    }

    // 3. Signups bar chart
    var ctxSignups = document.getElementById('chartSignups');
    if (ctxSignups) {
      _statsCharts.signups = new Chart(ctxSignups, {
        type: 'bar',
        data: {
          labels: groupLabels,
          datasets: [{ label: t('stats_weekly_signups') || 'New Signups', data: groupSignups, backgroundColor: 'rgba(139,92,246,0.7)', borderRadius: 6, borderSkipped: false }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: compactLegend },
          scales: {
            x: { grid: { color: gridColor }, ticks: { font: chartFont, maxRotation: 0 } },
            y: { beginAtZero: true, grid: { color: gridColor }, ticks: { font: chartFont, stepSize: 1 } }
          }
        }
      });
    }

    // 4. Forum activity bar chart
    var ctxForum = document.getElementById('chartForum');
    if (ctxForum) {
      _statsCharts.forum = new Chart(ctxForum, {
        type: 'bar',
        data: {
          labels: groupLabels,
          datasets: [{ label: t('stats_forum_activity') || 'Posts + Comments', data: groupForumActivity, backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 6, borderSkipped: false }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: compactLegend },
          scales: {
            x: { grid: { color: gridColor }, ticks: { font: chartFont, maxRotation: 0 } },
            y: { beginAtZero: true, grid: { color: gridColor }, ticks: { font: chartFont, stepSize: 1 } }
          }
        }
      });
    }

  } catch(e) {
    console.error('[Admin Stats] Render error:', e, e.stack || '');
    handleSupabaseError(e, 'Admin Stats');
    container.innerHTML = '<div class="text-center py-8">' +
      '<p class="text-red-400 text-sm font-bold mb-2">' + t('admin_error') + '</p>' +
      '<p class="text-slate-400 text-[10px] font-mono">' + (e.message || String(e)) + '</p>' +
      '<button onclick="renderAdminStats()" class="mt-3 px-4 py-2 bg-slate-100 rounded-xl text-xs font-black text-slate-600">🔄 Retry</button>' +
    '</div>';
  }
}

function _statCard(icon, label, value, bgClass) {
  return '<div class="' + bgClass + ' rounded-xl p-2.5 text-white shadow">' +
    '<div class="text-base mb-0.5">' + icon + '</div>' +
    '<div class="font-black text-sm leading-none mb-0.5 truncate">' + value + '</div>' +
    '<div class="text-[8px] font-bold opacity-75 leading-tight truncate">' + label + '</div>' +
  '</div>';
}

// ============================================================
// 크레딧 충전 모달
// ============================================================
var _creditChargeTarget = '';
var _creditChargeCurrentAmount = 0;

function openCreditChargeModal(nickname, currentCredits) {
  console.log('modal opening', nickname, currentCredits);
  _creditChargeTarget = nickname;
  _creditChargeCurrentAmount = parseInt(currentCredits, 10) || 0;
  var modal = document.getElementById('creditChargeModal');
  if (!modal) { console.error('creditChargeModal not found'); return; }
  document.getElementById('ccm-nickname').textContent = nickname;
  document.getElementById('ccm-current').textContent = _creditChargeCurrentAmount + ' ' + t('credit_unit');
  modal.classList.add('open');
}

function closeCreditChargeModal() {
  var modal = document.getElementById('creditChargeModal');
  if (modal) modal.classList.remove('open');
}

async function chargeCredits(amount) {
  amount = parseInt(amount, 10) || 0;
  if (!_creditChargeTarget || !amount) return;
  try {
    var newTotal = await sbAddCredits(_creditChargeTarget, amount, 'Admin charge +' + amount);
    _creditChargeCurrentAmount = parseInt(newTotal, 10) || 0;
    document.getElementById('ccm-current').textContent = _creditChargeCurrentAmount + ' ' + t('credit_unit');
    showToast(tf('credit_charged_msg', amount, _creditChargeTarget), 'success');
    // LINE 알림
    sendLinePushText(_creditChargeTarget, '💰 ' + t('credit_line_charged').replace('%', String(amount)).replace('%', String(_creditChargeCurrentAmount)));
    // 유저 목록 갱신
    renderAdminUsers();
  } catch(e) {
    console.error('[Credit Charge]', e.message || e);
    handleSupabaseError(e, 'Credit Charge');
    showToast(t('credit_charge_error'), 'error');
  }
}

function _guessCategoryFromName(name) {
  var n = name.toLowerCase();
  if (n.indexOf('scan') !== -1) return 'Scan Body';
  if (n.indexOf('q-base') !== -1 || n.indexOf('qbase') !== -1 || n.indexOf('zirconia') !== -1) return 'Q-Base';
  if (n.indexOf('ti-base') !== -1 || n.indexOf('tibase') !== -1) return 'Ti-Base';
  if (n.indexOf('ready') !== -1) return 'Ready Made';
  if (n.indexOf('pre-mill') !== -1 || n.indexOf('premill') !== -1) return 'Pre-Milled';
  if (n.indexOf('multi') !== -1 || n.indexOf('mua') !== -1) return 'Multi Unit';
  if (n.indexOf('analog') !== -1 || n.indexOf('3d') !== -1) return '3D Analog';
  return 'Other';
}

// ============================================================
// 관리자 피드백 관리 탭
// ============================================================
var _adminFbPage = 1;
var _adminFbData = [];
var _adminFbTotal = 0;

var _FB_CAT_ICONS = { bug:'🐛', feature:'💡', complaint:'😤', praise:'👍', other:'📝' };
var _FB_STATUS_CLS = {
  unread:  'bg-red-50 text-red-600',
  read:    'bg-blue-50 text-blue-600',
  replied: 'bg-green-50 text-green-600',
};

async function renderAdminFeedback() {
  var container = document.getElementById('adminTabFeedback');
  if (!container) return;
  container.innerHTML = '<p class="text-center text-slate-400 text-xs py-8">' + t('admin_loading') + '</p>';
  try {
    var result = await sbGetFeedback(_adminFbPage);
    _adminFbData = result.data || [];
    _adminFbTotal = result.count || 0;
    var totalPages = Math.max(1, Math.ceil(_adminFbTotal / 20));

    if (!_adminFbData.length) {
      container.innerHTML = '<div class="text-center py-12"><p class="text-3xl mb-2 opacity-30">💬</p><p class="font-black text-slate-400 text-sm">' + t('feedback_admin_empty') + '</p></div>';
      return;
    }

    var html = '<h3 class="font-black text-slate-700 text-sm mb-3">' + t('admin_tab_feedback') + ' (' + _adminFbTotal + ')</h3>';
    html += '<div class="space-y-2">';
    _adminFbData.forEach(function(fb, i) {
      var catIcon = _FB_CAT_ICONS[fb.category] || '📝';
      var statusCls = _FB_STATUS_CLS[fb.status] || _FB_STATUS_CLS.unread;
      var stars = '';
      for (var s = 0; s < 5; s++) stars += s < fb.rating ? '⭐' : '☆';
      html += '<div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">' +
        '<div class="flex items-start justify-between gap-2 mb-2">' +
          '<div class="flex-1 min-w-0">' +
            '<div class="flex items-center gap-2 mb-1">' +
              '<span class="text-lg">' + catIcon + '</span>' +
              '<span class="font-black text-slate-800 text-sm truncate">' + (fb.title || '-') + '</span>' +
            '</div>' +
            '<p class="text-[10px] text-slate-400 font-bold">' + (fb.user_nickname || '-') + ' · ' + (fb.created_at ? fb.created_at.slice(0, 10) : '') + '</p>' +
          '</div>' +
          '<span class="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black ' + statusCls + '">' + t('feedback_status_' + fb.status) + '</span>' +
        '</div>' +
        '<p class="text-xs text-slate-600 mb-2 line-clamp-3">' + (fb.content || '').replace(/</g, '&lt;') + '</p>' +
        '<div class="flex items-center justify-between">' +
          '<span class="text-xs">' + stars + '</span>' +
          '<div class="flex gap-1">' +
            (fb.status !== 'read' ? '<button onclick="adminFbStatus(\'' + fb.id + '\',\'read\')" class="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black active:scale-95">' + t('feedback_mark_read') + '</button>' : '') +
            (fb.status !== 'replied' ? '<button onclick="adminFbStatus(\'' + fb.id + '\',\'replied\')" class="px-2 py-1 rounded-lg bg-green-50 text-green-600 text-[10px] font-black active:scale-95">' + t('feedback_mark_replied') + '</button>' : '') +
          '</div>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';

    // Pagination
    if (totalPages > 1) {
      html += '<div class="flex items-center justify-center gap-1 mt-4">';
      if (_adminFbPage > 1) html += '<button onclick="adminFbGoPage(' + (_adminFbPage - 1) + ')" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-500">«</button>';
      for (var p = 1; p <= totalPages; p++) {
        var cls = p === _adminFbPage ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'bg-white text-slate-600 border-slate-200';
        html += '<button onclick="adminFbGoPage(' + p + ')" class="w-8 h-8 rounded-lg border text-xs font-black ' + cls + '">' + p + '</button>';
      }
      if (_adminFbPage < totalPages) html += '<button onclick="adminFbGoPage(' + (_adminFbPage + 1) + ')" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-500">»</button>';
      html += '</div>';
      html += '<p class="text-center text-[10px] text-slate-300 font-bold mt-1">' + _adminFbPage + ' / ' + totalPages + '</p>';
    }

    container.innerHTML = html;
  } catch(e) {
    handleSupabaseError(e, 'Admin Feedback');
    container.innerHTML = '<p class="text-center text-red-400 text-xs py-8">' + t('admin_load_fail') + '</p>';
  }
}

function adminFbGoPage(page) {
  _adminFbPage = page;
  renderAdminFeedback();
}

async function adminFbStatus(id, status) {
  try {
    await sbUpdateFeedback(id, { status: status });
    renderAdminFeedback();
  } catch(e) { handleSupabaseError(e, 'Feedback Status Update'); }
}

