// components/DashboardLayout.jsx
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

const PAGE_TITLES = {
  dashboard: 'Dashboard Overview',
  booking:   'New Consignment Booking',
  shipments: 'Shipments & Records',
  track:     'Track Your Order',
  about:     'About & Services',
  contact:   'Contact Us',
};

const MOBILE_NAV = [
  { id: 'dashboard', icon: '▦',  label: 'Home'    },
  { id: 'booking',   icon: '✚',  label: 'Book'    },
  { id: 'shipments', icon: '📦', label: 'Orders'  },
  { id: 'track',     icon: '📍', label: 'Track'   },
  { id: 'contact',   icon: '✉',  label: 'Contact' },
];

export default function DashboardLayout({
  activePage,
  onNavigate,
  consignmentCount,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed]     = useState(false);
  const [darkMode, setDarkMode]       = useState(
    () => localStorage.getItem('cf-dark-mode') === 'true'
  );

  // Apply dark mode class to body
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('cf-dark-mode', String(darkMode));
  }, [darkMode]);

  // Auto-collapse on tablet, expand on desktop
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setCollapsed(false); // drawer mode on mobile
      } else if (w < 1024) {
        setCollapsed(true);  // icon rail on tablet
      } else {
        setCollapsed(false); // full sidebar on desktop
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile drawer on navigation
  const handleNavigate = (page) => {
    onNavigate(page);
    setSidebarOpen(false);
  };

  return (
    <div className={`layout-root${collapsed ? ' sidebar-collapsed' : ''}`}>
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
        consignmentCount={consignmentCount}
      />

      <div className="layout-main">
        {/* Top bar */}
        <header className="layout-topbar" role="banner">
          <div className="topbar-left">
            <button
              className="topbar-hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
            >
              ☰
            </button>
            <div>
              <div className="topbar-breadcrumb">
                <span>CargoFlow</span>
                <span className="topbar-breadcrumb-sep">›</span>
                <span style={{ color: 'var(--color-violet)', fontWeight: 600 }}>
                  {PAGE_TITLES[activePage]}
                </span>
              </div>
              <h1 className="topbar-title">{PAGE_TITLES[activePage]}</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <button
              className="topbar-icon-btn"
              aria-label="Notifications"
              title="Notifications"
            >
              🔔
              <span className="topbar-notif-dot" aria-hidden="true" />
            </button>
            <button
              className="topbar-icon-btn"
              aria-label="Search"
              title="Search"
              onClick={() => handleNavigate('shipments')}
            >
              🔍
            </button>
            <div
              className="topbar-avatar"
              role="img"
              aria-label="User avatar"
              title="Operator"
            >
              O
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="layout-content" id="main-content">
          {children}
        </main>

        {/* Mobile bottom navigation */}
        <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
          <div className="mobile-bottom-nav-inner">
            {MOBILE_NAV.map(item => (
              <button
                key={item.id}
                className={`mobile-nav-item${activePage === item.id ? ' active' : ''}`}
                onClick={() => handleNavigate(item.id)}
                aria-label={item.label}
                aria-current={activePage === item.id ? 'page' : undefined}
              >
                <span className="mobile-nav-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
