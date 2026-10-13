import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import enquiryRoutes from './routes/enquiries.js';

const app = express();
const PORT = process.env.PORT || 5000;
const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim());

// In production this app runs behind a reverse proxy (the Cloudflare Worker and
// the Node host). Trusting the proxy makes req.ip the real visitor IP, so
// express-rate-limit buckets per visitor instead of lumping everyone under the
// proxy's single IP. No effect in plain local development.
app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: origins }));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api', (_req, res) => res.status(404).json({ ok: false, message: 'Not found' }));

// Serve the built React app from this server.
// IMPORTANT: this serves client/dist (the output of `npm run build`), NOT the
// source in client/. Serving the raw source makes the browser request
// /src/main.jsx, which a static server returns with a "text/jsx" MIME type that
// browsers refuse to run as a module ("Expected a JavaScript-or-Wasm module
// script..."), and /favicon.svg 404s because the icon only lands at the web
// root after a build copies client/public/* into dist/.
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');
const hasBuild = fs.existsSync(path.join(dist, 'index.html'));

if (hasBuild) {
  // index.html must never be cached, so a redeploy is picked up immediately;
  // the hashed /assets/* files are safe to cache for a long time.
  app.use(
    express.static(dist, {
      index: false,
      setHeaders(res, filePath) {
        if (filePath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      },
    })
  );
  // SPA fallback: any non-/api, non-asset GET returns index.html so client-side
  // routes (e.g. /about) work on reload. /api/* is already handled above.
  app.get('*', (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(dist, 'index.html'));
  });
} else {
  // No build present. Make this loud instead of silently 404-ing, so the site
  // is never accidentally served from un-built source.
  console.warn('[client] client/dist not found - run "npm run build" in /client to serve the site.');
  app.get('*', (_req, res) =>
    res
      .status(503)
      .type('text/plain')
      .send('Client build not found. Run "npm run build" in the client folder, then restart the server.')
  );
}

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is missing. Copy .env.example to .env and set it.');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}
start();
