// jobs.js — 구인구직
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
          '<p class="font-black text-slate-800 text-sm leading-snug mb-1 truncate">' + escHtml(j.title) + '</p>' +
          '<div class="flex items-center gap-2 text-[9px] text-slate-300 font-bold">' +
            (j.salary_range ? '<span class="text-green-500 font-black">' + escHtml(j.salary_range) + '</span><span>·</span>' : '') +
            '<span>' + dateStr + '</span>' +
            '<span>·</span>' +
            '<span>' + escHtml(j.user_id || '') + '</span>' +
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
  if (!title || !desc) { showToast(t('job_fill_alert'), 'warning'); return; }
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
  } catch(e) { handleSupabaseError(e, 'Job Save'); }
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
        '<p class="font-black text-xs text-slate-800 truncate">' + escHtml(j.title) + '</p>' +
        '<p class="text-[9px] text-slate-400">' + t(typeCfg.labelKey) + ' · ' + escHtml(j.user_id || '') + '</p>' +
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

