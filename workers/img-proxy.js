export default {
  async fetch(request) {
    const reqUrl = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    const targetUrl = reqUrl.searchParams.get('url');
    if (!targetUrl) {
      return json(400, { error: 'Missing url' });
    }
    let target;
    try {
      target = new URL(targetUrl);
    } catch (_) {
      return json(400, { error: 'Invalid url' });
    }
    if (!/^https?:$/.test(target.protocol)) {
      return json(400, { error: 'Only http/https allowed' });
    }

    try {
      const upstream = await fetch(target.toString(), {
        redirect: 'follow',
        headers: {
          'Referer': '',
          'User-Agent': 'World-radios-APP/1.0 (+cloudflare worker)'
        }
      });
      if (!upstream.ok) {
        return json(upstream.status, { error: `Upstream error ${upstream.status}` });
      }

      // Stream back the body with proper headers
      const headers = new Headers(upstream.headers);
      // Normalize content-type and caching
      const contentType = headers.get('content-type') || 'application/octet-stream';
      headers.set('Content-Type', contentType);
      headers.set('Cache-Control', 'public, max-age=3600');
      // CORS
      const cors = corsHeaders();
      for (const [k, v] of Object.entries(cors)) headers.set(k, v);

      return new Response(upstream.body, { status: 200, headers });
    } catch (err) {
      return json(500, { error: 'Proxy failure', details: String(err && err.message || err) });
    }
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };
}

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    }
  });
}
