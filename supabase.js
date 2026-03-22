// ============================================================
// supabase.js — Supabase REST API 클라이언트 헬퍼
// Phase 3: 전체 데이터 Supabase 연동 (대시보드)
// ============================================================

const SUPABASE_URL      = 'https://ikdlgnpjcmwbsrxvoxvd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZGxnbnBqY213YnNyeHZveHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMTA0MDYsImV4cCI6MjA4NzU4NjQwNn0.amIky4WslMDFBv30n9hcdJx-CWFBOdRvLR9rqwET-_o';

// ── 기본 헤더 ─────────────────────────────────────────────────
function sbHeaders(extra) {
  var h = {
    'apikey':        SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'Content-Type':  'application/json',
  };
  if (extra) Object.assign(h, extra);
  return h;
}

// ── GET ───────────────────────────────────────────────────────
async function sbGet(table, params) {
  var url = SUPABASE_URL + '/rest/v1/' + table + (params ? '?' + params : '');
  var res = await fetch(url, { headers: sbHeaders() });
  if (!res.ok) {
    var detail = '';
    try { var body = await res.json(); detail = body.message || body.hint || JSON.stringify(body); } catch(e) {}
    throw new Error('[sbGet] ' + table + ' HTTP ' + res.status + (detail ? ' — ' + detail : ''));
  }
  return res.json();
}

// ── POST (insert) ─────────────────────────────────────────────
async function sbPost(table, body) {
  var res = await fetch(SUPABASE_URL + '/rest/v1/' + table, {
    method:  'POST',
    headers: sbHeaders({ 'Prefer': 'return=minimal' }),
    body:    JSON.stringify(body),
  });
  return res;
}

// ── PATCH (update) ────────────────────────────────────────────
async function sbPatch(table, params, body) {
  var res = await fetch(SUPABASE_URL + '/rest/v1/' + table + '?' + params, {
    method:  'PATCH',
    headers: sbHeaders({ 'Prefer': 'return=minimal' }),
    body:    JSON.stringify(body),
  });
  return res;
}

// ── DELETE ────────────────────────────────────────────────────
async function sbDelete(table, params) {
  var res = await fetch(SUPABASE_URL + '/rest/v1/' + table + '?' + params, {
    method:  'DELETE',
    headers: sbHeaders({ 'Prefer': 'return=minimal' }),
  });
  return res;
}

// ============================================================
// Auth 헬퍼 — licenses 테이블 기반 (Supabase Auth 미사용)
// ============================================================

async function authRegister({ licenseNumber, doctorName, clinicName, contact, nickname, email, password }) {
  return sbPost('licenses', {
    license_number: licenseNumber,
    doctor_name:    doctorName,
    clinic_name:    clinicName,
    contact:        contact,
    nickname:       nickname,
    email:          email,
    password:       password,
    is_active:      false,
    role:           'user',
  });
}

async function authLogin(nickname, password) {
  try {
    // RPC 호출: 서버에서 bcrypt 비교 (비밀번호가 클라이언트로 노출되지 않음)
    var res = await fetch(SUPABASE_URL + '/rest/v1/rpc/login_user', {
      method:  'POST',
      headers: sbHeaders(),
      body:    JSON.stringify({ p_nickname: nickname, p_password: password }),
    });
    if (!res.ok) throw new Error('[authLogin] RPC HTTP ' + res.status);
    var data = await res.json();

    if (!data.length) return { ok: false, reason: 'not_found' };

    var u = data[0];
    if (u.role !== 'admin' && u.role !== 'region_leader' && !u.is_active) return { ok: false, reason: 'not_active' };

    return {
      ok:            true,
      licenseNum:    u.license_number || '',
      doctorName:    u.doctor_name    || '',
      clinicName:    u.clinic_name    || '',
      nickname:      u.nickname       || '',
      email:         u.email          || '',
      phone:         u.phone          || '',
      address:       u.address        || '',
      role:          u.role           || 'user',
      leaderRegion:  u.leader_region  || '',
      leaderTitle:   u.leader_title   || '',
    };
  } catch(e) {
    console.error('[authLogin]', e);
    return { ok: false, reason: 'network' };
  }
}

