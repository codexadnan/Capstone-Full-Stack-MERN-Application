import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from './Button';
import Logo from './Logo';

// Top bar inside the dashboard layout
export default function Navbar({ onMenuClick, menuOpen }) {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <button
        type="button"
        className="menu-button"
        onClick={onMenuClick}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span /><span /><span />
      </button>
      <div className="topbar-logo"><Logo to="/dashboard" /></div>
      <div className="topbar-user">
        <Link to="/profile" className="topbar-name">{user?.name}</Link>
        <Button variant="secondary" onClick={logout}>Log out</Button>
      </div>
    </header>
  );
}
