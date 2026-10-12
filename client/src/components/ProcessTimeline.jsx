import useReveal from '../hooks/useReveal.js';

// Glowing numbered timeline on a starry background.
export default function ProcessTimeline({ title, intro, steps }) {
  const ref = useReveal();
  const head = useReveal();
  return (
    <section id="process" className="section section--space">
      <div className="stars" aria-hidden="true"><span /><span /><span /></div>
      <div className="container">
        <div ref={head} className="section-heading section-heading--light reveal">
          <h2>{title}</h2>
          {intro && <p>{intro}</p>}
        </div>
        <div className="timeline-wrap">
          <span className="timeline__track" aria-hidden="true"><i className="comet" /></span>
          <ol ref={ref} className="timeline reveal-stagger" aria-label="Process steps">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="timeline__dot">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
