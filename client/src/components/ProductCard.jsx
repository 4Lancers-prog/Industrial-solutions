import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { enquiryLink } from '../config/site.js';

/**
 * variant "featured": homepage card, View Details links to the catalogue.
 * variant "catalogue": expands to show components and applications.
 */
export default function ProductCard({ item, variant = 'featured', onZoom }) {
  const [open, setOpen] = useState(false);
  const detailsId = `details-${item.id}`;

  return (
    <article className={`product-card ${item.poster ? 'product-card--poster' : ''}`}>
      {variant === 'catalogue' && onZoom ? (
        <button type="button" className="product-card__media product-card__media--btn" onClick={() => onZoom(item)} aria-label={`Enlarge photo: ${item.name}`}>
          <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
        </button>
      ) : (
        <div className="product-card__media">
          <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
        </div>
      )}
      <div className="product-card__body">
        <p className="product-card__tag">{item.categoryLabel}</p>
        <h3>{item.name}</h3>
        <p className="product-card__text">{variant === 'featured' ? item.desc : item.overview}</p>

        {variant === 'catalogue' && (
          <div id={detailsId} className={`product-card__details ${open ? 'is-open' : ''}`}>
            <div>
              <h4>Visible components</h4>
              <ul>{item.components.map((c) => <li key={c}>{c}</li>)}</ul>
              {item.applications?.length > 0 && (<><h4>Suited to</h4><ul>{item.applications.map((a) => <li key={a}>{a}</li>)}</ul></>)}
              <p className="product-card__spec">{item.specs?.length ? item.specs.join(' · ') : 'Specifications available on request'}</p>
            </div>
          </div>
        )}

        <div className="product-card__actions">
          {variant === 'featured' ? (
            <Link to={item.detailsTo} className="btn btn--ghost">View Details</Link>
          ) : (
            <button type="button" className="btn btn--ghost" aria-expanded={open} aria-controls={detailsId} onClick={() => setOpen((o) => !o)}>
              {open ? 'Hide Details' : 'View Details'}
            </button>
          )}
          <Link to={enquiryLink(item.name)} className="btn btn--primary">Enquire Now</Link>
        </div>
      </div>
    </article>
  );
}
