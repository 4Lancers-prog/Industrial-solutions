import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Smooth-scroll to #hash targets after route changes, otherwise to top.
export default function ScrollManager() {
  const { pathname, hash, search } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      let tries = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else if (tries++ < 10) setTimeout(tryScroll, 60);
      };
      tryScroll();
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname, hash, search]);
  return null;
}
