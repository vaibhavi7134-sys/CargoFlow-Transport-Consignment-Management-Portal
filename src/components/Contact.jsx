// components/Contact.jsx
import './Contact.css';

const CONTACT_ITEMS = [
  {
    id: 'email',
    icon: '📧',
    label: 'Email Address',
    value: 'support@cargoflow.app',
    sub: 'We respond within 24 hours',
  },
  {
    id: 'phone',
    icon: '📞',
    label: 'Phone Number',
    value: '+91 98765 43210',
    sub: 'Monday to Saturday, 9am – 6pm',
  },
  {
    id: 'location',
    icon: '📍',
    label: 'Office Address',
    value: 'CargoFlow Logistics Pvt. Ltd.',
    sub: 'Mumbai, Maharashtra, India',
  },
];

const HOURS = [
  { day: 'Monday – Friday', time: '9:00 AM – 6:00 PM' },
  { day: 'Saturday', time: '9:00 AM – 2:00 PM' },
  { day: 'Sunday', time: 'Closed' },
];

export default function Contact() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="contact" className="contact section" aria-labelledby="contact-heading">
      <div className="container">
        <div className="contact-grid">
          {/* Left */}
          <div className="contact-info-side">
            <span className="section-tag">Contact Us</span>
            <h2 id="contact-heading" className="section-title">
              Get in <span className="highlight">Touch</span>
            </h2>
            <p className="contact-tagline">
              Have questions about CargoFlow or need assistance with your consignment records?
              Our team is ready to help you get started.
            </p>

            <div className="contact-items" role="list" aria-label="Contact information">
              {CONTACT_ITEMS.map((item) => (
                <div className="contact-item" key={item.id} role="listitem" id={`contact-${item.id}`}>
                  <div className="contact-item-icon" aria-hidden="true">{item.icon}</div>
                  <div>
                    <div className="contact-item-label">{item.label}</div>
                    <div className="contact-item-value">{item.value}</div>
                    <div className="contact-item-sub">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="contact-card-side">
            <div className="contact-cta-card">
              <span className="contact-cta-emoji" aria-hidden="true">🚛</span>
              <h3 className="contact-cta-title">Ready to Book a Consignment?</h3>
              <p className="contact-cta-desc">
                Use our digital booking system to create consignment records in minutes.
                Fill in the details and let CargoFlow handle the rest.
              </p>
              <button
                id="contact-book-btn"
                className="btn btn-primary btn-full"
                onClick={() => scrollTo('book')}
                aria-label="Go to consignment booking form"
              >
                📦 Book a Consignment Now
              </button>

              <div className="contact-hours">
                <p className="contact-hours-title">Business Hours</p>
                {HOURS.map((h) => (
                  <div key={h.day} className="contact-hours-row">
                    <span>{h.day}</span>
                    <span style={{ color: h.time === 'Closed' ? 'var(--text-muted)' : 'var(--text-primary)', fontWeight: h.time === 'Closed' ? 400 : 600 }}>
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
