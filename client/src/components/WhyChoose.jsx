import Icon from './Icon.jsx';
import RevealGrid from './RevealGrid.jsx';
import useReveal from '../hooks/useReveal.js';

// Dark "why choose us" section with a glowing orb animation.
export default function WhyChoose({ items }) {
  const head = useReveal();
  return (
    <section id="why" className="section section--space why2">
      <div className="stars" aria-hidden="true"><span /><span /><span /></div>
      <div className="container">
        <div ref={head} className="why2__head reveal">
          <p className="why2__eyebrow"><i />Why Industrial Solutions<i /></p>
          <h2>Why Choose Industrial Solutions</h2>
          <p className="why2__sub">What you can expect when you work with us.</p>
        </div>
        <div className="orbit" aria-hidden="true">
          <span className="orbit__line" />
          <span className="orbit__spark" />
          <span className="orbit__orb orbit__orb--a" />
        </div>
        <RevealGrid className="grid grid--3 why2__grid">
          {items.map((w) => (
            <article key={w.title} className="why2__item">
              <span className="why2__icon"><Icon name={w.icon} size={24} /></span>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </article>
          ))}
        </RevealGrid>
      </div>
    </section>
  );
}
