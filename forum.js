// forum.js — 포럼 + 지역 커뮤니티
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
    var _fcCfg = FORUM_CATEGORIES.find(function(x){ return x.key === p.category; }) || {};
    var _fcGrad = {'implant':'from-blue-400 to-blue-600','prosthetic':'from-amber-400 to-amber-600','conservative':'from-green-400 to-green-600','orthodontics':'from-cyan-400 to-cyan-600','oral_surgery':'from-red-400 to-red-600','periodontics':'from-emerald-400 to-emerald-600','pediatric':'from-pink-400 to-pink-600','radiology':'from-indigo-400 to-indigo-600','oral_medicine':'from-violet-400 to-violet-600','preventive':'from-teal-400 to-teal-600','general':'from-slate-400 to-slate-600'};
    var thumbHtml = hasImg
      ? '<div class="relative shrink-0">' +
          '<img src="' + p.images[0] + '" class="w-[72px] h-[72px] rounded-2xl object-cover" loading="lazy">' +
          (imgCount > 1 ? '<span class="absolute bottom-1 right-1 text-[9px] font-black bg-black/60 text-white px-1.5 py-0.5 rounded-full">+' + (imgCount - 1) + '</span>' : '') +
        '</div>'
      : '<div class="w-[56px] h-[56px] rounded-2xl bg-gradient-to-br ' + (_fcGrad[p.category] || 'from-slate-400 to-slate-600') + ' flex items-center justify-center shrink-0">' +
          '<span class="text-2xl opacity-90">' + (_fcCfg.icon || '💬') + '</span>' +
        '</div>';
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
          '<p class="font-black text-slate-800 text-sm leading-snug mb-1 line-clamp-2">' + escHtml(p.title) + '</p>' +
          '<p class="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-2">' + escHtml(p.body) + '</p>' +
          '<div class="flex items-center gap-2 text-[10px] text-slate-300 font-bold">' +
            '<span class="text-slate-500 font-black">' + escHtml(p.author) + '</span>' +
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
        '<span class="text-xs font-black text-slate-700">' + escHtml(c.author) + '</span>' +
        '<span class="text-[10px] text-slate-300">' + escHtml(c.date) + '</span>' +
      '</div>' +
      '<p class="text-sm text-slate-600 leading-relaxed">' + escHtml(c.text) + '</p>' +
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
  // LINE 알림: 글 작성자에게 댓글 알림 (자기 글에 자기가 댓글 달면 발송 안 함)
  if (post.author && post.author !== auth) {
    sendLinePushText(post.author, '💬 회원님의 글에 새 댓글이 달렸습니다.\nNew comment on your post.\nมีความคิดเห็นใหม่ในโพสต์ของคุณ\n\n📝 ' + escHtml(post.title));
  }
}
