import SectionHeading from './SectionHeading.jsx';
import useReveal from '../hooks/useReveal.js';

export default function VideoShowcase() {
  const ref = useReveal();
  return (
    <section id="watch" className="section section--navy video-section">
      <div className="container">
        <SectionHeading light title="See Our Work in Motion"
          intro="Video walkthroughs of the equipment, tools and laboratory setups handled by Industrial Solutions. Press play to watch." />
        <div ref={ref} className="video-grid reveal-stagger">
          <figure className="video-card video-card--wide">
            <video controls preload="none" playsInline poster="/videos/company-walkthrough-poster.webp" aria-label="Industrial Solutions company walkthrough video">
              <source src="/videos/company-walkthrough.mp4" type="video/mp4" />
              Your browser does not support video playback.
            </video>
            <figcaption><strong>Company walkthrough</strong><span>Equipment, tools and lab setups shown on video.</span></figcaption>
          </figure>
          <figure className="video-card video-card--tall">
            <video controls preload="none" playsInline poster="/videos/iti-lab-walkthrough-poster.webp" aria-label="Workshop and laboratory walkthrough video">
              <source src="/videos/iti-lab-walkthrough.mp4" type="video/mp4" />
              Your browser does not support video playback.
            </video>
            <figcaption><strong>Workshop &amp; lab walkthrough</strong><span>A closer look at lab equipment.</span></figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
