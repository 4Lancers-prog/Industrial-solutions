import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from './Icon.jsx';
import { SITE, whatsappLink } from '../config/site.js';
import { PRODUCTS } from '../data/products.js';
import { SERVICES } from '../data/services.js';

const EMPTY = { fullName: '', organisation: '', phone: '', email: '', productOrService: '', quantity: '', location: '', requirements: '', website: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?\d[\d\s-]{8,17}\d$/;

function validate(v) {
  const e = {};
  if (v.fullName.trim().length < 2) e.fullName = 'Please enter your full name.';
  if (!PHONE_RE.test(v.phone.trim()) || v.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid phone number (at least 10 digits).';
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address, e.g. name@company.com.';
  if (!v.productOrService.trim()) e.productOrService = 'Tell us which product or service you need.';
  if (v.requirements.trim().length < 10) e.requirements = 'Please describe your requirements (at least 10 characters).';
  return e;
}

function whatsappMessage(v) {
  const lines = [
    'Hello Industrial Solutions, I would like to send an enquiry.',
    `Name: ${v.fullName || '-'}`,
    v.organisation && `Company/Institution: ${v.organisation}`,
    `Phone: ${v.phone || '-'}`,
    v.email && `Email: ${v.email}`,
    `Product/Service: ${v.productOrService || '-'}`,
    v.quantity && `Quantity: ${v.quantity}`,
    v.location && `Location: ${v.location}`,
    `Requirements: ${v.requirements || '-'}`,
  ].filter(Boolean);
  return lines.join('\n');
}

export default function EnquiryForm() {
  const { search } = useLocation();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [serverMsg, setServerMsg] = useState('');
  const [prodOpen, setProdOpen] = useState(false);
  const prodRef = useRef(null);

  // Pre-fill product when arriving from an "Enquire Now" button
  useEffect(() => {
    const product = new URLSearchParams(search).get('product');
    if (product) setValues((v) => ({ ...v, productOrService: product }));
  }, [search]);

  // Close the product dropdown when clicking outside it
  useEffect(() => {
    function onDoc(e) {
      if (prodRef.current && !prodRef.current.contains(e.target)) setProdOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const options = [...PRODUCTS.map((p) => p.name), ...SERVICES.map((s) => s.title)];
  const q = (values.productOrService || '').toLowerCase().trim();
  const prodMatches = (q ? options.filter((o) => o.toLowerCase().includes(q)) : options).slice(0, 8);

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const focusFirstError = (errs) => {
    const first = Object.keys(errs)[0];
    if (first) document.getElementById(`f-${first}`)?.focus();
  };

  async function onSubmit(e) {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) { setStatus('idle'); focusFirstError(errs); return; }

    setStatus('sending');
    setServerMsg('');
    try {
      const res = await fetch(`${SITE.apiBase}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus('success');
        setValues(EMPTY);
      } else {
        if (data.errors) { setErrors(data.errors); focusFirstError(data.errors); }
        setServerMsg(data.message || 'Your enquiry could not be sent.');
        setStatus('error');
      }
    } catch {
      setServerMsg('We could not reach our server, so your enquiry was NOT sent.');
      setStatus('error');
    }
  }

  function sendViaWhatsApp() {
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) { focusFirstError(errs); return; }
    window.open(whatsappLink(whatsappMessage(values)), '_blank', 'noopener');
  }

  const selectProduct = (name) => {
    setValues((v) => ({ ...v, productOrService: name }));
    setErrors((er) => ({ ...er, productOrService: undefined }));
    setProdOpen(false);
  };

  const field = (id, label, props = {}, required = true) => (
    <div className={`field ${errors[id] ? 'has-error' : ''} ${props.wide ? 'field--wide' : ''}`}>
      <label htmlFor={`f-${id}`}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      {props.textarea ? (
        <textarea id={`f-${id}`} rows="5" value={values[id]} onChange={set(id)}
          aria-invalid={!!errors[id]} aria-describedby={errors[id] ? `e-${id}` : undefined} />
      ) : (
        <input id={`f-${id}`} type={props.type || 'text'} value={values[id]} onChange={set(id)}
          autoComplete={props.autoComplete} inputMode={props.inputMode} placeholder={props.placeholder}
          aria-invalid={!!errors[id]} aria-describedby={errors[id] ? `e-${id}` : undefined} />
      )}
      {errors[id] && <p className="field__error" id={`e-${id}`} role="alert">{errors[id]}</p>}
    </div>
  );

  return (
    <form className="enquiry" onSubmit={onSubmit} noValidate>
      {status === 'error' && (
        <div className="notice notice--error" role="alert">
          <strong>{serverMsg}</strong> You can send the same details on WhatsApp or call {SITE.phoneDisplay}.
        </div>
      )}

      <div className="enquiry__grid">
        {field('fullName', 'Full Name', { autoComplete: 'name' })}
        {field('organisation', 'Company / Institution Name', { autoComplete: 'organization' }, false)}
        {field('phone', 'Phone Number', { type: 'tel', autoComplete: 'tel', inputMode: 'tel', placeholder: 'e.g. 8951272366' })}
        {field('email', 'Email Address', { type: 'email', autoComplete: 'email' })}

        {/* Product / service — custom React combobox (no browser datalist) */}
        <div className={`field ${errors.productOrService ? 'has-error' : ''}`} ref={prodRef}>
          <label htmlFor="f-productOrService">Product or Service Required<span aria-hidden="true"> *</span></label>
          <div className="combo">
            <input
              id="f-productOrService"
              type="text"
              role="combobox"
              aria-expanded={prodOpen}
              aria-controls="prod-listbox"
              aria-autocomplete="list"
              autoComplete="off"
              value={values.productOrService}
              placeholder="Choose from the list or type your own"
              onChange={(e) => { setValues((v) => ({ ...v, productOrService: e.target.value })); setProdOpen(true); if (errors.productOrService) setErrors((er) => ({ ...er, productOrService: undefined })); }}
              onFocus={() => setProdOpen(true)}
              aria-invalid={!!errors.productOrService}
              aria-describedby={errors.productOrService ? 'e-productOrService' : undefined}
            />
            {prodOpen && prodMatches.length > 0 && (
              <ul className="combo__list" id="prod-listbox" role="listbox">
                {prodMatches.map((o) => (
                  <li key={o} role="option" aria-selected={values.productOrService === o}
                    onMouseDown={(e) => { e.preventDefault(); selectProduct(o); }}>
                    {o}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.productOrService && <p className="field__error" id="e-productOrService" role="alert">{errors.productOrService}</p>}
        </div>

        {field('quantity', 'Quantity (if known)', {}, false)}
        {field('location', 'Location', { autoComplete: 'address-level2' }, false)}
        {field('requirements', 'Project Requirements', { textarea: true, wide: true })}
        <div className="hp" aria-hidden="true">
          <label>Website<input tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} /></label>
        </div>
      </div>

      <div className="enquiry__actions">
        <button type="submit" className="btn btn--primary btn--lg" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Submit Enquiry'}
        </button>
        <button type="button" className="btn btn--whatsapp btn--lg" onClick={sendViaWhatsApp}>
          <Icon name="chat" size={20} /> Send via WhatsApp
        </button>
      </div>
      <p className="enquiry__note">Fields marked * are required. Submitted enquiries are stored securely so our team can reply.</p>

      {/* Thank-you popup on successful submit */}
      {status === 'success' && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="ty-title" onClick={() => setStatus('idle')}>
          <div className="modal__card" onClick={(e) => e.stopPropagation()}>
            <span className="modal__icon" aria-hidden="true"><Icon name="check" size={30} /></span>
            <h3 id="ty-title">Thank you!</h3>
            <p>Your enquiry has been received. Our team will contact you on the phone number or email you provided.</p>
            <button type="button" className="btn btn--primary btn--lg" onClick={() => setStatus('idle')}>Close</button>
          </div>
        </div>
      )}
    </form>
  );
}
