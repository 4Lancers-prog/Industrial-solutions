import useReveal from '../hooks/useReveal.js';

// A grid whose children rise in one after another when scrolled into view.
export default function RevealGrid({ className = '', children }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal-stagger ${className}`}>{children}</div>;
}
