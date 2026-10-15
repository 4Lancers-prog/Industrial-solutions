import { useEffect } from 'react';

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

// Page-specific title, description, canonical and Open Graph tags (no extra dependency)
export default function useMeta({ title, description }) {
  useEffect(() => {
    // Clean URL for canonical/og:url — no query string or #hash, so Google
    // doesn't treat /?product=... or /#enquiry as separate pages.
    const canonical = window.location.origin + window.location.pathname;
    document.title = title;
    setMeta('name', 'description', description);
    setCanonical(canonical);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical);
  }, [title, description]);
}
