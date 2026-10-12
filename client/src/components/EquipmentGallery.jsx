import { useState } from 'react';
import Lightbox from './Lightbox.jsx';
import RevealGrid from './RevealGrid.jsx';
import { GALLERY } from '../data/products.js';

export default function EquipmentGallery() {
  const [open, setOpen] = useState(null);
  return (
    <>
      <RevealGrid className="gallery gallery--rail">
        {GALLERY.map((g, i) => (
          <figure key={g.src} className="gallery__item">
            <button type="button" onClick={() => setOpen(i)} aria-label={`Enlarge: ${g.caption}`}>
              <img src={g.src} alt={g.alt} loading="lazy" decoding="async" />
            </button>
            <figcaption>{g.caption}</figcaption>
          </figure>
        ))}
      </RevealGrid>
      {open !== null && <Lightbox images={GALLERY} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </>
  );
}
