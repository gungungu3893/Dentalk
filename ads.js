// ads.js — 광고 배너 시스템
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
  el.innerHTML = dtLoaderHtml();

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

  var posOptions = ['home_top','home_mid','forum_top','shop_bottom','mobile_bottom','mobile_mid'].map(function(p) {
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
            '<p class="font-black text-xs text-slate-800 truncate">' + escHtml(b.advertiser_name || '-') + '</p>' +
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
    showToast(t('admin_ads_fill_alert'), 'warning');
    return;
  }
  if (!advertiser || !position) {
    showToast(t('admin_ads_fill_alert'), 'warning');
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
      showToast(t('admin_ads_update_success'), 'success');
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
    handleSupabaseError(e, 'AdminAd');
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
    handleSupabaseError(e, 'AdminAd');
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
    handleSupabaseError(e, 'AdminAd');
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
  var positions = ['home_top', 'home_mid', 'forum_top', 'shop_bottom', 'mobile_bottom', 'mobile_mid'];
  await Promise.all(positions.map(async function(pos) {
    try {
      var rows = await sbGetBannersByPosition(pos);
      _adBanners[pos] = rows || [];
    } catch(e) {
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
  // 모바일 배너
  renderMobileBottomAd();
  renderMobileMidAds();
}

// ============================================================
// MOBILE AD BANNERS
// ============================================================

// ── 하단 고정 배너 (mobile_bottom) ──
function renderMobileBottomAd() {
  var wrap = document.getElementById('mobileBottomAd');
  var content = document.getElementById('mobileBottomAdContent');
  if (!wrap || !content) return;
  // 데스크톱이면 숨김
  if (window.innerWidth >= 1024) { wrap.style.display = 'none'; return; }
  // 세션에서 닫은 경우
  if (sessionStorage.getItem('dentalk_mobile_ad_closed')) { wrap.style.display = 'none'; return; }
  var banners = _adBanners['mobile_bottom'] || [];
  if (!banners.length) { wrap.style.display = 'none'; return; }
  var b = banners[0]; // 첫 번째 활성 배너
  content.innerHTML =
    '<img src="' + b.image_url + '" alt="' + escHtml(b.advertiser_name || 'Ad') + '" onclick="onAdBannerClick(\'' + b.id + '\',\'' + (b.link_url || '').replace(/'/g, "\\'") + '\')" loading="lazy">';
  wrap.style.display = '';
  _trackAdImpression(b.id);
}

function closeMobileBottomAd() {
  var wrap = document.getElementById('mobileBottomAd');
  if (wrap) wrap.style.display = 'none';
  sessionStorage.setItem('dentalk_mobile_ad_closed', '1');
}

// ── 콘텐츠 사이 중간 배너 (mobile_mid) ──
function renderMobileMidAds() {
  var slots = ['mobileAdMid1', 'mobileAdMid2'];
  var banners = _adBanners['mobile_mid'] || [];
  // 데스크톱이면 숨김
  if (window.innerWidth >= 1024) {
    slots.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) { el.classList.add('hidden'); el.innerHTML = ''; }
    });
    return;
  }
  slots.forEach(function(slotId, idx) {
    var el = document.getElementById(slotId);
    if (!el) return;
    var b = banners[idx] || banners[0]; // 배너가 1개면 양쪽에 같은 것
    if (!b) { el.classList.add('hidden'); el.innerHTML = ''; return; }
    el.classList.remove('hidden');
    el.innerHTML =
      '<div class="mobile-mid-banner" onclick="onAdBannerClick(\'' + b.id + '\',\'' + (b.link_url || '').replace(/'/g, "\\'") + '\')">' +
        '<img src="' + b.image_url + '" alt="' + escHtml(b.advertiser_name || 'Ad') + '" loading="lazy">' +
        '<span class="ad-tag">' + t('ad_label') + '</span>' +
      '</div>';
    _trackAdImpression(b.id);
  });
}