async function authUpdateProfile(licenseNumber, fields) {
  return sbPatch('licenses', 'license_number=eq.' + encodeURIComponent(licenseNumber), fields);
}

async function authGetAllUsers() {
  return sbGet('licenses', 'select=license_number,nickname,clinic_name,doctor_name,email,phone,is_active,role,leader_region,leader_title&order=clinic_name.asc');
}

async function authSetUserRole(nickname, role, leaderRegion, leaderTitle) {
  var body = { role: role };
  if (leaderRegion !== undefined) body.leader_region = leaderRegion;
  if (leaderTitle !== undefined) body.leader_title = leaderTitle;
  return sbPatch('licenses', 'nickname=eq.' + encodeURIComponent(nickname), body);
}

async function authSetUserActive(nickname, isActive) {
  return sbPatch('licenses', 'nickname=eq.' + encodeURIComponent(nickname), { is_active: isActive });
}

// ============================================================
// Custom Orders (CNC 맞춤 보철) — custom_orders 테이블
// ============================================================

async function sbSaveCustomOrder(order, casesData) {
  var body = {
    id:              order.id,
    user_nickname:   order.userNickname,
    clinic:          order.clinic,
    addr:            order.addr,
    phone:           order.phone,
    line_id:         order.lineId,
    cases:           casesData !== undefined ? casesData : (order.cases || []),
    stage:           order.stage,
    design_versions: order.designVersions || [],
    review_history:  order.reviewHistory  || [],
    date:            order.date,
  };
  return fetch(SUPABASE_URL + '/rest/v1/custom_orders', {
    method:  'POST',
    headers: sbHeaders({ 'Prefer': 'return=minimal' }),
    body:    JSON.stringify(body),
  });
}

async function sbGetCustomOrders(userNickname, isAdmin, page) {
  var limit = 20;
  var offset = ((page || 1) - 1) * limit;
  var params = 'select=id,user_nickname,clinic,addr,phone,line_id,cases,stage,design_versions,review_history,date,carrier,tracking_number&order=date.desc&limit=' + limit + '&offset=' + offset;
  if (!isAdmin && userNickname) params += '&user_nickname=eq.' + encodeURIComponent(userNickname);
  return sbGet('custom_orders', params);
}

async function sbUpdateCustomOrder(orderId, updates) {
  var body = {};
  if (updates.stage           !== undefined) body.stage           = updates.stage;
  if (updates.designVersions  !== undefined) body.design_versions = updates.designVersions;
  if (updates.reviewHistory   !== undefined) body.review_history  = updates.reviewHistory;
  if (updates.carrier         !== undefined) body.carrier         = updates.carrier;
  if (updates.trackingNumber  !== undefined) body.tracking_number = updates.trackingNumber;
  if (updates.cases           !== undefined) body.cases           = updates.cases;
  return sbPatch('custom_orders', 'id=eq.' + encodeURIComponent(orderId), body);
}

// ============================================================
// Shop Orders (쇼핑몰 주문) — orders 테이블
// ============================================================

async function sbSaveShopOrder(order) {
  return sbPost('orders', {
    id:            order.id,
    user_nickname: order.nickname || '',
    clinic:        order.clinic,
    addr:          order.address,
    phone:         order.phone,
    line_id:       order.lineId || '',
    items:         order.items  || [],
    stage:         order.stage  || 'submitted',
    date:          order.date,
  });
}

async function sbGetShopOrders(userNickname, isAdminUser, page) {
  var limit = 20;
  var offset = ((page || 1) - 1) * limit;
  var params = 'select=id,user_nickname,clinic,addr,phone,line_id,items,stage,date,carrier,tracking_number,created_at&order=created_at.desc&limit=' + limit + '&offset=' + offset;
  if (!isAdminUser && userNickname) params += '&user_nickname=eq.' + encodeURIComponent(userNickname);
  return sbGet('orders', params);
}

