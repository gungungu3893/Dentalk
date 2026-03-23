// leaders.js — Regional Leaders page with Thailand province map
// ============================================================

var _leadersData = [];
var _leadersLoaded = false;
var _selectedRegion = '';
var _selectedProvince = '';

// ── Thai province names (key → Thai name) ──────────────────
var PROVINCE_TH = {
  chiang_mai:'เชียงใหม่',chiang_rai:'เชียงราย',lampang:'ลำปาง',lamphun:'ลำพูน',mae_hong_son:'แม่ฮ่องสอน',nan:'น่าน',phayao:'พะเยา',phrae:'แพร่',uttaradit:'อุตรดิตถ์',
  amnat_charoen:'อำนาจเจริญ',bueng_kan:'บึงกาฬ',buri_ram:'บุรีรัมย์',chaiyaphum:'ชัยภูมิ',kalasin:'กาฬสินธุ์',khon_kaen:'ขอนแก่น',loei:'เลย',maha_sarakham:'มหาสารคาม',mukdahan:'มุกดาหาร',nakhon_phanom:'นครพนม',nakhon_ratchasima:'นครราชสีมา',nong_bua_lam_phu:'หนองบัวลำภู',nong_khai:'หนองคาย',roi_et:'ร้อยเอ็ด',sakon_nakhon:'สกลนคร',si_sa_ket:'ศรีสะเกษ',surin:'สุรินทร์',ubon_ratchathani:'อุบลราชธานี',udon_thani:'อุดรธานี',yasothon:'ยโสธร',
  chachoengsao:'ฉะเชิงเทรา',chanthaburi:'จันทบุรี',chon_buri:'ชลบุรี',prachin_buri:'ปราจีนบุรี',rayong:'ระยอง',sa_kaeo:'สระแก้ว',trat:'ตราด',
  chumphon:'ชุมพร',krabi:'กระบี่',nakhon_si_thammarat:'นครศรีธรรมราช',narathiwat:'นราธิวาส',pattani:'ปัตตานี',phang_nga:'พังงา',phatthalung:'พัทลุง',phuket:'ภูเก็ต',ranong:'ระนอง',satun:'สตูล',songkhla:'สงขลา',surat_thani:'สุราษฎร์ธานี',trang:'ตรัง',yala:'ยะลา',
  ang_thong:'อ่างทอง',ayutthaya:'พระนครศรีอยุธยา',bangkok:'กรุงเทพมหานคร',chai_nat:'ชัยนาท',kanchanaburi:'กาญจนบุรี',lopburi:'ลพบุรี',nakhon_nayok:'นครนายก',nakhon_pathom:'นครปฐม',nakhon_sawan:'นครสวรรค์',nonthaburi:'นนทบุรี',pathum_thani:'ปทุมธานี',phetchabun:'เพชรบูรณ์',phetchaburi:'เพชรบุรี',phichit:'พิจิตร',phitsanulok:'พิษณุโลก',prachuap_khiri_khan:'ประจวบคีรีขันธ์',ratchaburi:'ราชบุรี',samut_prakan:'สมุทรปราการ',samut_sakhon:'สมุทรสาคร',samut_songkhram:'สมุทรสงคราม',saraburi:'สระบุรี',sing_buri:'สิงห์บุรี',sukhothai:'สุโขทัย',suphan_buri:'สุพรรณบุรี',tak:'ตาก',uthai_thani:'อุทัยธานี'
};

// ── Region colors ──────────────────────────────────────────
var REGION_COLORS = {
  north:     { base: '#22c55e', hover: '#16a34a', label: '#15803d' },
  northeast: { base: '#f97316', hover: '#ea580c', label: '#c2410c' },
  east:      { base: '#ef4444', hover: '#dc2626', label: '#b91c1c' },
  south:     { base: '#a855f7', hover: '#9333ea', label: '#7e22ce' },
  central:   { base: '#eab308', hover: '#ca8a04', label: '#a16207' }
};

