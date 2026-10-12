import { useState } from 'react';
import Icon from './Icon.jsx';
import { FAQS } from '../data/faq.js';

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="faq">
      {FAQS.map((f, i) => {
        const open = openIndex === i;
        return (
          <div key={f.q} className={`faq__item ${open ? 'is-open' : ''}`}>
            <h3>
              <button type="button" id={`faq-q-${i}`} aria-expanded={open} aria-controls={`faq-a-${i}`} onClick={() => setOpenIndex(open ? -1 : i)}>
                <span>{f.q}</span><Icon name="plus" size={20} />
              </button>
            </h3>
            <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="faq__panel">
              <div><p>{f.a}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
