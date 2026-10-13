# Deployment — Industrial Solutions

Production architecture, exact configs, and step-by-step deployment.

```
                      User
                        |
                        v
        https://industrialsolutions.com   (Cloudflare DNS + Worker)
                        |
            +-----------+-----------+
            |                       |
            v                       v
     static frontend           /api/*  (proxied by the Worker)
     (React build in                |
      client/dist, served           v
      by the Worker)        Express backend on a Node host
                                     |
                                     v
                              MongoDB Atlas
```

Everything is on **one origin**, so the frontend just calls `/api/...` — no CORS.
The Express + Mongoose backend is unchanged; a thin Cloudflare Worker serves the
built site and forwards `/api/*` to it.

---

## 1. Root cause of the blank page (`text/html` module error)

The site was deployed as **static assets only**, with SPA fallback. When the
browser requested a JavaScript module it couldn't be matched to a real file
(stale/missing asset, or because nothing but a static-asset handler was
present), so the SPA fallback returned `index.html` — HTML — in its place. A
`<script type="module">` that receives `text/html` is rejected:

> Failed to load module script: Expected a JavaScript-or-Wasm module script but
> the server responded with a MIME type of "text/html".

With the browser unable to load the app's JS, the page renders blank.

## 2. Root cause of the `/api` 404

That static-only deployment had **no backend behind the domain**. Cloudflare
static assets cannot run Express/Mongoose, so every `/api/*` request had nothing
to answer it and returned 404. The Vite `proxy` in `vite.config.js` only works
for `npm run dev`; it does nothing in production.

## 3. The fix

- A **Cloudflare Worker** (`client/worker/index.js`) now owns the domain. It
  serves the static frontend via the `ASSETS` binding (correct MIME types, SPA
  fallback for `/about` etc.) and reverse-proxies `/api/*` to the Express
  backend. Because the Worker owns `/api/*`, the SPA fallback never intercepts
  the API, and real assets are served as themselves (never replaced by
  `index.html`).
- The **Express backend** is deployed to a Node host (Render / Railway / Fly /
  a VPS) and connected to **MongoDB Atlas**. No code logic changed.
- The frontend calls the API **same-origin** (`VITE_API_URL` empty → `/api`).

---

## 4. Files that were modified

| File | Change |
|---|---|
| `client/worker/index.js` | **New.** Serves assets + proxies `/api/*` to `API_ORIGIN`. |
| `client/wrangler.jsonc` | Added `main` (the Worker) and `assets.binding`; documented `API_ORIGIN`. |
| `client/src/config/site.js` | `apiBase` now defaults to `/api` (same-origin). |
| `client/src/components/EnquiryForm.jsx` | Calls `${apiBase}/enquiries` (was `${apiBase}/api/enquiries`, which double-prefixed `/api`). |
| `client/.env.example` | Clear PUBLIC build-time vars; same-origin guidance. |
| `server/src/index.js` | `app.set('trust proxy', 1)` so rate-limiting sees the real client IP; serves `client/dist` with correct caching + SPA fallback; clear message if no build. |
| `server/.env.example` | Atlas + secret guidance; production placeholders. |
| `.gitignore`, `client/.gitignore`, `server/.gitignore` | Ignore `.env` and `.env.*` (keep `.env.example`), `.wrangler`, `.dev.vars`. |

No API routes, Mongoose models, validation, auth, or UI were changed.

---

## 5. Environment variables

### Frontend (build-time, PUBLIC — baked into the JS bundle)
| Var | Value | Notes |
|---|---|---|
| `VITE_API_URL` | *(empty)* | Same-origin `/api`. Only set it if the API is on another host. |
| `VITE_SITE_URL` | `https://industrialsolutions.com` | Used for meta/OG tags. |

### Cloudflare Worker (runtime)
| Var | Value | Notes |
|---|---|---|
| `API_ORIGIN` | `https://<your-backend-host>` | The deployed Express origin. Prefer a Secret: `npx wrangler secret put API_ORIGIN`. |

### Backend (runtime — set on the Node host, NOT in the frontend)
| Var | Public/Secret | Value |
|---|---|---|
| `MONGODB_URI` | **Secret** | Atlas SRV string. |
| `ADMIN_TOKEN` | **Secret** | Long random value (`openssl rand -hex 32`). |
| `CLIENT_ORIGIN` | Public | `https://industrialsolutions.com` |
| `PORT` | Public | Usually injected by the host; keep `5000` locally. |

> `MONGODB_URI` and `ADMIN_TOKEN` must **never** be `VITE_` variables — anything
> prefixed `VITE_` is shipped to the browser.

---

## 6. MongoDB Atlas

