// Cloudflare Worker - LINE Messaging API Proxy + Webhook Handler
// 배포: https://dash.cloudflare.com → Workers & Pages → Create → 코드 붙여넣기
//
// 환경변수 설정 (Workers Settings → Variables):
//   LINE_CHANNEL_ACCESS_TOKEN  — LINE Bot channel access token
//   LINE_CHANNEL_SECRET        — LINE Bot channel secret (Webhook 서명 검증용)
//   SUPABASE_URL               — https://ikdlgnpjcmwbsrxvoxvd.supabase.co
//   SUPABASE_ANON_KEY          — Supabase anon/public key

// ─── Fallback: 환경변수 미설정 시 기존 하드코딩 토큰 사용 ──────────
const FALLBACK_LINE_TOKEN = 'vVTYd8PJYzKe7+zLZf0nJbPD+WJxYPuWmdB8AaE8Y9fVhc0r590qrP7pvLy4erUn8xqmmjXEa4QsqoAHYdqLSUPTakIczQ7ZBT+vOhVNN3JxmmzGHsEqdkv6A0YsJ4k4GJuChH15tK8OnqDtwoNoLgdB04t89/1O/w1cDnyilFU=';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ─── Webhook 환영 메시지 (태국어 + 영어) ──────────────────────────
const WELCOME_MESSAGE = {
  type: 'flex',
  altText: 'ยินดีต้อนรับสู่ Dentalk! Welcome to Dentalk!',
  contents: {
    type: 'bubble',
    hero: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'text', text: '🦷 Dentalk', size: 'xl', weight: 'bold', color: '#D4AF37', align: 'center' },
        { type: 'text', text: 'BIOTEM × BIOPLANT', size: 'xxs', color: '#888888', align: 'center', margin: 'xs' },
      ],
      paddingAll: '20px',
      backgroundColor: '#001d4a',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'text', text: 'ยินดีต้อนรับสู่ Dentalk! 🎉', weight: 'bold', size: 'md', wrap: true },
        { type: 'text', text: 'ระบบสั่งซื้อชิ้นส่วนรากฟันเทียมดิจิทัลสำหรับคลินิกทันตกรรมในประเทศไทย', size: 'xs', color: '#666666', wrap: true, margin: 'md' },
        { type: 'separator', margin: 'lg' },
        { type: 'text', text: '📋 วิธีรับการแจ้งเตือนคำสั่งซื้อ:', weight: 'bold', size: 'sm', margin: 'lg' },
        { type: 'text', text: '① สมัครสมาชิกที่แอป Dentalk\n② ลงทะเบียน Line ID ในโปรไฟล์\n③ รับแจ้งเตือนสถานะคำสั่งซื้อทาง Line', size: 'xs', color: '#555555', wrap: true, margin: 'sm' },
        { type: 'separator', margin: 'lg' },
        { type: 'text', text: 'Welcome to Dentalk! 🎉', weight: 'bold', size: 'sm', margin: 'lg' },
        { type: 'text', text: 'To receive order notifications:\n① Sign up on the Dentalk app\n② Register your LINE ID in your profile\n③ Get order status updates via LINE', size: 'xs', color: '#555555', wrap: true, margin: 'sm' },
        { type: 'separator', margin: 'lg' },
        { type: 'text', text: '📌 알림을 받으시려면 이 채팅에 아무 메시지 하나를 보내주세요!\nPlease send any message here to activate notifications!\nส่งข้อความใดก็ได้เพื่อเปิดใช้งานการแจ้งเตือน!', size: 'xs', color: '#D4AF37', weight: 'bold', wrap: true, margin: 'lg' },
      ],
      paddingAll: '16px',
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'button',
          action: { type: 'uri', label: '🦷 เปิด Dentalk / Open Dentalk', uri: 'https://dentalk.app/' },
          style: 'primary',
          color: '#001d4a',
        },
      ],
      paddingAll: '12px',
    },
  },
};

// ─── Helper: LINE Access Token ────────────────────────────────────
function getLineToken(env) {
  return (env && env.LINE_CHANNEL_ACCESS_TOKEN) || FALLBACK_LINE_TOKEN;
}

