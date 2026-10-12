// Dark numbered card: big dim number, optional photo, title, text, optional buttons.
export default function NumberCard({ num, title, text, image, alt, children, footer }) {
  return (
    <article className={`ncard ${image ? 'ncard--media' : ''}`}>
      {image && (
        <div className="ncard__media">
          <img src={image} alt={alt} loading="lazy" decoding="async" />
        </div>
      )}
      <div className="ncard__body">
        <span className="ncard__num" aria-hidden="true">{String(num).padStart(2, '0')}</span>
        <h3>{title}</h3>
        <p className="ncard__text">{text}</p>
        {children}
        {footer && <div className="ncard__actions">{footer}</div>}
      </div>
    </article>
  );
}
