// components/Sidebar.jsx
import './Sidebar.css';

const NAV_ITEMS = [
  { section: 'Main' },
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'booking',   label: 'New Booking', icon: '✚', badge: null },
  { id: 'shipments', label: 'Shipments',   icon: '📦' },
  { id: 'track',     label: 'Track Order', icon: '📍' },
  { divider: true },
  { section: 'Info' },
  { id: 'about',    label: 'About & Services', icon: 'ℹ' },
  { id: 'contact',  label: 'Contact',          icon: '✉' },
];

export default function Sidebar({
  activePage,
  onNavigate,
  isOpen,
  onClose,
  collapsed,
  onToggle,
  darkMode,
  onDarkModeToggle,
  consignmentCount = 0,
}) {
  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar${collapsed ? ' sidebar-collapsed' : ''}${isOpen ? ' sidebar-open' : ''}`}
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="sidebar-header">
          <div
            className="sidebar-logo"
            onClick={() => { onNavigate('dashboard'); onClose(); }}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onNavigate('dashboard')}
            aria-label="CargoFlow Dashboard"
          >
            <div className="sidebar-logo-icon">🚚</div>
            {!collapsed && (
              <span className="sidebar-logo-text">
                Cargo<span>Flow</span>
              </span>
            )}
          </div>
          <button
            className="sidebar-toggle"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav" aria-label="Navigation menu">
          {NAV_ITEMS.map((item, i) => {
            if (item.section) {
              return !collapsed ? (
                <div key={`section-${i}`} className="sidebar-nav-section-title">
                  {item.section}
                </div>
              ) : null;
            }
            if (item.divider) {
              return <div key={`div-${i}`} className="sidebar-divider" />;
            }
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item${activePage === item.id ? ' active' : ''}`}
                onClick={() => { onNavigate(item.id); onClose(); }}
                aria-current={activePage === item.id ? 'page' : undefined}
                aria-label={item.label}
                title={collapsed ? item.label : undefined}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="sidebar-nav-label">{item.label}</span>
                    {item.id === 'shipments' && consignmentCount > 0 && (
                      <span className="sidebar-nav-badge">{consignmentCount}</span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            className="sidebar-darkmode-btn"
            onClick={onDarkModeToggle}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={collapsed ? (darkMode ? 'Light mode' : 'Dark mode') : undefined}
          >
            <span className="sidebar-nav-icon">{darkMode ? '☀' : '🌙'}</span>
            {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          <div className="sidebar-user" aria-label="User profile">
            <div className="sidebar-user-avatar" aria-hidden="true">O</div>
            {!collapsed && (
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">Operator</div>
                <div className="sidebar-user-role">Admin · CargoFlow</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