// ─── Helper: LINE Push Message ────────────────────────────────────
async function linePushMessage(token, to, messages) {
  return fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to, messages: Array.isArray(messages) ? messages : [messages] }),
  });
}

// ─── Helper: LINE Reply Message ───────────────────────────────────
async function lineReplyMessage(token, replyToken, messages) {
  return fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ replyToken, messages: Array.isArray(messages) ? messages : [messages] }),
  });
}

// ─── Helper: Supabase REST API ────────────────────────────────────
async function supabaseRequest(env, path, method, body) {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return null;
  const url = env.SUPABASE_URL + '/rest/v1/' + path;
  const headers = {
    'apikey': env.SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + env.SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    'Prefer': method === 'POST' ? 'resolution=merge-duplicates' : 'return=minimal',
  };
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (method === 'GET' && res.ok) return res.json();
  return { ok: res.ok, status: res.status };
}

// ─── Helper: Save LINE userId to Supabase ─────────────────────────
async function saveLineUserId(env, userId, displayName) {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return;
  // 먼저 이 line_user_id로 이미 등록된 사용자가 있는지 확인
  const existing = await supabaseRequest(env, 'licenses?line_user_id=eq.' + userId + '&select=license_number', 'GET');
  if (existing && existing.length > 0) return; // 이미 등록됨
  // line_user_id로 등록된 유저가 없으면, displayName으로 닉네임 매칭 시도
  if (displayName) {
    const byNick = await supabaseRequest(env, 'licenses?nickname=eq.' + encodeURIComponent(displayName) + '&line_user_id=is.null&select=license_number', 'GET');
    if (byNick && byNick.length > 0) {
      // 닉네임이 일치하는 유저에 line_user_id 업데이트
      await supabaseRequest(env, 'licenses?license_number=eq.' + byNick[0].license_number, 'PATCH', { line_user_id: userId });
      return;
    }
  }
  // 매칭 안 되면 별도 테이블에 기록 (나중에 수동 매칭)
  await supabaseRequest(env, 'line_pending_users', 'POST', {
    line_user_id: userId,
    display_name: displayName || null,
    created_at: new Date().toISOString(),
  });
}

// ─── Helper: Extract nickname from message text ───────────────────
async function matchLineUserByMessage(env, userId, text) {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY || !text) return;
  const trimmed = text.trim();
  // 사용자가 닉네임을 보내면 매칭 시도
  if (trimmed.length >= 2 && trimmed.length <= 50) {
    const byNick = await supabaseRequest(env, 'licenses?nickname=eq.' + encodeURIComponent(trimmed) + '&line_user_id=is.null&select=license_number,nickname', 'GET');
    if (byNick && byNick.length > 0) {
      await supabaseRequest(env, 'licenses?license_number=eq.' + byNick[0].license_number, 'PATCH', { line_user_id: userId });
      // 매칭 성공시 pending에서 제거
      await supabaseRequest(env, 'line_pending_users?line_user_id=eq.' + userId, 'DELETE');
      return byNick[0].nickname;
    }
  }
  return null;
}

// ─── Helper: LINE User Profile ────────────────────────────────────
async function getLineProfile(token, userId) {
  try {
    const res = await fetch('https://api.line.me/v2/bot/profile/' + userId, {
      headers: { 'Authorization': 'Bearer ' + token },
    });
    if (res.ok) return res.json();
  } catch (e) { /* ignore */ }
  return null;
}

// ─── Webhook 서명 검증 (HMAC-SHA256) ──────────────────────────────
async function verifySignature(secret, body, signature) {
  if (!secret || !signature) return true; // secret 미설정 시 검증 스킵
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const expected = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return expected === signature;
}

