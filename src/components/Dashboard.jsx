// components/Dashboard.jsx
import { useMemo } from 'react';
import { formatINRCompact } from '../utils/calculations';
import './Dashboard.css';

/* ---- Bar Sparkline (SVG-based) ---- */
function BarSparkline({ data = [], color = '#7C3AED' }) {
  const max = Math.max(...data, 1);
  return (
    <div className="bar-sparkline" aria-hidden="true">
      {data.map((v, i) => (
        <div
          key={i}
          className="bar-sparkline-bar"
          style={{
            height: `${Math.max((v / max) * 100, 8)}%`,
            background: color,
            opacity: 0.4 + (i / data.length) * 0.6,
          }}
        />
      ))}
    </div>
  );
}

/* ---- CSS Donut Chart ---- */
function DonutChart({ segments }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let acc = 0;
  const gradient = segments
    .map(seg => {
      const pct = (seg.value / total) * 100;
      const from = acc;
      acc += pct;
      return `${seg.color} ${from}% ${acc}%`;
    })
    .join(', ');

  return (
    <div className="donut-wrapper" aria-label="Shipment status breakdown">
      <div className="donut" style={{ background: `conic-gradient(${gradient})` }}>
        <div className="donut-hole">
          <span className="donut-total">{total}</span>
          <span className="donut-label">Total</span>
        </div>
      </div>
      <div className="donut-legend">
        {segments.map(seg => (
          <div key={seg.label} className="donut-legend-item">
            <span className="donut-legend-dot" style={{ background: seg.color }} />
            <span className="donut-legend-text">
              {seg.label} — {seg.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Main Dashboard Component ---- */
export default function Dashboard({ consignments = [], onNavigate }) {
  /* Analytics */
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = consignments.filter(c => {
      const d = new Date(c.date || c.createdAt);
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });

    const totalRevenue = consignments.reduce(
      (s, c) => s + (c.totalAmount || 0),
      0
    );
    const avgQty =
      consignments.length > 0
        ? consignments.reduce((s, c) => s + (c.quantity || 0), 0) /
          consignments.length
        : 0;

    // Last 7 months order counts
    const monthlyOrders = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (6 - i));
      return consignments.filter(c => {
        const cd = new Date(c.date || c.createdAt);
        return (
          cd.getMonth() === d.getMonth() &&
          cd.getFullYear() === d.getFullYear()
        );
      }).length;
    });

    // Last 7 months revenue
    const monthlyRevenue = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (6 - i));
      return consignments
        .filter(c => {
          const cd = new Date(c.date || c.createdAt);
          return (
            cd.getMonth() === d.getMonth() &&
            cd.getFullYear() === d.getFullYear()
          );
        })
        .reduce((s, c) => s + (c.totalAmount || 0), 0);
    });

    // Demo fallback for empty state so charts look alive
    const demoOrders  = [2, 5, 3, 8, 6, 4, 9];
    const demoRevenue = [1200, 3400, 2100, 5800, 4200, 3100, 6500];
    const demoQty     = [3, 7, 4, 10, 8, 5, 11];

    const isEmpty = consignments.length === 0;

    return {
      totalOrders:     consignments.length,
      thisMonthOrders: thisMonth.length,
      totalRevenue,
      avgQty:          Number(avgQty.toFixed(1)),
      monthlyOrders:   isEmpty ? demoOrders  : monthlyOrders,
      monthlyRevenue:  isEmpty ? demoRevenue : monthlyRevenue,
      monthlyQty:      isEmpty ? demoQty     : monthlyOrders.map(v => Math.round(v * avgQty || 0)),
      isEmpty,
    };
  }, [consignments]);

  /* Recent 5 shipments */
  const recent = useMemo(
    () =>
      [...consignments]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [consignments]
  );

  /* Donut segments */
  const donutSegments = useMemo(() => {
    if (consignments.length === 0)
      return [{ label: 'No data', value: 1, color: '#E5E7EB' }];
    const booked    = consignments.filter(c => c.status === 'Booked').length;
    const inTransit = consignments.filter(c => c.status === 'In Transit').length;
    const delivered = consignments.filter(c => c.status === 'Delivered').length;
    const other     = consignments.length - booked - inTransit - delivered;
    return [
      { label: 'Booked',     value: booked + other, color: '#7C3AED' },
      { label: 'In Transit', value: inTransit,       color: '#A78BFA' },
      { label: 'Delivered',  value: delivered,       color: '#10B981' },
    ].filter(s => s.value > 0);
  }, [consignments]);

  const formatDate = str => {
    if (!str) return '—';
    try {
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
      }).format(new Date(str));
    } catch {
      return str;
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todayStr = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="dashboard" aria-label="Dashboard overview">

      {/* ---- Greeting ---- */}
      <div className="dash-greeting">
        <div>
          <h2 className="dash-greeting-title">
            {greeting()}, Operator! 👋
          </h2>
          <p className="dash-greeting-sub">
            {todayStr}
            {stats.isEmpty
              ? ' · Welcome! Create your first booking to get started.'
              : ` · ${stats.thisMonthOrders} order${stats.thisMonthOrders !== 1 ? 's' : ''} this month · ${formatINRCompact(stats.totalRevenue)} total revenue`}
          </p>
        </div>
        <button
          className="btn btn-primary dash-new-btn"
          onClick={() => onNavigate('booking')}
          id="dash-new-booking-btn"
        >
          + New Booking
        </button>
      </div>

      {/* ---- Stats Cards ---- */}
      <div className="dash-stats-grid" role="region" aria-label="Key statistics">
        {/* Orders */}
        <div className="dash-stat-card">
          <div className="dash-stat-top">
            <div>
              <div className="dash-stat-label">This Month Orders</div>
              <div className="dash-stat-value">
                {stats.isEmpty ? '—' : stats.thisMonthOrders}
              </div>
              <div className="dash-stat-sub">
                {stats.isEmpty
                  ? 'No data yet'
                  : `of ${stats.totalOrders} total orders`}
              </div>
            </div>
            <BarSparkline data={stats.monthlyOrders} color="#7C3AED" />
          </div>
        </div>

        {/* Revenue */}
        <div className="dash-stat-card">
          <div className="dash-stat-top">
            <div>
              <div className="dash-stat-label">Total Revenue</div>
              <div className="dash-stat-value">
                {stats.isEmpty ? '—' : formatINRCompact(stats.totalRevenue)}
              </div>
              <div className="dash-stat-sub">across all shipments</div>
            </div>
            <BarSparkline data={stats.monthlyRevenue} color="#10B981" />
          </div>
        </div>

        {/* Avg Qty */}
        <div className="dash-stat-card">
          <div className="dash-stat-top">
            <div>
              <div className="dash-stat-label">Avg Items / Shipment</div>
              <div className="dash-stat-value">
                {stats.isEmpty ? '—' : stats.avgQty || '0'}
              </div>
              <div className="dash-stat-sub">units per consignment</div>
            </div>
            <BarSparkline data={stats.monthlyQty} color="#F59E0B" />
          </div>
        </div>
      </div>

      {/* ---- Middle Row ---- */}
      <div className="dash-mid-grid">
        {/* Recent Shipments */}
        <div className="dash-card" role="region" aria-label="Recent shipments">
          <div className="dash-card-header">
            <h3 className="dash-card-title">Recent Shipments</h3>
            <button
              className="dash-view-all"
              onClick={() => onNavigate('shipments')}
              aria-label="View all shipments"
            >
              View all →
            </button>
          </div>

          {recent.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-icon">📭</div>
              <p>
                No shipments yet.{' '}
                <button
                  className="dash-empty-link"
                  onClick={() => onNavigate('booking')}
                >
                  Create one →
                </button>
              </p>
            </div>
          ) : (
            <div className="dash-recent-list">
              {recent.map(c => (
                <div key={c.docketNumber} className="dash-recent-item">
                  <div className="dash-recent-docket">{c.docketNumber}</div>
                  <div className="dash-recent-info">
                    <span className="dash-recent-name">{c.customerName}</span>
                    <span className="dash-recent-date">
                      {formatDate(c.date || c.createdAt)}
                    </span>
                  </div>
                  <div className="dash-recent-right">
                    <span className="dash-recent-amount">
                      {formatINRCompact(c.totalAmount)}
                    </span>
                    <span
                      className="badge badge-booked"
                      style={{ fontSize: '0.68rem' }}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Donut */}
        <div className="dash-card" role="region" aria-label="Status breakdown">
          <div className="dash-card-header">
            <h3 className="dash-card-title">Status Breakdown</h3>
          </div>
          <DonutChart segments={donutSegments} />
        </div>
      </div>

      {/* ---- Quick Actions ---- */}
      <div
        className="dash-actions-grid"
        role="region"
        aria-label="Quick actions"
      >
        {[
          {
            icon: '📦',
            label: 'New Booking',
            sub: 'Create a consignment',
            page: 'booking',
            id: 'qa-booking',
          },
          {
            icon: '📋',
            label: 'All Shipments',
            sub: 'View & manage orders',
            page: 'shipments',
            id: 'qa-shipments',
          },
          {
            icon: '📍',
            label: 'Track Order',
            sub: 'Real-time tracking',
            page: 'track',
            id: 'qa-track',
          },
          {
            icon: '💬',
            label: 'Get Support',
            sub: 'Contact our team',
            page: 'contact',
            id: 'qa-contact',
          },
        ].map(item => (
          <button
            key={item.page}
            id={item.id}
            className="dash-action-card"
            onClick={() => onNavigate(item.page)}
            aria-label={item.label}
          >
            <span className="dash-action-icon">{item.icon}</span>
            <span className="dash-action-label">{item.label}</span>
            <span className="dash-action-sub">{item.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
