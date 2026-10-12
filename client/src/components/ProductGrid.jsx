import { useMemo, useState } from 'react';
import ProductCard from './ProductCard.jsx';
import Lightbox from './Lightbox.jsx';
import Icon from './Icon.jsx';
import RevealGrid from './RevealGrid.jsx';
import { CATEGORIES, PRODUCTS } from '../data/products.js';

const CAT_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name]));

export default function ProductGrid() {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(null);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS
      .filter((p) => filter === 'all' || p.category === filter)
      .filter((p) => !q || [p.name, p.overview, CAT_LABEL[p.category], ...p.components].join(' ').toLowerCase().includes(q))
      .map((p) => ({ ...p, categoryLabel: CAT_LABEL[p.category] }));
  }, [filter, query]);

  const groups = CATEGORIES.map((c) => ({ ...c, items: items.filter((p) => p.category === c.id) })).filter((g) => g.items.length);
  const lightboxImages = items.map((p) => ({ src: p.image, alt: p.alt, caption: p.name }));

  return (
    <div>
      <div className="catalogue-tools">
        <div className="chips" role="group" aria-label="Filter equipment by category">
          <button type="button" className={`chip ${filter === 'all' ? 'is-active' : ''}`} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All equipment</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" className={`chip ${filter === c.id ? 'is-active' : ''}`} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>{c.name}</button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">Search equipment</span>
          <Icon name="search" size={18} />
          <input type="search" placeholder="Search e.g. valve, panel, cylinder" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>
      <p className="catalogue-count" role="status" aria-live="polite">{items.length} {items.length === 1 ? 'item' : 'items'} shown</p>

      {groups.length === 0 && (
        <div className="empty">
          <p>No equipment matches your search.</p>
          <button type="button" className="btn btn--ghost" onClick={() => { setQuery(''); setFilter('all'); }}>Clear filters</button>
        </div>
      )}

      {groups.map((g) => (
        <section key={g.id} id={`cat-${g.id}`} className="catalogue-group" aria-labelledby={`h-${g.id}`}>
          <h3 id={`h-${g.id}`} className="catalogue-group__title">{g.name}</h3>
          <RevealGrid className="grid grid--3">
            {g.items.map((p) => (
              <ProductCard key={p.id} item={p} variant="catalogue"
                onZoom={() => setZoom(lightboxImages.findIndex((x) => x.src === p.image))} />
            ))}
          </RevealGrid>
        </section>
      ))}

      {zoom !== null && zoom >= 0 && (
        <Lightbox images={lightboxImages} index={zoom} onClose={() => setZoom(null)} onIndex={setZoom} />
      )}
    </div>
  );
}
