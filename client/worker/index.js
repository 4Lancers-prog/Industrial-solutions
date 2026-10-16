/**
 * Cloudflare Worker for the Industrial Solutions site.
 *
 *  1. Serves the built React site (client/dist) as static assets, with SPA
 *     fallback for client-side routes such as /about.
 *  2. Handles the enquiry form same-origin (no CORS in the browser):
 *       POST /api/enquiries -> emailed to you via Web3Forms.
 *
 * Variables (set on the Worker, dashboard or wrangler.jsonc):
 *   WEB3FORMS_KEY   your Web3Forms access key (free from https://web3forms.com)
 *                   The key is tied to the email address that receives enquiries.
 *
 * (Optional legacy fallback: SHEET_WEBHOOK_URL / API_ORIGIN still work if set,
 *  but WEB3FORMS_KEY takes priority.)
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    // Health check.
    if (url.pathname === '/api/health') {
      const store = env.WEB3FORMS_KEY ? 'email' : (env.SHEET_WEBHOOK_URL ? 'sheet' : (env.API_ORIGIN ? 'api' : 'none'));
      return json({ ok: true, store });
    }

    // Enquiry -> email (Web3Forms), server-to-server, same-origin for the browser.
    if (url.pathname === '/api/enquiries' && method === 'POST' && env.WEB3FORMS_KEY) {
      let data = {};
      try { data = JSON.parse(await request.text() || '{}'); } catch (e) { data = {}; }

      // Honeypot: real visitors never fill the hidden "website" field.
      if (data.website) return json({ ok: true });

      // Minimal required-field check.
      const required = ['fullName', 'phone', 'email', 'productOrService', 'requirements'];
      for (const f of required) {
        if (!String(data[f] || '').trim()) {
          return json({ ok: false, message: 'Please fill all required fields.' }, 400);
        }
      }

      const payload = {
        access_key: env.WEB3FORMS_KEY,
        subject: `New enquiry: ${data.fullName || 'Website'}${data.productOrService ? ' — ' + data.productOrService : ''}`,
        from_name: 'Industrial Solutions Website',
        // reply-to is set from the "email" field by Web3Forms
        name: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        organisation: data.organisation || '',
        product_or_service: data.productOrService || '',
        quantity: data.quantity || '',
        location: data.location || '',
        requirements: data.requirements || '',
      };

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
        });
        const out = await res.json().catch(() => ({}));
        if (res.ok && out.success) return json({ ok: true });
        return json({ ok: false, message: out.message || 'Could not send your enquiry right now. Please try WhatsApp.' }, 502);
      } catch (err) {
        return json({ ok: false, message: 'Could not reach the email service. Please try WhatsApp.' }, 502);
      }
    }

    // Optional legacy fallback: forward /api/enquiries to a Google Apps Script sheet.
    if (url.pathname === '/api/enquiries' && method === 'POST' && env.SHEET_WEBHOOK_URL) {
      const body = await request.text();
      try {
        const upstream = await fetch(env.SHEET_WEBHOOK_URL, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body, redirect: 'follow',
        });
        const text = await upstream.text();
        return new Response(text, { status: upstream.ok ? 200 : 502, headers: { 'Content-Type': 'application/json' } });
      } catch (err) {
        return json({ ok: false, message: 'Could not save your enquiry right now. Please try WhatsApp.' }, 502);
      }
    }

    // Optional legacy fallback: proxy any /api/* to an Express backend.
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
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
