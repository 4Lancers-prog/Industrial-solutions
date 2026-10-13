/**
 * Cloudflare Worker for industrialsolutions.com
 *
 * Responsibilities:
 *  1. Serve the built React site (client/dist) as static assets, including the
 *     SPA fallback for client-side routes such as /about.
 *  2. Reverse-proxy every /api/* request to the Express backend (hosted on a
 *     Node platform such as Render/Railway/Fly). This keeps the browser on a
 *     single origin (https://industrialsolutions.com) so there is NO CORS and
 *     the frontend can simply call "/api/...".
 *
 * The Express/Mongoose backend is unchanged — this Worker only forwards to it.
 *
 * Config:
 *  - env.ASSETS      : binding to the static assets in ./dist (see wrangler.jsonc)
 *  - env.API_ORIGIN  : backend origin, e.g. https://industrial-solutions-api.onrender.com
 *                      Set it with:  npx wrangler secret put API_ORIGIN
 *                      (or as a plain var in wrangler.jsonc / the dashboard).
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // --- API traffic -> Express backend ---------------------------------
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      const origin = env.API_ORIGIN;
      if (!origin) {
        return new Response(
          JSON.stringify({ ok: false, message: 'API_ORIGIN is not configured on the Worker.' }),
          { status: 502, headers: { 'content-type': 'application/json' } }
        );
      }

      // Keep the full path (/api/...) and query string; swap only the origin.
      const target = new URL(origin);
      target.pathname = url.pathname;
      target.search = url.search;

      // Forward headers, adding the real visitor IP so express-rate-limit and
      // logging on the backend see the client rather than the proxy.
      const headers = new Headers(request.headers);
      const clientIp = request.headers.get('CF-Connecting-IP');
      if (clientIp) headers.set('X-Forwarded-For', clientIp);
      headers.set('X-Forwarded-Proto', 'https');
      headers.set('X-Forwarded-Host', url.host);

      const method = request.method.toUpperCase();
      const hasBody = method !== 'GET' && method !== 'HEAD';
      const body = hasBody ? await request.arrayBuffer() : undefined;

      return fetch(target.toString(), { method, headers, body, redirect: 'manual' });
    }

    // --- Everything else -> static frontend (with SPA fallback) ----------
    return env.ASSETS.fetch(request);
  },
};
