// components/Hero.jsx
import './Hero.css';

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="home" className="hero" aria-labelledby="hero-heading">
      {/* Background layers */}
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orb hero-orb-1" aria-hidden="true" />
      <div className="hero-orb hero-orb-2" aria-hidden="true" />
      <div className="hero-orb hero-orb-3" aria-hidden="true" />

      {/* Main Content */}
      <div className="hero-content">
        <div className="hero-badge" aria-label="Transportation management platform">
          <span className="hero-badge-dot" aria-hidden="true" />
          Transportation &amp; Logistics Platform
        </div>

        <h1 id="hero-heading" className="hero-title">
          Smart Transportation &amp;
          <br />
          <span className="hero-title-line2">Consignment Management</span>
        </h1>

        <p className="hero-subtitle">
          Streamline your logistics operations with CargoFlow — a professional digital system
          for creating, managing and tracking consignment records with speed and accuracy.
        </p>

        <div className="hero-ctas">
          <button
            id="hero-book-cta"
            className="btn btn-primary"
            onClick={() => scrollTo('book')}
            aria-label="Book a consignment now"
          >
            📦 Book a Consignment
          </button>
          <button
            id="hero-services-cta"
            className="btn btn-secondary"
            onClick={() => scrollTo('services')}
            aria-label="Explore our services"
          >
            Explore Services →
          </button>
        </div>

        {/* Stats */}
        <div className="hero-stats" aria-label="Platform highlights">
          <div className="hero-stat-card">
            <span className="hero-stat-value">100%</span>
            <span className="hero-stat-label">Digital Records</span>
          </div>
          <div className="hero-stat-card">
            <span className="hero-stat-value">0s</span>
            <span className="hero-stat-label">Instant Calc</span>
          </div>
          <div className="hero-stat-card">
            <span className="hero-stat-value">∞</span>
            <span className="hero-stat-label">Consignments</span>
          </div>
          <div className="hero-stat-card">
            <span className="hero-stat-value">✓</span>
            <span className="hero-stat-label">Always Saved</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        className="scroll-indicator"
        onClick={() => scrollTo('about')}
        aria-label="Scroll to About section"
      >
        Scroll
        <span className="scroll-indicator-arrow" aria-hidden="true" />
      </button>
    </section>
  );
}
