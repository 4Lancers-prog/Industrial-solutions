import { Link } from 'react-router-dom';

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo--light' : ''}`} aria-label="Industrial Solutions - home">
      <img src="/images/logo.webp" className="logo__img" width="40" height="40" alt="" aria-hidden="true" loading="eager" />
      <span className="logo__text"><strong>Industrial</strong> Solutions</span>
    </Link>
  );
}
