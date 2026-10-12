import { Link } from 'react-router-dom';

export default function PageHero({ crumb, title, text, image, alt, children }) {
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{crumb}</span>
          </nav>
          <h1>{title}</h1>
          <p>{text}</p>
          {children && <div className="hero__actions">{children}</div>}
        </div>
        <img src={image} alt={alt} fetchpriority="high" />
      </div>
    </section>
  );
}
