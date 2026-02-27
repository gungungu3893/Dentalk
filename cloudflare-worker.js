// Cloudflare Worker - LINE Messaging API CORS 프록시
// 배포 방법: https://dash.cloudflare.com → Workers & Pages → Create → 코드 붙여넣기

const LINE_CHANNEL_ACCESS_TOKEN = '/ZN4flK2594gd7p12claNHltTtRT5CqQDpNoqsPO2jesr7/WVvGSSQPswM6ZyKvG8xqmmjXEa4QsqoAHYdqLSUPTakIczQ7ZBT+vOhVNN3IaquxmhlttCr+Gcs5oMi5RWbv1hHoRCCXxLwcbzu+5eAdB04t89/1O/w1cDnyilFU=';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const body = await request.json();

    const lineRes = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return new Response(JSON.stringify({ ok: lineRes.ok, status: lineRes.status }), {
      status: lineRes.ok ? 200 : lineRes.status,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  },
};
