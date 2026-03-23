// shop.js — 제품 카탈로그 + 장바구니 + 주문 + 리뷰
// ============================================================
// PromptPay QR Code Generator (EMVCo Standard)
// ============================================================
function generatePromptPayQR(id, amount) {
  // PromptPay uses EMVCo QR code standard
  // id: phone number (10 digits, 0-prefix) or National ID (13 digits)
  var sanitized = id.replace(/[^0-9]/g, '');
  var aid, accountId;
  if (sanitized.length === 13) {
    // National ID (citizen ID)
    aid = '0208A000000677010113' + _tlv('02', sanitized);
  } else {
    // Phone number: convert 0xx → 0066xx (PromptPay format uses 0066 + last 9 digits)
    var phone66 = '0066' + sanitized.slice(-9);
    aid = '0208A000000677010111' + _tlv('01', phone66);
  }
  var payload = '';
  payload += _tlv('00', '01');                     // Payload Format Indicator
  payload += _tlv('01', '12');                     // Point of Initiation (12=dynamic)
  payload += _tlv('29', aid);                      // Merchant Account Info (PromptPay=29)
  payload += _tlv('53', '764');                    // Transaction Currency (THB=764)
  if (amount && amount > 0) {
    payload += _tlv('54', amount.toFixed(2));       // Transaction Amount
  }
  payload += _tlv('58', 'TH');                     // Country Code
  payload += _tlv('63', '');                       // CRC placeholder
  // Calculate CRC16-CCITT
  var crc = _crc16(payload + '6304');
  payload += '6304' + crc;
  return payload;
}
function _tlv(tag, value) {
  var len = value.length.toString().padStart(2, '0');
  return tag + len + value;
}
function _crc16(str) {
  var crc = 0xFFFF;
  for (var i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (var j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
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
// Category product images — add URLs here as photos become available
var CATEGORY_IMAGES = {
  'q-base':  'https://ikdlgnpjcmwbsrxvoxvd.supabase.co/storage/v1/object/public/product/Q-base.png',
  'ti-base': 'https://ikdlgnpjcmwbsrxvoxvd.supabase.co/storage/v1/object/public/product/Ti-base%20Abutment.png'
};
// Render category icon: image with white bg box, or SVG scaled
function _catIcon(cat, size) {
  var url = CATEGORY_IMAGES[cat.id];
  if (url) return '<div class="bg-white rounded-xl shadow-sm flex items-center justify-center" style="width:' + size + 'px;height:' + size + 'px;padding:6px">' +
    '<img src="' + url + '" alt="' + cat.name + '" class="object-contain w-full h-full" loading="lazy"></div>';
  return '<div class="flex items-center justify-center" style="width:' + size + 'px;height:' + size + 'px">' + (cat.svg || '') + '</div>';
}
// Background decoration: image faded or SVG faded
function _catBg(cat, size) {
  var url = CATEGORY_IMAGES[cat.id];
  if (url) return '<img src="' + url + '" alt="" class="object-contain opacity-[0.15]" style="width:' + size + 'px;height:' + size + 'px" loading="lazy">';
  return '<div class="opacity-[0.12]" style="width:' + size + 'px;height:' + size + 'px">' + (cat.svg || '') + '</div>';
}

// Premium dark palette — dental B2B professional tones
var _CAT_BG = {
  'scan-body':  'linear-gradient(150deg,#0a1628 0%,#122040 60%,#1a2a4a 100%)',
  'q-base':     'linear-gradient(150deg,#1a1a2e 0%,#23233d 60%,#2a2a4a 100%)',
  'ready-made': 'linear-gradient(150deg,#16213e 0%,#1a2744 60%,#1e2d4e 100%)',
  'ti-base':    'linear-gradient(150deg,#0f3460 0%,#133a6a 60%,#1a4478 100%)',
  'pre-milled': 'linear-gradient(150deg,#2c2c3a 0%,#333348 60%,#3a3a52 100%)',
  'multi-unit': 'linear-gradient(150deg,#1a1a3e 0%,#222250 60%,#2a2a5e 100%)',
  '3d-analog':  'linear-gradient(150deg,#1b2838 0%,#1e3040 60%,#23384a 100%)',
};
var _CAT_BAR = {
  'scan-body':'#0a1628','q-base':'#1a1a2e','ready-made':'#16213e','ti-base':'#0f3460',
  'pre-milled':'#2c2c3a','multi-unit':'#1a1a3e','3d-analog':'#1b2838'
};
const SHOP_CATEGORIES = [
  { id:'scan-body',   name:'Scan Body',   desc:'Intra-Oral / Model / GeoMedi',
    svg:'<svg viewBox="0 0 52 72" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="26" cy="13" rx="20" ry="8" fill="white" opacity=".9"/><path d="M6 13 L14 54 L38 54 L46 13 Z" fill="white" opacity=".82"/><rect x="18" y="53" width="16" height="7" rx="2" fill="white" opacity=".7"/><rect x="16" y="59" width="20" height="7" rx="2.5" fill="white" opacity=".5"/></svg>' },
  { id:'q-base',      name:'Q-Base',      desc:'Zirconia Abutment',
    svg:'<svg viewBox="0 0 52 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="21" y="6" width="10" height="20" rx="2" fill="white" opacity=".85"/><rect x="18" y="11" width="16" height="1.5" rx="1" fill="white" opacity=".4"/><rect x="18" y="15" width="16" height="1.5" rx="1" fill="white" opacity=".4"/><rect x="18" y="19" width="16" height="1.5" rx="1" fill="white" opacity=".4"/><rect x="16" y="26" width="20" height="14" rx="2" fill="white" opacity=".82"/><rect x="12" y="39" width="28" height="8" rx="2" fill="white" opacity=".78"/><ellipse cx="26" cy="47" rx="19" ry="7" fill="white" opacity=".92"/><rect x="17" y="47" width="18" height="8" rx="1" fill="white" opacity=".65"/><ellipse cx="26" cy="55" rx="13" ry="5" fill="white" opacity=".5"/></svg>' },
  { id:'ready-made',  name:'Ready Made',  desc:'Ø3.0 · Ø4.5 · Ø5.5 · Ø6.5',
    svg:'<svg viewBox="0 0 44 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 4 L13 22 L31 22 Z" fill="white" opacity=".9"/><rect x="13" y="21" width="18" height="27" rx="2" fill="white" opacity=".85"/><rect x="11" y="47" width="22" height="7" rx="2" fill="white" opacity=".7"/><rect x="9" y="53" width="26" height="8" rx="2.5" fill="white" opacity=".5"/></svg>' },
  { id:'ti-base',     name:'Ti-Base',     desc:'CAD/CAM · Ti+Zr',
    svg:'<svg viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="25" cy="13" rx="15" ry="7" fill="white" opacity=".8"/><rect x="10" y="13" width="30" height="18" rx="2" fill="white" opacity=".85"/><rect x="13" y="30" width="24" height="8" rx="2" fill="white" opacity=".7"/><rect x="11" y="37" width="28" height="8" rx="2.5" fill="white" opacity=".5"/></svg>' },
  { id:'pre-milled',  name:'Pre-Milled',  desc:'N · H10 / R · H10',
    svg:'<svg viewBox="0 0 58 62" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="29" cy="14" rx="23" ry="11" fill="white" opacity=".9"/><rect x="21" y="14" width="16" height="20" rx="2" fill="white" opacity=".82"/><rect x="17" y="33" width="24" height="8" rx="2" fill="white" opacity=".7"/><rect x="15" y="40" width="28" height="8" rx="2.5" fill="white" opacity=".5"/></svg>' },
  { id:'multi-unit',  name:'Multi Unit',  desc:'All-on-X',
    svg:'<svg viewBox="0 0 62 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="26" y="3" width="10" height="16" rx="2" fill="white" opacity=".9"/><rect x="14" y="17" width="34" height="10" rx="3" fill="white" opacity=".78"/><rect x="7" y="25" width="10" height="22" rx="2" fill="white" opacity=".72"/><rect x="22" y="25" width="18" height="22" rx="2" fill="white" opacity=".72"/><rect x="45" y="25" width="10" height="22" rx="2" fill="white" opacity=".72"/></svg>' },
  { id:'3d-analog',   name:'3D Analog',   desc:'GeoMedi',
    svg:'<svg viewBox="0 0 44 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="5" width="12" height="12" rx="2" fill="white" opacity=".9"/><rect x="12" y="16" width="20" height="30" rx="2" fill="white" opacity=".82"/><rect x="15" y="20" width="5" height="22" rx="1" fill="white" opacity=".4"/><rect x="24" y="20" width="5" height="22" rx="1" fill="white" opacity=".4"/><rect x="13" y="45" width="18" height="7" rx="2" fill="white" opacity=".7"/><rect x="11" y="51" width="22" height="8" rx="2.5" fill="white" opacity=".5"/></svg>' },
];
function renderShop() {
  document.getElementById('shopCategoryList').innerHTML = SHOP_CATEGORIES.map(function(cat) {
    var count = PRODUCTS.filter(function(p){ return p.category === cat.id; }).length;
    var bg = _CAT_BG[cat.id] || _CAT_BG['scan-body'];
    return '<button onclick="openShopCategory(\'' + cat.id + '\')" ' +
      'class="shop-cat-card relative overflow-hidden rounded-2xl text-left active:scale-[.97] transition-all duration-200" ' +
      'style="background:' + bg + ';border:1px solid rgba(212,175,55,0.2)">' +
      '<div class="flex items-center justify-center py-4 px-3 bg-white/[0.04] rounded-t-xl">' + _catIcon(cat, 140) + '</div>' +
      '<div class="h-[2px]" style="background:linear-gradient(90deg,transparent,#D4AF37,transparent)"></div>' +
      '<div class="px-4 pb-4 pt-3">' +
        '<p class="font-black text-white text-sm leading-tight">' + cat.name + '</p>' +
        '<p class="text-[10px] font-medium mt-1 leading-snug" style="color:rgba(212,175,55,0.7)">' + cat.desc + '</p>' +
        '<p class="text-[10px] font-black mt-1.5" style="color:rgba(255,255,255,0.4)">' + count + ' ' + t('shop_product_count') + '</p>' +
      '</div>' +
    '</button>';
  }).join('');
  renderMyShopOrders();
}
async function renderMyShopOrders() {
  var container = document.getElementById('myShopOrdersList');
  if (!container) return;
  container.innerHTML = dtLoaderHtml();

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
    handleSupabaseError(e, 'MyShopOrders');
    // 네트워크 오류 시 localStorage 폴백
    var cached = JSON.parse(localStorage.getItem('dentalk_shop_orders') || '[]');
    var nick = currentUser && currentUser.nickname;
    orders = nick ? cached.filter(function(o){ return o.nickname === nick; }) : cached;
  }

  _renderMyShopOrdersList(container, orders);
}
function _renderMyShopOrdersList(container, orders) {
  if (!orders.length) {
    container.innerHTML = '<p class="text-center text-slate-400 text-xs py-3 font-bold">' + t('shop_no_orders_msg') + '</p>';
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
        '<p class="text-xs font-black text-blue-800 text-right">' + t('shop_total_label') + ' ' + total.toLocaleString() + ' THB</p>' +
      '</div>';
    }).join('');
    return '<div class="mb-4">' +
      '<div class="flex items-center gap-2 mb-2">' +
        '<span>' + stage.icon + '</span>' +
        '<span class="font-black text-slate-700 text-xs">' + t(stage.labelKey) + '</span>' +
        '<span class="bg-blue-100 text-blue-700 font-black text-[9px] px-2 py-0.5 rounded-full">' + stageOrders.length + (t('shop_count_suffix') ? ' ' + t('shop_count_suffix') : '') + '</span>' +
      '</div>' +
      ordersHtml +
    '</div>';
  }).join('');
  container.innerHTML = html || '<p class="text-center text-slate-400 text-xs py-3 font-bold">' + t('shop_no_orders_msg') + '</p>';
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
      '<div class="h-1" style="background:' + (_CAT_BAR[catId] || '#0a1628') + '"></div>' +
      (cat ? '<div class="flex items-center justify-center pt-4 px-4">' + _catIcon(cat, 120) + '</div>' : '') +
      '<div class="p-4">' +
        '<h3 class="font-black text-slate-800 text-sm leading-tight">' + p.title + '</h3>' +
        '<p class="text-[9px] text-slate-400 font-bold uppercase mt-0.5 leading-tight">' + p.subtitle + '</p>' +
        '<div class="flex items-center justify-between mt-3">' +
          '<div>' + stockHtml + '</div>' +
          '<div class="text-right">' +
            '<span class="text-[10px] text-slate-400 font-bold">฿</span>' +
            '<span class="font-black text-blue-700 text-lg font-mono">' + p.price.toLocaleString() + '</span>' +
          '</div>' +
        '</div>' +
        (inStock ? '<p class="text-[9px] text-blue-400 font-black mt-2 uppercase text-center">' + t('shop_select') + ' ›</p>' : '') +
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
  // GA4 view_item tracking
  if (typeof gtag === 'function') gtag('event', 'view_item', { currency: 'THB', value: currentProd.price, items: [{ item_id: currentProd.id, item_name: currentProd.title, price: currentProd.price }] });
}

