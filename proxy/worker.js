// Forma API Proxy — Cloudflare Worker
// Sits between the app and Anthropic so the API key never leaves the server.
//
// ADDING A GATE LATER:
//   Insert an auth check right after the origin check (marked below with
//   "── FUTURE GATE ──"). Check a token, session cookie, or JWT there and
//   return 401 if the user is not allowed. Everything else stays the same.

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

const ALLOWED_ORIGINS = [
  'https://bonarellim-ux.github.io',
  'http://localhost',
  'http://127.0.0.1',
];

const MAX_BODY_BYTES = 200_000; // 200 KB — prevents runaway payloads

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return isAllowedOrigin(origin) ? reply(null, 204, origin) : reply('Forbidden', 403, origin);
    }

    if (request.method !== 'POST') {
      return reply('Method not allowed', 405, origin);
    }

    // ── ORIGIN CHECK (first abuse layer) ─────────────────────────
    // Stops casual scrapers. Not spoofproof — the gate below will be.
    if (!isAllowedOrigin(origin)) {
      return reply('Forbidden', 403, origin);
    }

    if (!env.ANTHROPIC_API_KEY) {
      return reply('Proxy missing ANTHROPIC_API_KEY secret', 500, origin);
    }

    // ── FUTURE GATE ───────────────────────────────────────────────
    // When you add auth, insert here:
    //
    //   const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    //   const valid = await verifyToken(token, env); // your auth logic
    //   if (!valid) return reply('Unauthorized', 401, origin);
    //
    // ─────────────────────────────────────────────────────────────

    // Body size guard
    const body = await readBody(request);
    if (!body) return reply('Request too large or unreadable', 413, origin);

    // Forward to Anthropic
    let upstream;
    try {
      upstream = await fetch(ANTHROPIC_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body,
      });
    } catch {
      return reply('Upstream unreachable', 502, origin);
    }

    const data = await upstream.text();
    return new Response(data, {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(origin),
      },
    });
  },
};

async function readBody(request) {
  try {
    const text = await request.text();
    return text.length <= MAX_BODY_BYTES ? text : null;
  } catch {
    return null;
  }
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': isAllowedOrigin(origin) ? origin : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function reply(body, status, origin) {
  return new Response(body, {
    status,
    headers: corsHeaders(origin),
  });
}

function isAllowedOrigin(origin) {
  try {
    const url = new URL(origin);
    if (url.protocol === 'https:' && url.hostname === 'bonarellim-ux.github.io') return true;
    if (url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) return true;
  } catch {
    return false;
  }
  return false;
}
