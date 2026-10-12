import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import { NAV_LINKS } from '../config/site.js';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => setOpen(false), [pathname, hash]);

  const isActive = (to) => {
    const [p, h] = to.split('#');
    return p === pathname && (h ? `#${h}` === hash : !hash);
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Logo light />
        <nav id="site-nav" className={`navbar__nav ${open ? 'is-open' : ''}`} aria-label="Primary">
          <div className="navpill">
            {NAV_LINKS.map((l) => (
              <Link key={l.label} to={l.to} className={isActive(l.to) ? 'is-active' : ''} aria-current={isActive(l.to) ? 'page' : undefined}>
                {l.label}
              </Link>
            ))}
          </div>
          <Link to="/#enquiry" className="btn btn--teal navbar__cta">Request a Quote</Link>
        </nav>
        <button className="navbar__toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>
    </header>
  );
}
