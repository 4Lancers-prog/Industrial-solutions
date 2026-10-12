import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

export default function Lightbox({ images, index, onClose, onIndex }) {
  const closeRef = useRef(null);
  const total = images.length;
  const go = (d) => onIndex((index + d + total) % total);

  useEffect(() => {
    const prevFocus = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; prevFocus?.focus?.(); };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const img = images[index];
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={onClose}>
      <button ref={closeRef} className="lightbox__btn lightbox__close" onClick={onClose} aria-label="Close image viewer"><Icon name="close" /></button>
      {total > 1 && <button className="lightbox__btn lightbox__prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous image"><Icon name="left" /></button>}
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={img.src} alt={img.alt} />
        <figcaption>{img.caption} <span>({index + 1} / {total})</span></figcaption>
      </figure>
      {total > 1 && <button className="lightbox__btn lightbox__next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next image"><Icon name="right" /></button>}
    </div>
  );
}
