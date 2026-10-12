import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Enquiry from '../models/Enquiry.js';
import { validateEnquiry } from '../middleware/validate.js';

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Too many enquiries from this connection. Please try again later or use WhatsApp.' },
});

// Public: submit an enquiry
router.post('/', submitLimiter, validateEnquiry, async (req, res) => {
  try {
    const saved = await Enquiry.create(req.enquiry);
    res.status(201).json({ ok: true, id: saved._id });
  } catch (err) {
    console.error('Failed to save enquiry:', err.message);
    res.status(500).json({
      ok: false,
      message: 'We could not save your enquiry right now. Please try WhatsApp or call us.',
    });
  }
});

// Private: list enquiries (send header  x-admin-token: <ADMIN_TOKEN>)
router.get('/', async (req, res) => {
  const token = process.env.ADMIN_TOKEN;
  if (!token || req.get('x-admin-token') !== token) {
    return res.status(401).json({ ok: false, message: 'Unauthorised' });
  }
  const items = await Enquiry.find().sort({ createdAt: -1 }).limit(200).lean();
  res.json({ ok: true, count: items.length, items });
});

export default router;