// ── Province SVG paths (simplified polygons in 400x580 viewbox) ──
// Approximate geographic positions for each province
var PROVINCE_PATHS = {
  // NORTH (top area, y: 0-180)
  mae_hong_son: 'M40,40 L70,30 L80,60 L70,90 L40,85 Z',
  chiang_mai:   'M70,30 L120,20 L130,55 L110,80 L80,60 Z',
  chiang_rai:   'M120,20 L175,10 L180,50 L150,60 L130,55 Z',
  lamphun:      'M110,80 L130,55 L150,60 L145,90 L120,95 Z',
  lampang:      'M130,55 L180,50 L185,90 L145,90 Z',
  phayao:       'M150,60 L180,50 L200,40 L205,70 L185,90 Z',
  nan:          'M200,40 L240,25 L245,80 L205,70 Z',
  phrae:        'M185,90 L205,70 L245,80 L230,115 L195,110 Z',
  uttaradit:    'M195,110 L230,115 L225,150 L190,145 Z',
  // NORTHEAST (right area, y: 100-280)
  loei:         'M210,100 L245,80 L270,95 L265,130 L230,140 Z',
  nong_khai:    'M265,100 L310,85 L320,110 L285,120 Z',
  bueng_kan:    'M310,85 L360,80 L355,115 L320,110 Z',
  udon_thani:   'M265,130 L285,120 L320,110 L315,150 L275,155 Z',
  nong_bua_lam_phu: 'M230,140 L265,130 L275,155 L245,165 Z',
  sakon_nakhon: 'M320,110 L355,115 L350,150 L315,150 Z',
  nakhon_phanom:'M350,150 L355,115 L380,120 L375,160 Z',
  khon_kaen:    'M245,165 L275,155 L315,150 L310,190 L260,195 Z',
  kalasin:      'M310,190 L315,150 L350,150 L345,195 Z',
  mukdahan:     'M345,195 L350,150 L375,160 L370,200 Z',
  chaiyaphum:   'M220,175 L245,165 L260,195 L245,220 L220,215 Z',
  maha_sarakham:'M260,195 L310,190 L305,220 L265,225 Z',
  roi_et:       'M305,220 L310,190 L345,195 L340,230 Z',
  amnat_charoen:'M340,230 L345,195 L370,200 L365,235 Z',
  nakhon_ratchasima:'M220,215 L245,220 L265,225 L280,260 L240,270 L215,255 Z',
  buri_ram:     'M280,260 L265,225 L305,220 L320,255 L295,270 Z',
  surin:        'M295,270 L320,255 L340,230 L365,235 L360,270 L310,275 Z',
  si_sa_ket:    'M310,275 L360,270 L355,295 L315,295 Z',
  ubon_ratchathani:'M355,295 L360,270 L380,260 L385,300 L355,305 Z',
  yasothon:     'M340,230 L365,235 L360,270 L340,260 Z',
  // EAST (southeast, y: 250-360)
  sa_kaeo:      'M240,270 L280,260 L295,270 L290,300 L250,295 Z',
  prachin_buri: 'M215,280 L240,270 L250,295 L230,310 Z',
  nakhon_nayok: 'M200,270 L215,280 L230,310 L210,310 Z',
  chachoengsao: 'M200,310 L230,310 L235,340 L210,340 Z',
  chon_buri:    'M200,340 L210,340 L235,340 L230,370 L200,370 Z',
  rayong:       'M230,370 L235,340 L260,345 L255,375 Z',
  chanthaburi:  'M260,345 L290,300 L310,310 L300,355 Z',
  trat:         'M300,355 L310,310 L330,320 L320,360 Z',
  // CENTRAL (center area, y: 140-320)
  tak:          'M60,120 L100,110 L110,160 L70,170 Z',
  sukhothai:    'M100,110 L140,105 L150,140 L110,160 Z',
  phitsanulok:  'M140,105 L190,145 L180,170 L150,140 Z',
  phichit:      'M150,140 L180,170 L170,195 L140,185 Z',
  phetchabun:   'M180,170 L220,175 L220,215 L195,215 L170,195 Z',
  nakhon_sawan: 'M120,185 L140,185 L170,195 L165,225 L125,220 Z',
  uthai_thani:  'M90,180 L120,185 L125,220 L95,215 Z',
  chai_nat:     'M125,220 L165,225 L160,245 L130,242 Z',
  lopburi:      'M160,245 L165,225 L195,215 L200,270 L175,265 Z',
  saraburi:     'M175,265 L200,270 L210,310 L190,300 Z',
  sing_buri:    'M130,242 L160,245 L158,260 L135,258 Z',
  ang_thong:    'M135,258 L158,260 L155,275 L135,272 Z',
  ayutthaya:    'M155,275 L158,260 L175,265 L175,285 Z',
  suphan_buri:  'M95,240 L130,242 L135,272 L100,270 Z',
  nonthaburi:   'M155,285 L175,285 L175,300 L155,300 Z',
  pathum_thani: 'M175,285 L190,300 L185,310 L175,300 Z',
  bangkok:      'M155,300 L175,300 L185,310 L200,310 L200,330 L165,330 L155,320 Z',
  nakhon_pathom:'M135,295 L155,300 L155,320 L135,315 Z',
  samut_prakan: 'M200,330 L200,340 L185,345 L165,330 Z',
  samut_sakhon: 'M135,315 L155,320 L165,330 L150,345 L135,340 Z',
  samut_songkhram:'M115,340 L135,340 L135,360 L115,355 Z',
  kanchanaburi: 'M50,200 L95,215 L100,270 L95,310 L55,290 Z',
  ratchaburi:   'M95,310 L100,270 L135,295 L135,340 L100,340 Z',
  phetchaburi:  'M95,340 L100,340 L135,360 L120,395 L90,380 Z',
  prachuap_khiri_khan:'M80,395 L90,380 L120,395 L110,450 L80,440 Z',
  // SOUTH (bottom area, y: 390-580)
  chumphon:     'M100,440 L110,450 L130,445 L135,490 L105,485 Z',
  ranong:       'M70,455 L100,440 L105,485 L80,490 Z',
  surat_thani:  'M105,485 L135,490 L155,480 L160,530 L115,530 Z',
  phang_nga:    'M80,490 L105,485 L115,530 L90,530 Z',
  krabi:        'M115,530 L160,530 L155,555 L120,555 Z',
  phuket:       'M75,540 L90,530 L90,555 L75,555 Z',
  nakhon_si_thammarat:'M160,530 L200,520 L195,560 L155,555 Z',
  trang:        'M120,555 L155,555 L150,575 L125,575 Z',
  phatthalung:  'M155,555 L195,560 L190,575 L150,575 Z',
  satun:        'M100,575 L125,575 L120,595 L100,595 Z',
  songkhla:     'M150,575 L190,575 L185,600 L155,600 Z',
  pattani:      'M185,600 L190,575 L220,580 L215,605 Z',
  yala:         'M155,600 L185,600 L180,620 L155,620 Z',
  narathiwat:   'M215,605 L220,580 L245,590 L240,620 Z'
};