async function sbUpdateShopOrder(orderId, updates) {
  var body = {};
  if (updates.stage           !== undefined) body.stage           = updates.stage;
  if (updates.carrier         !== undefined) body.carrier         = updates.carrier;
  if (updates.tracking_number !== undefined) body.tracking_number = updates.tracking_number;
  return sbPatch('orders', 'id=eq.' + encodeURIComponent(orderId), body);
}

// ============================================================
// Used Items (중고 거래) — used_items 테이블
// ============================================================

async function sbGetUsedItems(page) {
  var limit = 20;
  var offset = ((page || 1) - 1) * limit;
  return sbGet('used_items', 'select=id,seller,name,code,price,condition,description,contact,views,image_url,created_at&order=created_at.desc&limit=' + limit + '&offset=' + offset);
}

async function sbSaveUsedItem(item) {
  var res = await fetch(SUPABASE_URL + '/rest/v1/used_items', {
    method:  'POST',
    headers: sbHeaders({ 'Prefer': 'return=representation' }),
    body:    JSON.stringify({
      seller:      item.seller,
      name:        item.name,
      code:        item.code        || '',
      price:       item.price       || 0,
      condition:   item.cond        || 'good',
      description: item.desc        || '',
      contact:     item.contact     || '',
      views:       0,
      image_url:   item.image       || null,
    }),
  });
  if (!res.ok) throw new Error('[sbSaveUsedItem] HTTP ' + res.status);
  var rows = await res.json();
  return rows[0];
}

async function sbDeleteUsedItem(id) {
  return sbDelete('used_items', 'id=eq.' + encodeURIComponent(id));
}

async function sbUpdateUsedItem(id, updates) {
  return sbPatch('used_items', 'id=eq.' + encodeURIComponent(id), updates);
}

// ============================================================
// Forum Posts (커뮤니티) — forum_posts 테이블
// ============================================================

async function sbGetForumPosts(page) {
  var limit = 20;
  var offset = ((page || 1) - 1) * limit;
  return sbGet('forum_posts', 'select=id,author,category,region,province,title,body,images,views,comments,date,is_pinned,created_at&order=created_at.desc&limit=' + limit + '&offset=' + offset);
}

async function sbSaveForumPost(post) {
  var res = await fetch(SUPABASE_URL + '/rest/v1/forum_posts', {
    method:  'POST',
    headers: sbHeaders({ 'Prefer': 'return=representation' }),
    body:    JSON.stringify({
      author:   post.author,
      category: post.category || 'general',
      region:   post.region   || 'all',
      province: post.province || 'all',
      title:    post.title,
      body:     post.body,
      images:   post.images   || [],
      views:    0,
      comments: post.comments || [],
      date:     post.date     || new Date().toISOString().slice(0,10),
    }),
  });
  if (!res.ok) throw new Error('[sbSaveForumPost] HTTP ' + res.status);
  var rows = await res.json();
  return rows[0];
}

async function sbDeleteForumPost(id) {
  return sbDelete('forum_posts', 'id=eq.' + encodeURIComponent(id));
}

async function sbUpdateForumPost(id, updates) {
  return sbPatch('forum_posts', 'id=eq.' + encodeURIComponent(id), updates);
}

// ============================================================
// Events (이벤트/세미나) — events 테이블
// ============================================================

async function sbGetEvents(page) {
  var limit = 20;
  var offset = ((page || 1) - 1) * limit;
  return sbGet('events', 'select=id,title,location,event_date,description,created_by,type,region,created_at&order=event_date.asc&limit=' + limit + '&offset=' + offset);
}

async function sbSaveEvent(ev) {
  var res = await fetch(SUPABASE_URL + '/rest/v1/events', {
    method:  'POST',
    headers: sbHeaders({ 'Prefer': 'return=representation' }),
    body:    JSON.stringify({
      title:       ev.event,
      location:    ev.loc,
      event_date:  ev.date,
      description: ev.desc      || null,
      created_by:  ev.createdBy || null,
      type:        ev.type      || 'event',
      region:      ev.region    || 'all',
    }),
  });
  if (!res.ok) throw new Error('[sbSaveEvent] HTTP ' + res.status);
  var rows = await res.json();
  return rows[0];
}

