import useReveal from '../hooks/useReveal.js';

export default function SectionHeading({ title, intro, light = false, as: Tag = 'h2' }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`section-heading reveal ${light ? 'section-heading--light' : ''}`}>
      <Tag>{title}</Tag>
      {intro && <p>{intro}</p>}
    </div>
  );
}