// ── Render Thailand Map SVG ────────────────────────────────
function _buildThailandSVG() {
  var svg = '<svg viewBox="0 0 400 640" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:520px">';

  // Region background groups
  FORUM_REGIONS.forEach(function(reg) {
    if (reg.key === 'all') return;
    var color = REGION_COLORS[reg.key];
    reg.provinces.forEach(function(prov, i) {
      var path = PROVINCE_PATHS[prov.key];
      if (!path) return;
      var shade = _shadeColor(color.base, -10 + (i % 5) * 8);
      svg += '<path d="' + path + '" ' +
        'id="prov-' + prov.key + '" ' +
        'data-region="' + reg.key + '" data-province="' + prov.key + '" ' +
        'fill="' + shade + '" stroke="#fff" stroke-width="1" ' +
        'style="cursor:pointer;transition:fill .2s,opacity .2s" ' +
        'onmouseenter="mapHover(this,true)" onmouseleave="mapHover(this,false)" ' +
        'onclick="mapClickProvince(\'' + reg.key + '\',\'' + prov.key + '\')"' +
        '/>';
    });
  });

  // Region labels
  var labelPos = {
    north:     { x: 130, y: 65 },
    northeast: { x: 305, y: 175 },
    east:      { x: 270, y: 340 },
    south:     { x: 130, y: 530 },
    central:   { x: 155, y: 250 }
  };
  Object.keys(labelPos).forEach(function(rk) {
    var pos = labelPos[rk];
    var reg = FORUM_REGIONS.find(function(r){ return r.key === rk; });
    if (!reg) return;
    svg += '<text x="' + pos.x + '" y="' + pos.y + '" text-anchor="middle" ' +
      'font-size="11" font-weight="900" fill="' + REGION_COLORS[rk].label + '" ' +
      'style="pointer-events:none;text-shadow:0 1px 2px rgba(255,255,255,0.8)">' +
      reg.icon + ' ' + t(reg.labelKey) + '</text>';
  });

  svg += '</svg>';
  return svg;
}