async function sbDeleteEvent(id) {
  return sbDelete('events', 'id=eq.' + encodeURIComponent(id));
}

async function sbUpdateEvent(id, updates) {
  return sbPatch('events', 'id=eq.' + encodeURIComponent(id), updates);
}

// ============================================================
// Events RSVP (참석 관리) — events_rsvp 테이블
// ============================================================

async function sbGetEventRsvps(eventId) {
  return sbGet('events_rsvp', 'event_id=eq.' + encodeURIComponent(eventId) + '&select=id,event_id,user_id,status,created_at');
}

async function sbUpsertRsvp(eventId, userId, status) {
  // Supabase upsert: on conflict(event_id, user_id)
  var res = await fetch(SUPABASE_URL + '/rest/v1/events_rsvp', {
    method:  'POST',
    headers: sbHeaders({ 'Prefer': 'return=representation,resolution=merge-duplicates' }),
    body:    JSON.stringify({ event_id: eventId, user_id: userId, status: status }),
  });
  if (!res.ok) throw new Error('[sbUpsertRsvp] HTTP ' + res.status);
  var rows = await res.json();
  return rows[0];
}

async function sbDeleteRsvp(eventId, userId) {
  return sbDelete('events_rsvp', 'event_id=eq.' + encodeURIComponent(eventId) + '&user_id=eq.' + encodeURIComponent(userId));
}

async function sbGetRsvpAttendees(eventId) {
  // Join: rsvp user_id → licenses nickname, clinic_name
  var rsvps = await sbGet('events_rsvp', 'event_id=eq.' + encodeURIComponent(eventId) + '&status=eq.attending&select=user_id,created_at');
  if (!rsvps || !rsvps.length) return [];
  // Fetch user info for attendees
  var nicks = rsvps.map(function(r){ return r.user_id; });
  var users = await sbGet('licenses', 'nickname=in.(' + nicks.map(encodeURIComponent).join(',') + ')&select=nickname,clinic_name');
  var userMap = {};
  (users || []).forEach(function(u){ userMap[u.nickname] = u; });
  return rsvps.map(function(r) {
    var u = userMap[r.user_id] || {};
    return { nickname: r.user_id, clinic: u.clinic_name || '', date: r.created_at };
  });
}

// ============================================================
// Webzine Articles (웹진) — webzine_articles 테이블
// ============================================================

async function sbGetWebzineArticles(page) {
  var limit = 20;
  var offset = ((page || 1) - 1) * limit;
  return sbGet('webzine_articles', 'select=id,category,title,body_md,thumbnail_url,author_id,views,is_published,created_at&is_published=eq.true&order=created_at.desc&limit=' + limit + '&offset=' + offset);
}

async function sbSaveWebzineArticle(article) {
  var res = await fetch(SUPABASE_URL + '/rest/v1/webzine_articles', {
    method:  'POST',
    headers: sbHeaders({ 'Prefer': 'return=representation' }),
    body:    JSON.stringify({
      category:      article.category  || 'news',
      title:         article.title,
      body_md:       article.body_md   || '',
      thumbnail_url: article.thumbnail_url || null,
      author_id:     article.author_id || null,
      views:         0,
      is_published:  article.is_published !== false,
    }),
  });
  if (!res.ok) throw new Error('[sbSaveWebzineArticle] HTTP ' + res.status);
  var rows = await res.json();
  return rows[0];
}

async function sbUpdateWebzineArticle(id, updates) {
  return sbPatch('webzine_articles', 'id=eq.' + encodeURIComponent(id), updates);
}

async function sbDeleteWebzineArticle(id) {
  return sbDelete('webzine_articles', 'id=eq.' + encodeURIComponent(id));
}

// ============================================================
// Jobs (구인구직) — jobs 테이블
// ============================================================

