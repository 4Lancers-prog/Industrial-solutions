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

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: origins }));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api', (_req, res) => res.status(404).json({ ok: false, message: 'Not found' }));

// Optional: serve the built React app from this server (npm run build in /client first)
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
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
