import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

// Sidebar + top bar + page content. On mobile the sidebar slides in.
export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="shell">
      <Navbar menuOpen={menuOpen} onMenuClick={() => setMenuOpen((open) => !open)} />
      <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
      <main className="main" id="main">
        <Outlet />
      </main>
    </div>
  );
}