async function sbGetJobs(page) {
  var limit = 20;
  var offset = ((page || 1) - 1) * limit;
  return sbGet('jobs', 'select=id,user_id,type,region,province,title,description,salary_range,requirements,contact,is_active,created_at&is_active=eq.true&order=created_at.desc&limit=' + limit + '&offset=' + offset);
}

async function sbSaveJob(job) {
  var res = await fetch(SUPABASE_URL + '/rest/v1/jobs', {
    method:  'POST',
    headers: sbHeaders({ 'Prefer': 'return=representation' }),
    body:    JSON.stringify({
      user_id:      job.user_id      || null,
      type:         job.type         || 'dentist_hire',
      region:       job.region       || null,
      province:     job.province     || null,
      title:        job.title,
      description:  job.description  || '',
      salary_range: job.salary_range || null,
      requirements: job.requirements || null,
      contact:      job.contact      || null,
      is_active:    job.is_active !== false,
    }),
  });
  if (!res.ok) throw new Error('[sbSaveJob] HTTP ' + res.status);
  var rows = await res.json();
  return rows[0];
}

async function sbUpdateJob(id, updates) {
  return sbPatch('jobs', 'id=eq.' + encodeURIComponent(id), updates);
}

async function sbDeleteJob(id) {
  return sbDelete('jobs', 'id=eq.' + encodeURIComponent(id));
}

// ============================================================
// Banners (광고 배너) — banners 테이블
// ============================================================

async function sbGetBanners() {
  return sbGet('banners', 'select=id,advertiser_name,image_url,link_url,position,start_date,end_date,is_active,clicks,impressions,created_at&is_active=eq.true&order=created_at.desc');
}

async function sbGetAllBanners() {
  return sbGet('banners', 'select=id,advertiser_name,image_url,link_url,position,start_date,end_date,is_active,clicks,impressions,created_at&order=created_at.desc');
}

async function sbGetBannersByPosition(position) {
  var today = new Date().toISOString().slice(0, 10);
  return sbGet('banners',
    'is_active=eq.true' +
    '&position=eq.' + encodeURIComponent(position) +
    '&start_date=lte.' + today +
    '&end_date=gte.' + today +
    '&order=created_at.desc'
  );
}

async function sbSaveBanner(banner) {
  var res = await fetch(SUPABASE_URL + '/rest/v1/banners', {
    method:  'POST',
    headers: sbHeaders({ 'Prefer': 'return=representation' }),
    body:    JSON.stringify({
      advertiser_name: banner.advertiser_name || '',
      image_url:       banner.image_url,
      link_url:        banner.link_url || '',
      position:        banner.position || 'home_top',
      start_date:      banner.start_date || new Date().toISOString().slice(0, 10),
      end_date:        banner.end_date || '',
      is_active:       banner.is_active !== false,
    }),
  });
  if (!res.ok) throw new Error('[sbSaveBanner] HTTP ' + res.status);
  var rows = await res.json();
  return rows[0];
}

async function sbUpdateBanner(id, updates) {
  return sbPatch('banners', 'id=eq.' + encodeURIComponent(id), updates);
}

async function sbDeleteBanner(id) {
  return sbDelete('banners', 'id=eq.' + encodeURIComponent(id));
}

async function sbBannerClick(id) {
  return fetch(SUPABASE_URL + '/rest/v1/rpc/increment_banner_clicks', {
    method:  'POST',
    headers: sbHeaders(),
    body:    JSON.stringify({ banner_id: id }),
  });
}

async function sbBannerImpression(id) {
  return fetch(SUPABASE_URL + '/rest/v1/rpc/increment_banner_impressions', {
    method:  'POST',
    headers: sbHeaders(),
    body:    JSON.stringify({ banner_id: id }),
  });
}

// ============================================================
// 통합 검색 — 여러 테이블 동시 검색
// ============================================================

