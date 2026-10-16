/**
 * Cloudflare Worker for the Industrial Solutions site.
 *
 *  1. Serves the built React site (client/dist) as static assets, with SPA
 *     fallback for client-side routes such as /about.
 *  2. Handles the enquiry form same-origin (no CORS): POST /api/enquiries is
 *     emailed to you via the Brevo transactional email API.
 *
 * Worker variables (dashboard -> Settings -> Variables and secrets):
 *   BREVO_API_KEY  (Secret)   your Brevo API key  (SMTP & API -> API Keys)
 *   BREVO_SENDER   (Variable) a sender email VERIFIED in Brevo
 *                             (Senders & IP -> verify a sender or your domain)
 *   BREVO_TO       (Variable) where enquiries are delivered
 *                             (defaults to industrialsolutions2015@gmail.com)
 *
 * (Legacy fallbacks WEB3FORMS_KEY / SHEET_WEBHOOK_URL / API_ORIGIN still work
 *  if set, but Brevo takes priority.)
 */
const DEFAULT_TO = 'industrialsolutions2015@gmail.com';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    if (url.pathname === '/api/health') {
      const store = env.BREVO_API_KEY ? 'brevo'
        : env.WEB3FORMS_KEY ? 'web3forms'
        : env.SHEET_WEBHOOK_URL ? 'sheet'
        : env.API_ORIGIN ? 'api' : 'none';
      return json({ ok: true, store });
    }

    // ---- Enquiry -> email via Brevo ------------------------------------
    if (url.pathname === '/api/enquiries' && method === 'POST' && env.BREVO_API_KEY) {
      let data = {};
      try { data = JSON.parse((await request.text()) || '{}'); } catch (e) { data = {}; }

      if (data.website) return json({ ok: true }); // honeypot

      const required = ['fullName', 'phone', 'email', 'productOrService', 'requirements'];
      for (const f of required) {
        if (!String(data[f] || '').trim()) return json({ ok: false, message: 'Please fill all required fields.' }, 400);
      }

      const to = env.BREVO_TO || DEFAULT_TO;
      const sender = env.BREVO_SENDER || to; // MUST be a verified Brevo sender

      const text = [
        'New website enquiry',
        '-------------------------------',
        'Name: ' + (data.fullName || '-'),
        'Company/Institution: ' + (data.organisation || '-'),
        'Phone: ' + (data.phone || '-'),
        'Email: ' + (data.email || '-'),
        'Product/Service: ' + (data.productOrService || '-'),
        'Quantity: ' + (data.quantity || '-'),
        'Location: ' + (data.location || '-'),
        '',
        'Requirements:',
        (data.requirements || '-'),
      ].join('\n');

      const payload = {
        sender: { name: 'Industrial Solutions Website', email: sender },
        to: [{ email: to }],
        subject: 'New enquiry: ' + (data.fullName || 'Website') + (data.productOrService ? ' — ' + data.productOrService : ''),
        textContent: text,
      };
      if (data.email) {
        payload.replyTo = data.fullName ? { email: data.email, name: data.fullName } : { email: data.email };
      }

      try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', 'accept': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) return json({ ok: true }); // 201 Created
        const err = await res.json().catch(() => ({}));
        return json({ ok: false, message: err.message || 'Could not send your enquiry right now. Please try WhatsApp.' }, 502);
      } catch (e) {
        return json({ ok: false, message: 'Could not reach the email service. Please try WhatsApp.' }, 502);
      }
    }

    // ---- Legacy fallback: Web3Forms ------------------------------------
    if (url.pathname === '/api/enquiries' && method === 'POST' && env.WEB3FORMS_KEY) {
      let data = {};
      try { data = JSON.parse((await request.text()) || '{}'); } catch (e) { data = {}; }
      if (data.website) return json({ ok: true });
      const payload = {
        access_key: env.WEB3FORMS_KEY,
        subject: `New enquiry: ${data.fullName || 'Website'}${data.productOrService ? ' — ' + data.productOrService : ''}`,
        from_name: 'Industrial Solutions Website',
        name: data.fullName || '', email: data.email || '', phone: data.phone || '',
        organisation: data.organisation || '', product_or_service: data.productOrService || '',
        quantity: data.quantity || '', location: data.location || '', requirements: data.requirements || '',
      };
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload),
        });
        const out = await res.json().catch(() => ({}));
        return (res.ok && out.success) ? json({ ok: true }) : json({ ok: false, message: out.message || 'Could not send your enquiry.' }, 502);
      } catch (e) {
        return json({ ok: false, message: 'Could not reach the email service. Please try WhatsApp.' }, 502);
      }
    }

    // ---- Legacy fallback: Google Apps Script sheet ---------------------
    if (url.pathname === '/api/enquiries' && method === 'POST' && env.SHEET_WEBHOOK_URL) {
      const body = await request.text();
      try {
        const upstream = await fetch(env.SHEET_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, redirect: 'follow' });
        const t = await upstream.text();
        return new Response(t, { status: upstream.ok ? 200 : 502, headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        return json({ ok: false, message: 'Could not save your enquiry right now. Please try WhatsApp.' }, 502);
      }
    }

    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      return json({ ok: false, message: 'Enquiry service is not configured.' }, 503);
    }

    return env.ASSETS.fetch(request);
  },
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
