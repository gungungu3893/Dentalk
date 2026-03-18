// custom.js — CNC 커스텀 주문 Wizard + 중고마켓
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
    if (!wizardData.teethSet.size) { showToast(t('wiz_no_tooth_err'), 'warning'); return; }
  } else if (wizardStep === 2) {
    // save sizes
    Array.from(wizardData.teethSet).forEach(function(tn) {
      var sEl = document.getElementById('wiz-size-' + tn);
      if (sEl) wizardData.teethSizes[tn] = sEl.value.trim();
    });
    if (!wizardData.brand) { showToast(t('wiz_no_brand_err'), 'warning'); return; }
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
  if (!clinic || !addr || !phone) { showToast(t('err_fill_delivery'), 'warning'); return; }
  var teeth = Array.from(wizardData.teethSet).sort(function(a,b){return a-b;});
  if (!teeth.length) { showToast(t('wiz_no_tooth_err'), 'warning'); return; }
  if (!wizardData.brand) { showToast(t('wiz_no_brand_err'), 'warning'); return; }
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
    } catch(e) { /* STL parse error - non-critical */ }
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
  showToast(msg, 'success');
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
  if (!clinic||!addr||!phone) { showToast(t('err_fill_delivery'), 'warning'); return; }
  var cases = []; var caseStlFiles = [];
  for (var i=1; i<=caseCount; i++) {
    if (!document.getElementById('case-'+i)) continue;
    var selectedTeeth = caseTeeth[i] ? Array.from(caseTeeth[i]).sort(function(a,b){return a-b;}) : [];
    if (!selectedTeeth.length) { showToast(tf('err_select_tooth', i), 'warning'); return; }
    var teethData = [];
    var valid = true;
    for (var ti=0; ti<selectedTeeth.length; ti++) {
      var tn = selectedTeeth[ti];
      var brand = (document.getElementById('tb-'+i+'-'+tn)||{}).value || '';
      var size  = ((document.getElementById('ts-'+i+'-'+tn)||{}).value || '').trim();
      if (!brand||!size) { showToast(tf('err_fill_tooth', i, tn), 'warning'); valid=false; break; }
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
  if (!cases.length) { showToast(t('err_add_case'), 'warning'); return; }
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
          // Storage upload failed, using base64 fallback
        }
      } catch(e) { /* Storage upload failed, using base64 fallback */ }
      // ② Storage 실패 시 base64 fallback
      if (!stlUrl) {
        stlUrl = await new Promise(function(resolve) {
          var reader = new FileReader();
          reader.onload = function(ev) {
            var result = ev.target.result;
            // base64 data URI가 너무 크면 (>3MB) Supabase 저장이 어려우므로 경고
            if (result && result.length > 3 * 1024 * 1024) {
              // File too large for inline base64 storage
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
  showToast(msg, 'success');
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
      showToast('[LINE] status: ' + res.status, 'error');
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
    showToast(t('err_network'), 'error');
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
  if (!name||!price||!contact) { showToast(t('used_fill_error'), 'warning'); return; }
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
