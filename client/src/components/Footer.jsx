import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import { SITE, whatsappLink } from '../config/site.js';
import { CATEGORIES } from '../data/products.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Logo light />
          <p className="footer__about">Industrial training equipment, laboratory systems, installation and technical support for technical education and industry.</p>
          <p className="footer__rep">{SITE.representative}</p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/#equipment">Equipment</Link></li>
            <li><Link to="/about#services">Services</Link></li>
            <li><Link to="/#enquiry">Contact &amp; Enquiry</Link></li>
          </ul>
        </div>
        <div>
          <h3>Product Categories</h3>
          <ul>
            {CATEGORIES.map((c) => (<li key={c.id}><Link to={`/#cat-${c.id}`}>{c.name}</Link></li>))}
          </ul>
        </div>
        <div>
          <h3>Services</h3>
          <ul>
            <li><Link to="/about#services">Equipment Supply</Link></li>
            <li><Link to="/about#services">Laboratory Setup</Link></li>
            <li><Link to="/about#services">Installation</Link></li>
            <li><Link to="/about#services">Testing &amp; Commissioning</Link></li>
            <li><Link to="/about#services">Maintenance &amp; Support</Link></li>
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <ul className="footer__contact">
            <li><Icon name="pin" size={18} /><span>{SITE.address}</span></li>
            <li><Icon name="phone" size={18} /><a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a></li>
            <li><Icon name="mail" size={18} /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li><Icon name="chat" size={18} /><a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__bar">
        <div className="container">&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</div>
      </div>
    </footer>
  );
}
