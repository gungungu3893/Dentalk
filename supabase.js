// ============================================================
// supabase.js — Supabase REST API 클라이언트 헬퍼
// Phase 2-#2: 회원가입/로그인 연동
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
// table: 테이블명, params: 쿼리 파라미터 문자열 (e.g. "nickname=eq.foo&is_active=eq.true")
async function sbGet(table, params) {
  var url = SUPABASE_URL + '/rest/v1/' + table + (params ? '?' + params : '');
  var res = await fetch(url, { headers: sbHeaders() });
  if (!res.ok) throw new Error('[sbGet] ' + table + ' HTTP ' + res.status);
  return res.json();
}

// ── POST (insert) ─────────────────────────────────────────────
async function sbPost(table, body) {
  var res = await fetch(SUPABASE_URL + '/rest/v1/' + table, {
    method:  'POST',
    headers: sbHeaders({ 'Prefer': 'return=minimal' }),
    body:    JSON.stringify(body),
  });
  return res; // 호출부에서 status 직접 확인
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
// Auth 헬퍼 — users 테이블 기반 (Supabase Auth 미사용)
// ============================================================

/**
 * 회원가입: users 테이블에 삽입
 * @returns {Response} fetch Response
 */
async function authRegister({ licenseNumber, doctorName, clinicName, contact, nickname, email, password }) {
  return sbPost('users', {
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

/**
 * 로그인: nickname + password로 users 테이블 조회
 * @returns {{ ok, user?, reason? }}
 */
async function authLogin(nickname, password) {
  try {
    var params =
      'nickname=eq.' + encodeURIComponent(nickname) +
      '&password=eq.' + encodeURIComponent(password) +
      '&select=license_number,doctor_name,clinic_name,nickname,email,phone,address,role,is_active';

    var data = await sbGet('users', params);
    if (!data.length) return { ok: false, reason: 'not_found' };

    var u = data[0];
    // admin이 아닌 일반 사용자는 is_active=true 필요
    if (u.role !== 'admin' && !u.is_active) return { ok: false, reason: 'not_active' };

    return {
      ok:         true,
      licenseNum: u.license_number || '',
      doctorName: u.doctor_name    || '',
      clinicName: u.clinic_name    || '',
      nickname:   u.nickname       || '',
      email:      u.email          || '',
      phone:      u.phone          || '',
      address:    u.address        || '',
      role:       u.role           || 'user',
    };
  } catch(e) {
    console.error('[authLogin]', e);
    return { ok: false, reason: 'network' };
  }
}

/**
 * 프로필 업데이트: users 테이블 PATCH
 */
async function authUpdateProfile(licenseNumber, fields) {
  return sbPatch('users', 'license_number=eq.' + encodeURIComponent(licenseNumber), fields);
}

/**
 * 관리자: users 테이블 전체 목록 조회
 */
async function authGetAllUsers() {
  return sbGet('users', 'select=license_number,nickname,clinic_name,doctor_name,email,phone,is_active,role&order=clinic_name.asc');
}

/**
 * 관리자: 사용자 활성화/비활성화
 */
async function authSetUserActive(nickname, isActive) {
  return sbPatch('users', 'nickname=eq.' + encodeURIComponent(nickname), { is_active: isActive });
}