// ── Product detail page ───────────────────────────────────────
var _catGrads = _CAT_BG;
function renderProductPage() {
  var p = currentProd;
  var cat = SHOP_CATEGORIES.find(function(c){ return c.id === p.category; });
  var inStock = isInStock(p.id);
  var hero = document.getElementById('shopProductHero');
  if (hero) hero.style.background = _catGrads[p.category] || _catGrads['scan-body'];
  var iconArea = document.getElementById('shopProductIconArea');
  if (iconArea && cat) {
    iconArea.innerHTML = _catIcon(cat, 200);
  }
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
  loadProductReviews(p.id);
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
  // GA4 add_to_cart tracking
  if (typeof gtag === 'function') gtag('event', 'add_to_cart', { currency: 'THB', value: items.reduce(function(s,e){ return s + e[1] * currentProd.price; }, 0), items: items.map(function(e){ return { item_id: e[0], item_name: currentProd.title, price: currentProd.price, quantity: e[1] }; }) });
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
  if (!cart.length) { showToast(t('cart_empty'), 'warning'); return; }
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
  if (!clinic||!phone||!addr) { showToast(t('addr_fill_error'), 'warning'); return; }
  var amt = cart.reduce(function(s,c){ return s+c.price*c.qty; },0);
  var oid = 'SP-' + Date.now();
  pendingShopOrder = {
    id: oid,
    date: new Date().toLocaleDateString('ko-KR'),
    clinic: clinic, phone: phone, address: addr, lineId: lineId,
    nickname: currentUser.nickname || '',
    items: cart.map(function(c){ return {name:c.name,code:c.code,qty:c.qty,price:c.price}; }),
    totalAmount: amt,
    stage: 'payment_pending'
  };
  // PromptPay QR 생성 (EMVCo 표준)
  // PromptPay ID: 전화번호 (0-prefix → 66-prefix) 또는 국민ID (13자리)
  // ⚠️ 실제 운영 시 아래 PROMPTPAY_ID를 실제 전화번호 또는 국민ID로 교체하세요
  // 예시: '0812345678' (전화번호) 또는 '1234567890123' (국민ID)
  var PROMPTPAY_ID = '0000000000'; // ← PLACEHOLDER: 실제 PromptPay ID로 교체 필요
  var ppPayload = generatePromptPayQR(PROMPTPAY_ID, amt);
  var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(ppPayload);
  document.getElementById('qrSummary').innerHTML =
    '<p class="font-black text-slate-500 uppercase text-[9px] mb-2">' + t('qr_summary_title') + '</p>' +
    cart.map(function(c){ return '<div class="flex justify-between gap-2 text-[10px]"><span class="flex-1">' + c.name + '</span><span class="font-mono text-slate-500">' + c.code + '</span><span class="font-black ml-1">×' + c.qty + '</span><span class="font-mono font-black ml-1">' + (c.price*c.qty).toLocaleString() + '</span></div>'; }).join('') +
    '<div class="border-t mt-2 pt-2 flex justify-between font-black text-slate-800"><span>' + t('qr_total') + '</span><span class="font-mono">' + amt.toLocaleString() + ' THB</span></div>' +
    '<p class="text-[9px] font-bold text-slate-400 mt-1">' + t('pay_ref') + ': ' + oid + '</p>' +
    // 은행 이체 안내
    '<div class="mt-3 pt-3 border-t border-slate-200">' +
      '<p class="font-black text-[10px] text-slate-600 mb-1.5">' + t('pay_bank_title') + '</p>' +
      '<div class="bg-blue-50 rounded-lg p-2.5 text-[10px] space-y-1">' +
        '<div class="flex justify-between"><span class="text-slate-500">' + t('pay_bank_name') + '</span><span class="font-black text-slate-800">Kasikorn Bank (KBank)</span></div>' +
        '<div class="flex justify-between"><span class="text-slate-500">' + t('pay_bank_acct') + '</span><span class="font-black text-slate-800 font-mono">088-8-88888-8</span></div>' +
        '<div class="flex justify-between"><span class="text-slate-500">' + t('pay_bank_holder') + '</span><span class="font-black text-slate-800">BIOTEM × BIOPLANT</span></div>' +
        '<div class="flex justify-between"><span class="text-slate-500">' + t('pay_bank_amount') + '</span><span class="font-black text-blue-700 font-mono">' + amt.toLocaleString() + ' THB</span></div>' +
      '</div>' +
    '</div>';
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
  // GA4 purchase tracking
  if (typeof gtag === 'function') gtag('event', 'purchase', { transaction_id: order.id, currency: 'THB', value: order.totalAmount, items: order.items.map(function(i){ return { item_id: i.code, item_name: i.name, price: i.price, quantity: i.qty }; }) });
  // Supabase에도 저장
  sbSaveShopOrder(order).catch(function(e){ console.error('[Shop Order Save]', e); });
  // 관리자에게 LINE flex 발송
  var itemFields = order.items.map(function(i){
    return { label: i.name, value: '[' + i.code + '] ×' + i.qty + '  ' + (i.price*i.qty).toLocaleString() + ' THB' };
  });
  itemFields.push({ label: t('shop_total_label'), value: order.totalAmount.toLocaleString() + ' THB' });
  var adminFields = [
    { label: t('shop_receipt_order_no'), value: order.id },
    { label: t('shop_receipt_clinic'), value: order.clinic },
    { label: t('shop_receipt_date'), value: order.date },
    { label: t('shop_receipt_contact'), value: order.phone },
    { label: t('shop_receipt_address'), value: order.address },
  ].concat(order.lineId ? [{ label: 'Line ID', value: order.lineId }] : []).concat(itemFields);
  sendLineMessage(LINE_USER_ID, [buildFlexMessage('🛒', 'คำสั่งซื้อใหม่จากร้านค้า', adminFields, '⏳ รอยืนยันการชำระเงิน — กรุณาตรวจสอบและเปลี่ยนสถานะ', 'Shop Order')]);
  // 결제완료 팝업
  document.getElementById('payCompleteSummary').innerHTML =
    '<p class="font-black text-slate-500 text-[9px] uppercase mb-2">' + t('shop_receipt_order_no') + ': ' + order.id + '</p>' +
    order.items.map(function(i){ return '<div class="flex justify-between text-xs gap-2"><span class="flex-1 font-bold">' + i.name + '</span><span class="font-mono text-slate-500">' + i.code + '</span><span class="font-black ml-1">×' + i.qty + '</span><span class="font-mono font-black ml-1">' + (i.price*i.qty).toLocaleString() + '</span></div>'; }).join('') +
    '<div class="border-t mt-2 pt-2 flex justify-between font-black text-blue-800"><span>' + t('shop_total_label') + '</span><span class="font-mono">' + order.totalAmount.toLocaleString() + ' THB</span></div>';
  cart=[]; updateBadge(); closeModal('qrModal');
  openModal('payCompleteModal');
}
function closePayComplete() { closeModal('payCompleteModal'); goPage('shop'); }

