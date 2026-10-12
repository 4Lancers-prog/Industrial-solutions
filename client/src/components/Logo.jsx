import { Link } from 'react-router-dom';

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo--light' : ''}`} aria-label="Industrial Solutions - home">
      <svg width="38" height="38" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="8" fill="#0B1F33" />
        <path d="M14 44V20h8v24zM26 44V20h8l10 14V20h8v24h-8L34 30v14z" fill="#16B8A6" />
      </svg>
      <span className="logo__text"><strong>Industrial</strong> Solutions</span>
    </Link>
  );
}