// ═════════════════════════════════════════════════════════════════
// Main Worker Handler
// ═════════════════════════════════════════════════════════════════
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ─── CORS Preflight ──────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // ─── GET /health — 상태 확인 ─────────────────────────────
    if (request.method === 'GET' && (path === '/health' || path === '/')) {
      return new Response(JSON.stringify({ status: 'ok', service: 'dentalk-line-worker' }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // ─── POST /webhook — LINE Webhook 수신 ───────────────────
    if (request.method === 'POST' && path === '/webhook') {
      const rawBody = await request.text();

      // 서명 검증
      const signature = request.headers.get('x-line-signature');
      const secret = env && env.LINE_CHANNEL_SECRET;
      if (secret) {
        const valid = await verifySignature(secret, rawBody, signature);
        if (!valid) {
          return new Response(JSON.stringify({ error: 'Invalid signature' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      let body;
      try { body = JSON.parse(rawBody); } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const token = getLineToken(env);
      const events = body.events || [];

      for (const event of events) {
        const userId = event.source && event.source.userId;
        if (!userId) continue;

        // ── follow: 친구 추가 ────────────────────────────────
        if (event.type === 'follow') {
          // 프로필 조회
          const profile = await getLineProfile(token, userId);
          const displayName = profile && profile.displayName;
          // Supabase에 userId 저장/매칭
          await saveLineUserId(env, userId, displayName);
          // 환영 메시지 발송 (replyToken 사용)
          if (event.replyToken) {
            await lineReplyMessage(token, event.replyToken, WELCOME_MESSAGE);
          }
        }

        // ── message: 메시지 수신 ─────────────────────────────
        if (event.type === 'message') {
          if (event.message && event.message.type === 'text') {
            const text = event.message.text;
            // 닉네임 매칭 시도
            const matched = await matchLineUserByMessage(env, userId, text);
            if (matched && event.replyToken) {
              await lineReplyMessage(token, event.replyToken, {
                type: 'text',
                text: '✅ เชื่อมต่อสำเร็จ! / Connected!\n\nบัญชี LINE ของคุณเชื่อมต่อกับ "' + matched + '" เรียบร้อยแล้ว คุณจะได้รับแจ้งเตือนคำสั่งซื้อทาง LINE\n\nYour LINE account is now linked to "' + matched + '". You will receive order notifications via LINE.',
              });
            } else if (!matched && event.replyToken) {
              // 매칭 안 됨 — 환영 메시지 발송
              await lineReplyMessage(token, event.replyToken, {
                type: 'text',
                text: '🦷 ยินดีต้อนรับสู่ Dentalk! Welcome to Dentalk!\nสั่งซื้อผ่านแอปแล้วรับการแจ้งเตือนผ่าน LINE\n\n📌 알림을 받으시려면 이 채팅에 아무 메시지 하나를 보내주세요!\nPlease send any message here to activate notifications!\nส่งข้อความใดก็ได้เพื่อเปิดใช้งานการแจ้งเตือน!\n\n🔗 https://dentalk.app',
              });
            }
          } else if (event.replyToken) {
            // 텍스트가 아닌 메시지 (이미지, 스티커 등) — 환영 메시지 발송
            await lineReplyMessage(token, event.replyToken, {
              type: 'text',
              text: '🦷 ยินดีต้อนรับสู่ Dentalk! Welcome to Dentalk!\nสั่งซื้อผ่านแอปแล้วรับการแจ้งเตือนผ่าน LINE\n\n📌 알림을 받으시려면 이 채팅에 아무 메시지 하나를 보내주세요!\nPlease send any message here to activate notifications!\nส่งข้อความใดก็ได้เพื่อเปิดใช้งานการแจ้งเตือน!\n\n🔗 https://dentalk.app',
            });
          }
        }
      }

      // LINE Webhook은 항상 200 OK를 반환해야 함
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ─── POST /push (기존) — Push Message 프록시 ─────────────
    if (request.method === 'POST' && (path === '/push' || path === '/')) {
      const body = await request.json();
      const token = getLineToken(env);

      const lineRes = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      return new Response(JSON.stringify({ ok: lineRes.ok, status: lineRes.status }), {
        status: lineRes.ok ? 200 : lineRes.status,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // ─── 404 ─────────────────────────────────────────────────
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