1. Create a free/shared cluster.
2. **Database Access** → add a user with a strong password.
3. **Network Access** → allow your backend host's egress IPs. If the host uses
   dynamic IPs, `0.0.0.0/0` works but is less strict; prefer the host's
   documented static/egress IPs where available.
4. Copy the SRV connection string into the backend's `MONGODB_URI`, adding the
   db name: `.../industrial_solutions?retryWrites=true&w=majority`.

---

## 7. Deploy the backend (Express) to a Node host

Using Render as the worked example (Railway/Fly/VPS are equivalent):

1. New **Web Service** from the repo, **Root Directory** `server`.
2. Build command: `npm install` · Start command: `npm start`.
3. Env vars: `MONGODB_URI`, `ADMIN_TOKEN`, `CLIENT_ORIGIN=https://industrialsolutions.com`.
4. Deploy. Note the service URL, e.g. `https://industrial-solutions-api.onrender.com`.
5. Verify: `curl https://<backend-host>/api/health` → `{"ok":true,"database":"connected"}`.

## 8. Deploy the frontend + Worker (Cloudflare)

From `client/`:

```bash
npm install
# point the Worker at the backend from step 7:
npx wrangler secret put API_ORIGIN      # paste https://<backend-host>
npm run deploy                           # = vite build && wrangler deploy
```

`npm run deploy` always builds first, so the source is never deployed.

## 9. Cloudflare DNS

- **Same-origin (recommended, this setup):** attach `industrialsolutions.com`
  (and `www`) to the Worker under **Workers & Pages → your Worker → Custom
  domains**. Cloudflare creates the needed proxied records automatically. No
  separate API record is required.
- **Separate subdomain (alternative):** if you instead point the frontend at
  `https://api.industrialsolutions.com`, add a **CNAME** `api` → your backend
  host (proxied), set `VITE_API_URL=https://api.industrialsolutions.com/api`,
  rebuild, and keep `CLIENT_ORIGIN` on the backend so CORS allows the main
  domain.

---

## 10. Local development (unchanged)

```bash
npm run install:all
cp server/.env.example server/.env     # set MONGODB_URI + ADMIN_TOKEN
npm run dev:server                      # API on http://localhost:5000
npm run dev:client                      # site on http://localhost:5173 (proxies /api)
```

## 11. Production build commands

```bash
npm run build          # builds client/dist (from repo root)
# frontend+Worker:  cd client && npm run deploy
# OR single-server:  npm start   (Express serves client/dist + /api on one port)
```

## 12. Production test URLs

```bash
curl -I  https://industrialsolutions.com/                 # 200, text/html
curl -I  https://industrialsolutions.com/assets/           # a built .js => application/javascript
curl -I  https://industrialsolutions.com/favicon.svg       # 200, image/svg+xml
curl -sS https://industrialsolutions.com/api/health        # {"ok":true,"database":"connected"}
curl -I  https://industrialsolutions.com/about             # 200 text/html (SPA route)
# submit an enquiry:
curl -sS -X POST https://industrialsolutions.com/api/enquiries \
  -H 'Content-Type: application/json' \
  -d '{"fullName":"Test User","phone":"9876543210","email":"t@example.com","productOrService":"Hydraulic Trainer","requirements":"Need a quote for one unit."}'
# admin read (secret required):
curl -sS https://industrialsolutions.com/api/enquiries -H "x-admin-token: <ADMIN_TOKEN>"
```

## 13. Rollback

- **Cloudflare:** Workers & Pages → your Worker → **Deployments** → roll back to
  the previous deployment (one click).
- **Backend:** redeploy the previous commit/image on the Node host, or use its
  "Rollback" control.
- **DNS:** custom-domain changes revert by removing the custom domain from the
  Worker; the previous routing resumes.

## 14. Production-ready checklist

- [ ] `npm install` succeeds in `client/` and `server/`.
- [ ] `npm run build` produces `client/dist` with `dist/index.html`, `dist/assets/*`, `dist/favicon.svg`.
- [ ] Backend starts and `/api/health` reports `database: connected` (Atlas reachable).
- [ ] Homepage loads; no console errors; JS served as `application/javascript`, CSS as `text/css`.
- [ ] `/about` works on direct load and refresh (SPA fallback).
- [ ] `/api/health` and enquiry POST work through `https://industrialsolutions.com`.
- [ ] `GET /api/enquiries` is 401 without the token, 200 with it (admin protection intact).
- [ ] No `localhost` API URL in the production bundle (`grep -r localhost client/dist` → nothing).
- [ ] `MONGODB_URI` / `ADMIN_TOKEN` exist only on the backend, never as `VITE_` vars.
- [ ] No SPA fallback intercepts `/api/*`; missing JS/CSS return 404, not `index.html`.
- [ ] Real `.env` files are not committed (only `.env.example`).
