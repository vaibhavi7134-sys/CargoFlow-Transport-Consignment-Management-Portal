// components/About.jsx
import './About.css';

const FEATURES = [
  {
    icon: '📋',
    title: 'Digital Consignment Records',
    desc: 'Create and maintain organized digital records for every shipment — no paper forms required.',
  },
  {
    icon: '⚡',
    title: 'Instant Calculations',
    desc: 'Total amounts are calculated automatically as you type quantity and rate values.',
  },
  {
    icon: '🔍',
    title: 'Easy Search & Retrieval',
    desc: 'Quickly find any consignment by docket number or customer name in seconds.',
  },
];

const HIGHLIGHTS = [
  { emoji: '🚛', title: 'Transport Management', desc: 'Organize shipments efficiently' },
  { emoji: '📦', title: 'Consignment Booking', desc: 'Fast digital record creation' },
  { emoji: '💾', title: 'Local Storage', desc: 'Data persists across sessions' },
  { emoji: '📱', title: 'Responsive Design', desc: 'Works on any device' },
];

export default function About() {
  return (
    <section id="about" className="about section" aria-labelledby="about-heading">
      <div className="container">
        <div className="about-grid">
          {/* Text Column */}
          <div className="about-content">
            <span className="section-tag">About CargoFlow</span>
            <h2 id="about-heading" className="section-title">
              Simplifying Transportation<br />
              <span className="highlight">Record Management</span>
            </h2>

            <p className="about-description">
              CargoFlow is a modern transportation and consignment management platform
              designed to digitize and simplify the process of recording, organizing and
              managing shipment information. Whether you are handling local deliveries or
              long-distance cargo, CargoFlow keeps your records accurate and accessible.
            </p>

            <div className="about-features">
              {FEATURES.map((f) => (
                <div className="about-feature" key={f.title}>
                  <div className="about-feature-icon" aria-hidden="true">{f.icon}</div>
                  <div className="about-feature-text">
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
              id="about-book-btn"
              aria-label="Go to consignment booking form"
            >
              📦 Start Booking
            </button>
          </div>

          {/* Highlight Cards */}
          <div className="about-highlights" aria-label="Platform highlights">
            {HIGHLIGHTS.map((h) => (
              <div className="about-highlight-card" key={h.title}>
                <span className="about-highlight-emoji" aria-hidden="true">{h.emoji}</span>
                <h3 className="about-highlight-title">{h.title}</h3>
                <p className="about-highlight-desc">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
