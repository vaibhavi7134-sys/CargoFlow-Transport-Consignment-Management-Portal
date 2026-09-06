// components/Services.jsx
import './Services.css';

const SERVICES = [
  {
    id: 'transport-mgmt',
    icon: '🚛',
    title: 'Transport Management',
    desc: 'Organize and manage transportation operations with structured consignment records and efficient shipment workflows.',
  },
  {
    id: 'consignment-booking',
    icon: '📋',
    title: 'Consignment Booking',
    desc: 'Create comprehensive digital consignment records including docket numbers, dates, and full shipment details.',
  },
  {
    id: 'vendor-delivery',
    icon: '🏭',
    title: 'Vendor Delivery',
    desc: 'Manage vendor relationships and delivery information with complete consignor and consignee records.',
  },
  {
    id: 'shipment-records',
    icon: '📦',
    title: 'Shipment Records',
    desc: 'Maintain well-organized shipment records with item details, quantities, rates and calculated totals.',
  },
  {
    id: 'logistics-support',
    icon: '🔗',
    title: 'Logistics Support',
    desc: 'Simplify transportation operations through intuitive digital tools that replace paper-based record keeping.',
  },
  {
    id: 'delivery-mgmt',
    icon: '🚀',
    title: 'Delivery Management',
    desc: 'Manage consignee information and delivery details to keep track of where every shipment is headed.',
  },
];

export default function Services() {
  return (
    <section id="services" className="services section" aria-labelledby="services-heading">
      <div className="container">
        <header className="section-header">
          <span className="section-tag">Our Services</span>
          <h2 id="services-heading" className="section-title">
            Everything You Need for<br />
            <span className="highlight">Logistics Management</span>
          </h2>
          <p className="section-subtitle">
            CargoFlow provides a complete set of tools to manage your transportation
            and consignment operations from a single, easy-to-use platform.
          </p>
        </header>

        <div className="services-grid" role="list" aria-label="Available services">
          {SERVICES.map((service) => (
            <article
              key={service.id}
              id={`service-${service.id}`}
              className="service-card"
              role="listitem"
              aria-label={service.title}
            >
              <div className="service-icon" aria-hidden="true">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.desc}</p>
              <span className="service-link" aria-hidden="true">Learn more →</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