async function sbSearchAll(keyword) {
  var encoded = encodeURIComponent('%' + keyword + '%');
  var results = { forum: [], webzine: [], jobs: [], used: [] };
  try {
    var queries = [
      sbGet('forum_posts', 'select=id,title,author,category,created_at&title=ilike.' + encoded + '&order=created_at.desc&limit=10'),
      sbGet('webzine_articles', 'select=id,title,category,thumbnail_url,created_at&is_published=eq.true&title=ilike.' + encoded + '&order=created_at.desc&limit=10'),
      sbGet('jobs', 'select=id,title,type,region,created_at&is_active=eq.true&title=ilike.' + encoded + '&order=created_at.desc&limit=10'),
      sbGet('used_items', 'select=id,name,price,seller,image_url,created_at&name=ilike.' + encoded + '&order=created_at.desc&limit=10'),
    ];
    var res = await Promise.allSettled(queries);
    if (res[0].status === 'fulfilled') results.forum   = res[0].value || [];
    if (res[1].status === 'fulfilled') results.webzine = res[1].value || [];
    if (res[2].status === 'fulfilled') results.jobs    = res[2].value || [];
    if (res[3].status === 'fulfilled') results.used    = res[3].value || [];
  } catch(e) { /* search error - return partial results */ }
  return results;
}

// ============================================================
// Notifications (알림) — notifications 테이블
// ============================================================

async function sbGetNotifications(userId, page) {
  var limit = 20;
  var offset = ((page || 1) - 1) * limit;
  return sbGet('notifications', 'select=id,user_id,type,title,body,link,is_read,created_at&user_id=eq.' + encodeURIComponent(userId) + '&order=created_at.desc&limit=' + limit + '&offset=' + offset);
}

async function sbMarkNotifRead(notifId) {
  return sbPatch('notifications', 'id=eq.' + encodeURIComponent(notifId), { is_read: true });
}

async function sbMarkAllNotifsRead(userId) {
  return sbPatch('notifications', 'user_id=eq.' + encodeURIComponent(userId) + '&is_read=eq.false', { is_read: true });
}

async function sbGetUnreadNotifCount(userId) {
  var res = await fetch(SUPABASE_URL + '/rest/v1/notifications?user_id=eq.' + encodeURIComponent(userId) + '&is_read=eq.false&select=id', {
    method: 'HEAD',
    headers: sbHeaders({ 'Prefer': 'count=exact' }),
  });
  var count = res.headers.get('content-range');
  if (count) {
    var parts = count.split('/');
    return parseInt(parts[1]) || 0;
  }
  return 0;
}

async function sbCreateNotification(notif) {
  return sbPost('notifications', {
    user_id:   notif.user_id,
    type:      notif.type    || 'info',
    title:     notif.title,
    body:      notif.body    || '',
    link:      notif.link    || '',
    is_read:   false,
  });
}

// ============================================================
// Reviews (리뷰/평점)
// ============================================================

async function sbGetReviews(productId) {
  return sbGet('reviews', 'select=id,user_id,product_id,rating,comment,created_at&product_id=eq.' + encodeURIComponent(productId) + '&order=created_at.desc&limit=50');
}

async function sbPostReview(review) {
  return sbPost('reviews', {
    user_id:    review.user_id,
    product_id: review.product_id,
    rating:     review.rating,
    comment:    review.comment || '',
  });
}

async function sbDeleteReview(reviewId) {
  return sbDelete('reviews', 'id=eq.' + encodeURIComponent(reviewId));
}

async function sbCheckUserReview(userId, productId) {
  var result = await sbGet('reviews', 'select=id&user_id=eq.' + encodeURIComponent(userId) + '&product_id=eq.' + encodeURIComponent(productId) + '&limit=1');
  return result && result.length > 0;
}

// ============================================================
// 통계 (Admin Dashboard Stats)
// ============================================================

async function sbGetOrderStats() {
  return sbGet('orders', 'select=id,items,stage,date,created_at&order=created_at.desc&limit=500');
}

async function sbGetAllUsersCount() {
  var res = await fetch(SUPABASE_URL + '/rest/v1/licenses?select=license_number&status=eq.active', {
    method: 'GET',
    headers: sbHeaders(),
  });
  return (await res.json()) || [];
}