function _shadeColor(hex, percent) {
  var num = parseInt(hex.replace('#',''), 16);
  var r = Math.min(255, Math.max(0, (num >> 16) + percent));
  var g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
  var b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
  return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

// ── Map interactions ───────────────────────────────────────
function mapHover(el, isEnter) {
  var tooltip = document.getElementById('mapTooltip');
  if (!tooltip) return;
  if (isEnter) {
    var pk = el.dataset.province;
    var en = (PROVINCE_PATHS[pk] ? pk.replace(/_/g, ' ') : '');
    en = en.replace(/\b\w/g, function(c){ return c.toUpperCase(); });
    var th = PROVINCE_TH[pk] || '';
    tooltip.textContent = th + ' / ' + en;
    tooltip.classList.remove('hidden');
    var rect = el.getBoundingClientRect();
    var wrap = document.getElementById('thailandMapWrap');
    var wRect = wrap.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width/2 - wRect.left) + 'px';
    tooltip.style.top = (rect.top - wRect.top) + 'px';
    el.style.opacity = '0.75';
    el.style.filter = 'brightness(1.15)';
  } else {
    tooltip.classList.add('hidden');
    el.style.opacity = '1';
    el.style.filter = '';
  }
}

function mapClickProvince(regionKey, provinceKey) {
  _selectedRegion = regionKey;
  _selectedProvince = provinceKey;
  // Highlight on map
  document.querySelectorAll('#thailandMap path').forEach(function(p) {
    p.style.opacity = (p.dataset.province === provinceKey) ? '1' : '0.35';
    p.style.strokeWidth = (p.dataset.province === provinceKey) ? '2.5' : '1';
    p.style.stroke = (p.dataset.province === provinceKey) ? '#1e293b' : '#fff';
  });
  _renderSelectedLeaders();
}

function mapResetHighlight() {
  document.querySelectorAll('#thailandMap path').forEach(function(p) {
    p.style.opacity = '1';
    p.style.strokeWidth = '1';
    p.style.stroke = '#fff';
  });
}

// ── Dropdown interactions (mobile) ─────────────────────────
function leadersRegionChanged() {
  var sel = document.getElementById('leadersRegionSelect');
  _selectedRegion = sel.value;
  _selectedProvince = '';
  var provSel = document.getElementById('leadersProvinceSelect');
  if (!provSel) return;
  var reg = FORUM_REGIONS.find(function(r){ return r.key === _selectedRegion; });
  if (reg && reg.provinces.length) {
    provSel.classList.remove('hidden');
    provSel.innerHTML = '<option value="">' + t('leaders_all_provinces') + '</option>' +
      reg.provinces.map(function(p) {
        return '<option value="' + p.key + '">' + (PROVINCE_TH[p.key] || '') + ' / ' + p.label + '</option>';
      }).join('');
  } else {
    provSel.classList.add('hidden');
    provSel.innerHTML = '';
  }
  _renderSelectedLeaders();
}

function leadersProvinceChanged() {
  var sel = document.getElementById('leadersProvinceSelect');
  _selectedProvince = sel.value;
  _renderSelectedLeaders();
}

