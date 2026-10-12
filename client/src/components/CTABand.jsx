import { Link } from 'react-router-dom';
import { whatsappLink } from '../config/site.js';

export default function CTABand({ title, text, primary, secondary }) {
  return (
    <section className="cta-band">
      <div className="container cta-band__inner">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="cta-band__actions">
          <Link to={primary.to} className="btn btn--teal">{primary.label}</Link>
          {secondary.to
            ? <Link to={secondary.to} className="btn btn--outline-light">{secondary.label}</Link>
            : <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn--outline-light">{secondary.label}</a>}
        </div>
      </div>
    </section>
  );
}
