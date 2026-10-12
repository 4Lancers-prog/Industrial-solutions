import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true"><span className="hero__grid" /><span className="orb orb--1" /><span className="orb orb--2" /></div>
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow anim-in" style={{ '--d': '0ms' }}>Hubli, Karnataka &nbsp;&bull;&nbsp; Industrial Training Equipment</p>
          <h1 className="anim-in" style={{ '--d': '100ms' }}>Complete Industrial <span className="text-accent">Training</span> &amp; Engineering Solutions</h1>
          <p className="hero__lead anim-in" style={{ '--d': '220ms' }}>Reliable equipment supply, laboratory setup, installation, testing, and commissioning solutions for technical education and industrial applications.</p>
          <div className="hero__actions anim-in" style={{ '--d': '340ms' }}>
            <Link to="/#equipment" className="btn btn--primary btn--lg">Explore Our Equipment</Link>
            <Link to="/#enquiry" className="btn btn--outline-light btn--lg">Request a Quote</Link>
          </div>
          <p className="hero__trust anim-in" style={{ '--d': '460ms' }}>Equipment Supply &bull; Installation &bull; Testing &bull; Commissioning</p>
        </div>

        <div className="hero__media anim-in" style={{ '--d': '300ms' }}>
          <div className="hero__video">
            <video src="/videos/hero-preview.mp4" poster="/videos/hero-preview-poster.webp" muted loop playsInline preload="metadata"
              autoPlay={!reduceMotion()} aria-label="Preview video of Industrial Solutions equipment and laboratory setups" />
          </div>
          <Link to="/#watch" className="hero__play"><span><Icon name="play" size={16} /></span>Watch the full video</Link>
        </div>
      </div>
    </section>
  );
}
