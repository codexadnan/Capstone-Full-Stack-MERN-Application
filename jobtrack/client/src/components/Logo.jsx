import { Link } from 'react-router-dom';

export default function Logo({ to = '/', light = false }) {
  return (
    <Link to={to} className={`logo ${light ? 'logo-light' : ''}`} aria-label="JobTrack home">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#0f6e66" />
        <rect x="7" y="17" width="4" height="8" rx="1" fill="#fff" />
        <rect x="14" y="12" width="4" height="13" rx="1" fill="#fff" />
        <rect x="21" y="7" width="4" height="18" rx="1" fill="#e8a317" />
      </svg>
      <span>JobTrack</span>
    </Link>
  );
}