// ── Render page ────────────────────────────────────────────
async function renderLeadersPage() {
  // Build map
  var mapEl = document.getElementById('thailandMap');
  if (mapEl) mapEl.innerHTML = _buildThailandSVG();

  // Populate mobile dropdowns
  var regSel = document.getElementById('leadersRegionSelect');
  if (regSel) {
    regSel.innerHTML = '<option value="">' + t('leaders_select_region') + '</option>' +
      FORUM_REGIONS.filter(function(r){ return r.key !== 'all'; }).map(function(r) {
        return '<option value="' + r.key + '">' + r.icon + ' ' + t(r.labelKey) + '</option>';
      }).join('');
  }

  // Load leaders data
  if (!_leadersLoaded) {
    try {
      var users = await authGetAllUsers();
      _leadersData = users.filter(function(u) { return u.role === 'region_leader'; });
      _leadersLoaded = true;
    } catch(e) {
      _leadersData = [];
    }
  }

  // Render accordion
  _renderLeadersAccordion();
  _renderSelectedLeaders();
}

// ── Selected leaders card ──────────────────────────────────
function _renderSelectedLeaders() {
  var el = document.getElementById('leadersSelected');
  if (!el) return;
  if (!_selectedRegion) { el.innerHTML = ''; return; }

  var filtered = _leadersData.filter(function(u) {
    if (!u.leader_region) return false;
    // National leaders
    if (u.leader_region === 'all') return true;
    // Regional level
    if (u.leader_region === _selectedRegion) return true;
    // Province level: "region:province"
    if (u.leader_region.indexOf(':') !== -1) {
      var parts = u.leader_region.split(':');
      if (parts[0] !== _selectedRegion) return false;
      if (_selectedProvince && parts[1] !== _selectedProvince) return false;
      return true;
    }
    return false;
  });

  var reg = FORUM_REGIONS.find(function(r){ return r.key === _selectedRegion; });
  var regionName = reg ? (reg.icon + ' ' + t(reg.labelKey)) : _selectedRegion;
  var provName = '';
  if (_selectedProvince && reg) {
    var prov = reg.provinces.find(function(p){ return p.key === _selectedProvince; });
    provName = prov ? (' > ' + (PROVINCE_TH[prov.key] || '') + ' / ' + prov.label) : '';
  }

  var html = '<div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">';
  html += '<div class="flex items-center justify-between mb-3">';
  html += '<p class="font-black text-sm text-slate-700">' + regionName + provName + '</p>';
  html += '<button onclick="_selectedRegion=\'\';_selectedProvince=\'\';mapResetHighlight();_renderSelectedLeaders()" class="text-[10px] text-slate-400 font-bold">' + t('leaders_clear') + '</button>';
  html += '</div>';

  if (!filtered.length) {
    html += '<p class="text-center text-slate-400 text-xs py-6">' + t('leaders_none') + '</p>';
  } else {
    html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-2">';
    filtered.forEach(function(u) {
      html += _leaderCard(u);
    });
    html += '</div>';
  }
  html += '</div>';
  el.innerHTML = html;
}

function _leaderCard(u) {
  var titleKey = _titleKeyToLabelKey(u.leader_title || '');
  var title = t(titleKey);
  var regionLabel = _resolveLeaderLabel(u.leader_region);
  return '<div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-3 border border-purple-100">' +
    '<div class="flex items-start gap-2.5">' +
      '<div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">' +
        '<span class="text-white font-black text-sm">' + (u.nickname ? u.nickname.charAt(0).toUpperCase() : '?') + '</span>' +
      '</div>' +
      '<div class="flex-1 min-w-0">' +
        '<p class="font-black text-slate-800 text-xs">' + escHtml(u.nickname || '') + '</p>' +
        '<p class="text-[10px] text-purple-600 font-bold">⭐ ' + title + '</p>' +
        '<p class="text-[9px] text-slate-400 font-medium mt-0.5">' + regionLabel + '</p>' +
        (u.clinic_name ? '<p class="text-[9px] text-slate-500 mt-1">🏥 ' + escHtml(u.clinic_name) + '</p>' : '') +
        (u.phone ? '<p class="text-[9px] text-slate-500">📞 ' + escHtml(u.phone) + '</p>' : '') +
        (u.email ? '<p class="text-[9px] text-slate-500">✉️ ' + escHtml(u.email) + '</p>' : '') +
      '</div>' +
    '</div>' +
  '</div>';
}

