// components/Footer.jsx
import './Footer.css';

const NAV_LINKS = [
  { label: 'Dashboard', id: 'dashboard' },
  { label: 'New Booking', id: 'booking' },
  { label: 'Shipments', id: 'shipments' },
  { label: 'Track Order', id: 'track' },
  { label: 'About & Services', id: 'about' },
  { label: 'Contact Us', id: 'contact' },
];

const SERVICES_LINKS = [
  'Transport Management',
  'Consignment Booking',
  'Vendor Delivery',
  'Shipment Records',
  'Logistics Support',
  'Delivery Management',
];

const TECH_LINKS = ['React', 'Vite', 'JavaScript', 'LocalStorage'];

export default function Footer({ onNavigate }) {
  const handleNavClick = (id) => {
    if (onNavigate) {
      onNavigate(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon" aria-hidden="true">🚛</div>
              <span className="footer-logo-text">Cargo<span>Flow</span></span>
            </div>
            <p className="footer-brand-desc">
              A modern transportation and consignment management platform for digitizing
              and organizing your logistics records.
            </p>
            <span className="footer-badge">
              <span aria-hidden="true">⚡</span>
              Frontend Prototype v1.0
            </span>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <h3 className="footer-col-title">Navigation</h3>
            <div className="footer-col-links">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  className="footer-link"
                  onClick={() => handleNavClick(link.id)}
                  aria-label={`Go to ${link.label}`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Services */}
          <div>
            <h3 className="footer-col-title">Services</h3>
            <div className="footer-col-links">
              {SERVICES_LINKS.map((s) => (
                <span key={s} className="footer-link" style={{ cursor: 'default' }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div>
            <h3 className="footer-col-title">Built With</h3>
            <div className="footer-col-links">
              {TECH_LINKS.map((t) => (
                <span key={t} className="footer-link" style={{ cursor: 'default' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} <strong>CargoFlow</strong>. Frontend prototype for
            transportation and consignment management. For educational purposes.
          </p>
          <div className="footer-tech">
            Built with
            {TECH_LINKS.map((t) => (
              <span key={t} className="footer-tech-badge">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
