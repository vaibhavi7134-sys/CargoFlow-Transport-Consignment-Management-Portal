// components/TrackOrder.jsx
import { useState, useMemo } from 'react';
import { formatINRCompact } from '../utils/calculations';
import './TrackOrder.css';

export default function TrackOrder({ consignments = [], onNavigate }) {
  const defaultDocket = consignments.length > 0 ? consignments[0].docketNumber : 'CF-849201';
  const [searchQuery, setSearchQuery] = useState(defaultDocket);
  const [activeDocket, setActiveDocket] = useState(defaultDocket);

  // Find in real consignments
  const matchedConsignment = useMemo(() => {
    if (!activeDocket) return null;
    return consignments.find(
      c => c.docketNumber?.trim().toUpperCase() === activeDocket.trim().toUpperCase()
    );
  }, [consignments, activeDocket]);

  // If found or simulated mock
  const orderDetails = useMemo(() => {
    if (matchedConsignment) {
      const isDelivered = matchedConsignment.status === 'Delivered';
      const isInTransit = matchedConsignment.status === 'In Transit';

      const bookingDate = new Date(matchedConsignment.date || matchedConsignment.createdAt || Date.now());
      const d1 = new Date(bookingDate);
      const d2 = new Date(bookingDate.getTime() + 6 * 3600000);
      const d3 = new Date(bookingDate.getTime() + 18 * 3600000);
      const d4 = new Date(bookingDate.getTime() + 32 * 3600000);
      const d5 = new Date(bookingDate.getTime() + 48 * 3600000);

      const formatStepDate = d =>
        new Intl.DateTimeFormat('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }).format(d);

      let currentStepIndex = 1;
      if (isDelivered) currentStepIndex = 4;
      else if (isInTransit) currentStepIndex = 2;

      return {
        docketNumber: matchedConsignment.docketNumber,
        customerName: matchedConsignment.customerName,
        status: matchedConsignment.status || 'Booked',
        origin: matchedConsignment.consignorCity || 'Mumbai Hub',
        destination: matchedConsignment.consigneeCity || 'Bengaluru Express Center',
        itemName: matchedConsignment.itemName || 'Commercial Cargo',
        quantity: matchedConsignment.quantity || 1,
        totalAmount: matchedConsignment.totalAmount || 0,
        steps: [
          {
            name: 'Booking Confirmed & Docket Generated',
            desc: `Consignment registered by ${matchedConsignment.consignorName || 'Consignor'}`,
            time: formatStepDate(d1),
            status: currentStepIndex >= 0 ? (currentStepIndex === 0 ? 'current' : 'completed') : 'pending',
          },
          {
            name: 'Package Picked & Inbound Scan',
            desc: `Processed at ${matchedConsignment.consignorCity || 'Origin'} Facility`,
            time: formatStepDate(d2),
            status: currentStepIndex >= 1 ? (currentStepIndex === 1 ? 'current' : 'completed') : 'pending',
          },
          {
            name: 'In Transit – High Priority Corridor',
            desc: 'Loaded onto express transport fleet',
            time: formatStepDate(d3),
            status: currentStepIndex >= 2 ? (currentStepIndex === 2 ? 'current' : 'completed') : 'pending',
          },
          {
            name: 'Arrived at Destination Distribution Hub',
            desc: `Sorted for final mile delivery at ${matchedConsignment.consigneeCity || 'Destination'}`,
            time: formatStepDate(d4),
            status: currentStepIndex >= 3 ? (currentStepIndex === 3 ? 'current' : 'completed') : 'pending',
          },
          {
            name: 'Out for Delivery / Handed to Consignee',
            desc: `Delivering to ${matchedConsignment.consigneeName || 'Consignee'}`,
            time: formatStepDate(d5),
            status: currentStepIndex >= 4 ? 'completed' : 'pending',
          },
        ],
      };
    }

    // Default realistic mock for demo tracking
    return {
      docketNumber: activeDocket || 'CF-849201',
      customerName: 'AeroLine Systems India',
      status: 'In Transit',
      origin: 'Mumbai Central Gateway',
      destination: 'New Delhi Air Cargo Hub',
      itemName: 'Industrial Spares & Sensors',
      quantity: 14,
      totalAmount: 18500,
      steps: [
        {
          name: 'Booking Confirmed & Docket Generated',
          desc: 'Consignment registered and invoice generated',
          time: 'Yesterday, 09:30 AM',
          status: 'completed',
        },
        {
          name: 'Package Picked & Inbound Scan',
          desc: 'Processed at Mumbai Central Terminal',
          time: 'Yesterday, 02:15 PM',
          status: 'completed',
        },
        {
          name: 'In Transit – High Priority Corridor',
          desc: 'Departed Mumbai, en route to New Delhi via NH-48 Express Fleet',
          time: 'Today, 06:45 AM',
          status: 'current',
        },
        {
          name: 'Arrived at Destination Distribution Hub',
          desc: 'Expected arrival at Delhi Air Cargo Terminal',
          time: 'Tomorrow, 08:00 AM (Est)',
          status: 'pending',
        },
        {
          name: 'Out for Delivery / Handed to Consignee',
          desc: 'Recipient: AeroLine Systems, Okhla Phase III',
          time: 'Tomorrow, 02:00 PM (Est)',
          status: 'pending',
        },
      ],
    };
  }, [matchedConsignment, activeDocket]);

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveDocket(searchQuery.trim().toUpperCase());
    }
  };

  const handleSelectChip = docket => {
    setSearchQuery(docket);
    setActiveDocket(docket);
  };

  return (
    <div className="track-page" aria-label="Shipment Tracking">
      {/* Search Bar Card */}
      <div className="track-search-card">
        <div className="track-search-header">
          <h2 className="track-search-title">Track Your Consignment</h2>
          <p className="track-search-sub">
            Real-time GPS dispatch and milestone updates for your cargo
          </p>
        </div>

        <form className="track-input-form" onSubmit={handleSearch}>
          <div className="track-input-wrapper">
            <span className="track-input-icon">🔍</span>
            <input
              type="text"
              className="track-input"
              placeholder="Enter Docket Number (e.g. CF-10293)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Docket Number"
              id="track-docket-input"
            />
          </div>
          <button type="submit" className="btn btn-primary track-btn" id="track-search-submit">
            Track Now
          </button>
        </form>

        {/* Quick Click Chips */}
        <div className="track-quick-tags">
          <span>Quick Select:</span>
          {consignments.slice(0, 4).map(c => (
            <button
              key={c.docketNumber}
              type="button"
              className="track-docket-chip"
              onClick={() => handleSelectChip(c.docketNumber)}
            >
              {c.docketNumber} ({c.status || 'Booked'})
            </button>
          ))}
          {consignments.length === 0 && (
            <button
              type="button"
              className="track-docket-chip"
              onClick={() => handleSelectChip('CF-849201')}
            >
              Demo: CF-849201 (In Transit)
            </button>
          )}
        </div>
      </div>

      {/* Tracking Result View */}
      <div className="track-result-card">
        <div className="track-result-header">
          <div className="track-docket-badge-group">
            <span className="track-docket-num">{orderDetails.docketNumber}</span>
            <span
              className={`badge badge-${
                orderDetails.status === 'Delivered'
                  ? 'delivered'
                  : orderDetails.status === 'In Transit'
                  ? 'transit'
                  : 'booked'
              }`}
            >
              {orderDetails.status}
            </span>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Customer: <strong style={{ color: 'var(--text-primary)' }}>{orderDetails.customerName}</strong>
          </div>
        </div>

        {/* Route Banner */}
        <div className="track-route-banner">
          <div className="track-route-city">
            <span className="track-route-label">Origin</span>
            <span className="track-route-name">{orderDetails.origin}</span>
          </div>
          <div className="track-route-arrow" aria-hidden="true" />
          <div className="track-route-city" style={{ textAlign: 'right' }}>
            <span className="track-route-label">Destination</span>
            <span className="track-route-name">{orderDetails.destination}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="track-details-grid">
          <div className="track-detail-item">
            <span className="track-detail-label">Item Description</span>
            <span className="track-detail-value">{orderDetails.itemName}</span>
          </div>
          <div className="track-detail-item">
            <span className="track-detail-label">Total Units</span>
            <span className="track-detail-value">{orderDetails.quantity} Packages</span>
          </div>
          <div className="track-detail-item">
            <span className="track-detail-label">Consignment Value</span>
            <span className="track-detail-value">{formatINRCompact(orderDetails.totalAmount)}</span>
          </div>
          <div className="track-detail-item">
            <span className="track-detail-label">Live Dispatch</span>
            <span className="track-detail-value" style={{ color: 'var(--color-emerald)' }}>
              ● Operational
            </span>
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="track-timeline-container">
          <h3 className="track-timeline-title">Consignment Milestones</h3>
          <div className="track-timeline" role="list">
            {orderDetails.steps.map((step, idx) => (
              <div
                key={idx}
                className={`track-timeline-step ${step.status}`}
                role="listitem"
              >
                <div className="track-step-node" aria-hidden="true">
                  {step.status === 'completed' ? '✓' : idx + 1}
                </div>
                <div className="track-step-content">
                  <div className="track-step-main">
                    <span className="track-step-name">{step.name}</span>
                    <span className="track-step-desc">{step.desc}</span>
                  </div>
                  <span className="track-step-time">{step.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