// ── Accordion: all leaders grouped by region > province ────
function _renderLeadersAccordion() {
  var el = document.getElementById('leadersAccordion');
  if (!el) return;
  var html = '<p class="font-black text-xs text-slate-400 uppercase tracking-widest mb-3">' + t('leaders_all_list') + '</p>';

  FORUM_REGIONS.forEach(function(reg) {
    if (reg.key === 'all') return;
    var color = REGION_COLORS[reg.key];
    // National leaders + regional + province leaders for this region
    var regionLeaders = _leadersData.filter(function(u) {
      if (!u.leader_region) return false;
      if (u.leader_region === reg.key) return true;
      if (u.leader_region.indexOf(':') !== -1 && u.leader_region.split(':')[0] === reg.key) return true;
      return false;
    });

    html += '<div class="mb-2">';
    html += '<button onclick="toggleAccordion(this)" class="w-full flex items-center justify-between px-4 py-3 rounded-xl font-black text-xs text-white transition active:scale-[.98]" style="background:' + color.base + '">';
    html += '<span>' + reg.icon + ' ' + t(reg.labelKey) + ' <span class="font-medium opacity-75">(' + regionLeaders.length + ')</span></span>';
    html += '<span class="accordion-arrow transition-transform text-sm">▼</span>';
    html += '</button>';
    html += '<div class="accordion-body hidden mt-1 space-y-1 pl-2">';

    if (!regionLeaders.length) {
      html += '<p class="text-xs text-slate-400 py-3 text-center">' + t('leaders_none') + '</p>';
    } else {
      // Group by province
      var byProvince = {};
      regionLeaders.forEach(function(u) {
        var pk = 'regional';
        if (u.leader_region.indexOf(':') !== -1) pk = u.leader_region.split(':')[1];
        if (!byProvince[pk]) byProvince[pk] = [];
        byProvince[pk].push(u);
      });
      // Regional-level first
      if (byProvince['regional']) {
        byProvince['regional'].forEach(function(u) { html += _leaderCard(u); });
      }
      // Then by province
      Object.keys(byProvince).forEach(function(pk) {
        if (pk === 'regional') return;
        var provLabel = PROVINCE_TH[pk] || pk.replace(/_/g,' ');
        html += '<p class="text-[10px] font-bold text-slate-500 mt-2 mb-1 pl-1">' + provLabel + '</p>';
        byProvince[pk].forEach(function(u) { html += _leaderCard(u); });
      });
    }

    html += '</div></div>';
  });

  // National leaders section
  var nationalLeaders = _leadersData.filter(function(u) { return u.leader_region === 'all'; });
  if (nationalLeaders.length) {
    html = '<div class="mb-3"><button onclick="toggleAccordion(this)" class="w-full flex items-center justify-between px-4 py-3 rounded-xl font-black text-xs text-white bg-gradient-to-r from-slate-700 to-slate-900 transition active:scale-[.98]">' +
      '<span>🇹🇭 ' + t('leader_level_all') + ' <span class="font-medium opacity-75">(' + nationalLeaders.length + ')</span></span>' +
      '<span class="accordion-arrow transition-transform text-sm">▼</span></button>' +
      '<div class="accordion-body hidden mt-1 space-y-1 pl-2">' +
      nationalLeaders.map(function(u) { return _leaderCard(u); }).join('') +
      '</div></div>' + html;
  }

  el.innerHTML = html;
}

function toggleAccordion(btn) {
  var body = btn.nextElementSibling;
  var arrow = btn.querySelector('.accordion-arrow');
  if (body.classList.contains('hidden')) {
    body.classList.remove('hidden');
    if (arrow) arrow.style.transform = 'rotate(180deg)';
  } else {
    body.classList.add('hidden');
    if (arrow) arrow.style.transform = '';
  }
}
