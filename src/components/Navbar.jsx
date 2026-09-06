// components/Navbar.jsx
import { useState, useEffect, useCallback } from 'react';
import './Navbar.css';

const NAV_ITEMS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Consignments', id: 'consignments' },
  { label: 'Contact', id: 'contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Detect scroll for sticky style
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      // Highlight active section
      const sections = ['home', 'about', 'services', 'book', 'consignments', 'contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 90) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  }, []);

  const handleBookClick = useCallback(() => {
    scrollTo('book');
  }, [scrollTo]);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} aria-label="Main navigation">
        <div className="navbar-inner">
          {/* Logo */}
          <button
            className="navbar-logo"
            onClick={() => scrollTo('home')}
            aria-label="CargoFlow – go to home"
          >
            <div className="logo-icon" aria-hidden="true">🚛</div>
            <span className="logo-text">Cargo<span>Flow</span></span>
          </button>

          {/* Desktop Nav */}
          <nav className="navbar-links" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`nav-link${activeSection === item.id ? ' active' : ''}`}
                onClick={() => scrollTo(item.id)}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
            <button
              id="nav-book-cta"
              className="nav-cta"
              onClick={handleBookClick}
              aria-label="Book a consignment"
            >
              Book a Consignment
            </button>
          </nav>

          {/* Hamburger */}
          <button
            className={`hamburger${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`mobile-menu${mobileOpen ? ' open' : ''}`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`mobile-nav-link${activeSection === item.id ? ' active' : ''}`}
            onClick={() => scrollTo(item.id)}
            aria-current={activeSection === item.id ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
        <button className="mobile-nav-cta" onClick={handleBookClick}>
          📦 Book a Consignment
        </button>
      </div>
    </>
  );
}
