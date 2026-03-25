// events.js — 이벤트 + 모임
// ============================================================
// EVENTS
// ============================================================
function renderEvents() {
  var el = document.getElementById('eventList');
  if (!el) return;
  if (!events_.length) {
    el.innerHTML = '<div class="text-center py-16"><p class="text-4xl mb-3 opacity-30">📅</p><p class="font-black text-slate-400 text-sm mb-1">' + t('empty_events') + '</p><p class="text-xs text-slate-300">' + t('empty_events_sub') + '</p></div>';
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
          '<p class="font-black text-slate-800 text-sm leading-snug">' + escHtml(e.event) + '</p>' +
          '<p class="text-xs text-slate-400 font-bold mt-1">📍 ' + escHtml(e.loc) + '</p>' +
          '<div class="flex items-center gap-1.5 flex-wrap text-[9px] text-slate-300 font-bold mt-1">' +
            (e.createdBy ? '<span class="text-slate-500 font-black">' + escHtml(e.createdBy) + '</span><span>·</span>' : '') +
            '<span>👁 ' + (e.views||0) + '</span>' +
            (rsvpCount !== '' ? '<span>·</span><span class="text-green-600 font-black">👥 ' + rsvpCount + '</span>' : '') +
          '</div>' +
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
    var sbId = String(ev._sbId || ev.id);
    if (!sbId || sbId === 'undefined' || sbId === 'null') continue;
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
  // 조회수 증가
  ev.views = (ev.views||0) + 1;
  if (typeof id === 'string') {
    sbUpdateEvent(id, { views: ev.views }).catch(function(){});
  }
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
  var sbId = String(ev._sbId || ev.id);
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
  if (!sbId || sbId === 'undefined' || sbId === 'null') {
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
            '<span class="font-black text-xs text-slate-700">' + escHtml(a.nickname) + '</span>' +
            '<span class="text-[10px] text-slate-400">' + escHtml(a.clinic || '') + '</span>' +
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
    console.error('[RSVP Load] Error:', e.message || e);
    handleSupabaseError(e, 'RSVP Load');
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
  var sbId = String(ev._sbId || ev.id);
  if (!sbId || sbId === 'undefined' || sbId === 'null') {
    console.error('[RSVP] Invalid event ID:', sbId);
    showToast(t('rsvp_error'), 'error');
    return;
  }
  try {
    console.log('[RSVP] Upserting:', { eventId: sbId, userId: currentUser.nickname, status: status });
    await sbUpsertRsvp(sbId, currentUser.nickname, status);
    _updateRsvpButtons(status);
    _loadEventDetailRsvp(ev);
    // LINE 알림: 이벤트 주최자에게 RSVP 알림 (참석 시에만, 본인 이벤트가 아닐 때)
    if (status === 'attending' && ev.createdBy && ev.createdBy !== currentUser.nickname) {
      sendLinePushText(ev.createdBy, '📅 ' + (ev.event || '') + ' — มีผู้สมัครเข้าร่วมใหม่\nNew RSVP for ' + (ev.event || '') + '.');
    }
  } catch(e) {
    console.error('[RSVP] Error:', e.message || e);
    handleSupabaseError(e, 'RSVP');
    showToast(t('rsvp_error'), 'error');
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
  if (!title || !date || !loc) { showToast(t('meetup_fill_alert'), 'warning'); return; }
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
  } catch(e) { handleSupabaseError(e, 'Meetup Save'); }
}
