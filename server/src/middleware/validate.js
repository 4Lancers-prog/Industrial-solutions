const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?\d[\d\s-]{8,17}\d$/;

const clean = (v) => (typeof v === 'string' ? v.trim() : '');

export function validateEnquiry(req, res, next) {
  const b = req.body || {};

  // Honeypot: real visitors never fill this hidden field, bots usually do
  if (clean(b.website)) return res.status(201).json({ ok: true });

  const data = {
    fullName: clean(b.fullName),
    organisation: clean(b.organisation),
    phone: clean(b.phone),
    email: clean(b.email),
    productOrService: clean(b.productOrService),
    quantity: clean(b.quantity),
    location: clean(b.location),
    requirements: clean(b.requirements),
  };

  const errors = {};
  if (data.fullName.length < 2) errors.fullName = 'Please enter your full name.';
  if (!PHONE_RE.test(data.phone) || data.phone.replace(/\D/g, '').length < 10)
    errors.phone = 'Please enter a valid phone number.';
  if (!EMAIL_RE.test(data.email)) errors.email = 'Please enter a valid email address.';
  if (!data.productOrService) errors.productOrService = 'Please tell us which product or service you need.';
  if (data.requirements.length < 10)
    errors.requirements = 'Please describe your requirements (at least 10 characters).';

  if (Object.keys(errors).length) {
    return res.status(400).json({ ok: false, message: 'Please correct the highlighted fields.', errors });
  }
  req.enquiry = data;
  next();
}
