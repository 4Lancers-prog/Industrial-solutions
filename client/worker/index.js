/**
 * Cloudflare Worker for the Industrial Solutions site.
 *
 *  1. Serves the built React site (client/dist) as static assets, with SPA
 *     fallback for client-side routes such as /about.
 *  2. Handles the enquiry API same-origin (no CORS in the browser):
 *       - POST /api/enquiries -> forwarded to a Google Apps Script Web App
 *         that appends a row to a Google Sheet (set env.SHEET_WEBHOOK_URL).
 *       - If SHEET_WEBHOOK_URL is not set, falls back to proxying /api/* to an
 *         Express backend at env.API_ORIGIN (for the MongoDB option).
 *       - GET /api/health -> simple status.
 *
 * Variables (set in the dashboard or wrangler.jsonc):
 *   SHEET_WEBHOOK_URL  (optional)  the Apps Script /exec URL
 *   API_ORIGIN         (optional)  an Express backend origin
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    // Health check.
    if (url.pathname === '/api/health') {
      return json({ ok: true, store: env.SHEET_WEBHOOK_URL ? 'sheet' : (env.API_ORIGIN ? 'api' : 'none') });
    }

    // Enquiry -> Google Sheet (via Apps Script), server-to-server.
    if (url.pathname === '/api/enquiries' && method === 'POST' && env.SHEET_WEBHOOK_URL) {
      const body = await request.text();
      try {
        const upstream = await fetch(env.SHEET_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          redirect: 'follow', // Apps Script 302-redirects to its content host
        });
        const text = await upstream.text();
        // Pass the Apps Script JSON straight back to the browser.
        return new Response(text, {
          status: upstream.ok ? 200 : 502,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return json({ ok: false, message: 'Could not save your enquiry right now. Please try WhatsApp.' }, 502);
      }
    }

    // Fallback: proxy any /api/* to an Express backend if one is configured.
    if ((url.pathname === '/api' || url.pathname.startsWith('/api/')) && env.API_ORIGIN) {
      const target = new URL(env.API_ORIGIN);
      target.pathname = url.pathname;
      target.search = url.search;
      const headers = new Headers(request.headers);
      const clientIp = request.headers.get('CF-Connecting-IP');
      if (clientIp) headers.set('X-Forwarded-For', clientIp);
      headers.set('X-Forwarded-Proto', 'https');
      headers.set('X-Forwarded-Host', url.host);
      const hasBody = method !== 'GET' && method !== 'HEAD';
      const reqBody = hasBody ? await request.arrayBuffer() : undefined;
      return fetch(target.toString(), { method, headers, body: reqBody, redirect: 'manual' });
    }

    // No backend configured for an API call.
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      return json({ ok: false, message: 'Enquiry service is not configured.' }, 503);
    }

    // Everything else -> static frontend (with SPA fallback).
    return env.ASSETS.fetch(request);
  },
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