// ============================================================
// 쇼핑몰 주문 관리
// ============================================================
var SHOP_STAGES = [
  { key:'submitted',         labelKey:'shop_stage_submitted',         icon:'📥', next:'payment_pending' },
  { key:'payment_pending',   labelKey:'shop_stage_payment_pending',   icon:'🏦', next:'payment_confirmed' },
  { key:'payment_confirmed', labelKey:'shop_stage_payment_confirmed', icon:'💳', next:'preparing' },
  { key:'preparing',         labelKey:'shop_stage_preparing',         icon:'📦', next:'shipped' },
  { key:'shipped',           labelKey:'shop_stage_shipped',           icon:'🚚', next:'delivered' },
  { key:'delivered',         labelKey:'shop_stage_delivered',         icon:'✅', next:null },
];
// ── 태국어 상태 라벨 (LINE 알림용) ──────────────────────────
var SHOP_STAGE_TH = {
  submitted:'รับคำสั่งซื้อแล้ว', payment_pending:'รอชำระเงิน', payment_confirmed:'ยืนยันชำระเงินแล้ว',
  paid:'ชำระเงินแล้ว', preparing:'กำลังเตรียมสินค้า', shipped:'กำลังจัดส่ง', delivered:'จัดส่งเรียบร้อย'
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
  } catch(e) { handleSupabaseError(e, 'Shop Orders Load'); }
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
        s.icon + ' ' + t(s.labelKey) +
        '<span class="ml-1 font-mono ' + (hasOrders ? 'text-amber-400' : (active ? 'text-slate-300' : 'text-slate-400')) + '">(' + counts[s.key] + ')</span>' +
      '</button>';
    }).join('') + '</div>';
  var filtered = orders.filter(function(o){ return o.stage === currentShopStageTab; });
  var contentHtml;
  if (!filtered.length) {
    contentHtml = '<p class="text-center text-slate-400 text-sm py-8 font-bold">' + t('shop_no_stage_orders') + '</p>';
  } else {
    // Stage badge colors
    var stageBadgeClass = {
      submitted:'bg-amber-100 text-amber-700',
      payment_pending:'bg-orange-100 text-orange-700',
      payment_confirmed:'bg-blue-100 text-blue-700',
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
        ? '<button onclick="adminAdvanceShopOrder(\'' + o.id + '\')" class="w-full mt-2 py-2 bg-blue-600 text-white rounded-xl font-black text-xs active:scale-95 transition">' + nextStage.icon + ' ' + t(nextStage.labelKey) + ' → LINE</button>'
        : '<div class="mt-2 text-center"><p class="text-[10px] font-black text-green-500">✅ ' + t('shipped_status') + '</p></div>';
      var stageDropdown = '<div class="mt-2">' +
        '<label class="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">' + t('admin_change_status') + '</label>' +
        '<select onchange="adminChangeShopOrderStage(\'' + o.id + '\',this.value)" class="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-blue-400 bg-white">' +
        SHOP_STAGES.map(function(s) {
          return '<option value="' + s.key + '"' + (s.key === o.stage ? ' selected' : '') + '>' + s.icon + ' ' + t(s.labelKey) + '</option>';
        }).join('') +
        '</select></div>';
      var badgeCls = stageBadgeClass[o.stage] || 'bg-slate-100 text-slate-600';
      return '<div class="bg-white rounded-2xl shadow-sm overflow-hidden">' +
        // Table-style header row: status badge | customer name | date | total
        '<div class="px-4 py-3 border-b border-slate-50">' +
          '<div class="flex items-center justify-between gap-2 mb-1">' +
            '<span class="text-[10px] font-black px-2 py-0.5 rounded-full ' + badgeCls + '">' + stage.icon + ' ' + t(stage.labelKey) + '</span>' +
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
  if (!carrier) { showToast(t('shop_carrier_select_err'), 'warning'); return; }
  if (!tracking) { showToast(t('shop_tracking_input_err'), 'warning'); return; }
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
  } else if (o.nickname) {
    // lineId 없을 때 licenses 테이블에서 line_user_id 조회 후 발송
    sendLinePushText(o.nickname, '🦷 คำสั่งซื้อ ' + o.id + ' สถานะเปลี่ยนเป็น ' + shopStageTh + '\nYour order ' + o.id + ' status changed to ' + nextKey + '.');
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

// ============================================================
// 리뷰/평점 시스템
// ============================================================
var _reviewRating = 0;
var _currentReviewProductId = null;

function setReviewStar(n) {
  _reviewRating = n;
  var stars = document.querySelectorAll('#reviewStars .review-star');
  for (var i = 0; i < stars.length; i++) {
    stars[i].style.color = (i < n) ? '#f59e0b' : '#e2e8f0';
  }
}

async function loadProductReviews(productId) {
  _currentReviewProductId = productId;
  _reviewRating = 0;
  setReviewStar(0);
  var reviewList = document.getElementById('reviewList');
  var formWrap = document.getElementById('reviewFormWrap');
  var notice = document.getElementById('reviewNotice');
  var commentEl = document.getElementById('reviewComment');
  if (commentEl) commentEl.value = '';

  // 구매 완료 유저만 리뷰 작성 가능
  var canReview = false;
  if (isLoggedIn() && currentUser && currentUser.nickname) {
    try {
      var orders = await sbGetShopOrders(currentUser.nickname, false);
      if (orders && orders.length) {
        canReview = orders.some(function(o) {
          return (o.stage === 'delivered' || o.stage === 'payment_confirmed') && o.items && o.items.some(function(item) {
            return item.code === productId || item.name === productId;
          });
        });
      }
      // 이미 리뷰 작성 여부 확인
      var hasReview = await sbCheckUserReview(currentUser.nickname, productId);
      if (hasReview) canReview = false;
    } catch(e) { /* silent */ }
  }
  if (formWrap) formWrap.classList.toggle('hidden', !canReview);
  if (notice) notice.classList.toggle('hidden', canReview || !isLoggedIn());

  // 리뷰 목록 로드
  try {
    var reviews = await sbGetReviews(productId);
    renderReviewList(reviews || []);
  } catch(e) {
    if (reviewList) reviewList.innerHTML = '<p class="text-center text-slate-400 text-xs py-4">' + t('review_load_error') + '</p>';
  }
}

function renderReviewList(reviews) {
  var list = document.getElementById('reviewList');
  var avgEl = document.getElementById('reviewAvgScore');
  var countEl = document.getElementById('reviewCount');
  if (!list) return;

  if (!reviews.length) {
    list.innerHTML = '<p class="text-center text-slate-400 text-[10px] font-bold py-4">' + t('review_empty') + '</p>';
    if (avgEl) avgEl.textContent = '-';
    if (countEl) countEl.textContent = '(0)';
    return;
  }

  var sum = reviews.reduce(function(s, r){ return s + r.rating; }, 0);
  var avg = (sum / reviews.length).toFixed(1);
  if (avgEl) avgEl.textContent = avg;
  if (countEl) countEl.textContent = '(' + reviews.length + ')';

  var starsHtml = function(rating) {
    var s = '';
    for (var i = 1; i <= 5; i++) s += '<span style="color:' + (i <= rating ? '#f59e0b' : '#e2e8f0') + '">★</span>';
    return s;
  };

  list.innerHTML = reviews.map(function(r) {
    var deleteBtn = (isLoggedIn() && currentUser && currentUser.nickname === r.user_id)
      ? ' <button onclick="deleteReview(\'' + r.id + '\')" class="text-red-400 text-[9px] font-bold hover:text-red-600">✕</button>'
      : '';
    return '<div class="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">' +
      '<div class="flex items-center justify-between mb-1">' +
        '<div class="flex items-center gap-2">' +
          '<span class="font-black text-xs text-slate-700">' + escHtml(r.user_id || '') + '</span>' +
          '<span class="text-xs">' + starsHtml(r.rating) + '</span>' +
        '</div>' +
        '<span class="text-[9px] text-slate-400">' + (r.created_at || '').slice(0,10) + deleteBtn + '</span>' +
      '</div>' +
      (r.comment ? '<p class="text-[11px] text-slate-600 leading-relaxed">' + escHtml(r.comment) + '</p>' : '') +
    '</div>';
  }).join('');
}

async function submitReview() {
  if (!_reviewRating || _reviewRating < 1) { showToast(t('review_rating_required'), 'warning'); return; }
  if (!isLoggedIn() || !currentUser) return;
  var comment = document.getElementById('reviewComment').value.trim();
  try {
    await sbPostReview({
      user_id: currentUser.nickname,
      product_id: _currentReviewProductId,
      rating: _reviewRating,
      comment: comment,
    });
    loadProductReviews(_currentReviewProductId);
  } catch(e) {
    handleSupabaseError(e, 'Review Submit');
  }
}

async function deleteReview(reviewId) {
  if (!confirm(t('review_delete_confirm'))) return;
  try {
    await sbDeleteReview(reviewId);
    loadProductReviews(_currentReviewProductId);
  } catch(e) { /* silent */ }
}

