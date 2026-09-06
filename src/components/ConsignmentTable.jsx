// components/ConsignmentTable.jsx
import { useState, useMemo } from 'react';
import { deleteConsignmentByDocket } from '../utils/storage';
import { formatINRCompact } from '../utils/calculations';
import './ConsignmentTable.css';

export default function ConsignmentTable({ consignments, onConsignmentsChange, onNavigate }) {
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy]             = useState('date-desc');
  const [deletedDocket, setDeletedDocket] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    let result = [...consignments];

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter(c => (c.status || 'Booked') === statusFilter);
    }

    // Search query
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        c =>
          c.docketNumber?.toLowerCase().includes(q) ||
          c.customerName?.toLowerCase().includes(q) ||
          c.itemName?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0);
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date || a.createdAt || 0) - new Date(b.date || b.createdAt || 0);
      }
      if (sortBy === 'amount-desc') {
        return (b.totalAmount || 0) - (a.totalAmount || 0);
      }
      if (sortBy === 'amount-asc') {
        return (a.totalAmount || 0) - (b.totalAmount || 0);
      }
      if (sortBy === 'docket-asc') {
        return (a.docketNumber || '').localeCompare(b.docketNumber || '');
      }
      return 0;
    });

    return result;
  }, [consignments, search, statusFilter, sortBy]);

  // Counts for pills
  const counts = useMemo(() => {
    const total = consignments.length;
    const booked = consignments.filter(c => (c.status || 'Booked') === 'Booked').length;
    const transit = consignments.filter(c => c.status === 'In Transit').length;
    const delivered = consignments.filter(c => c.status === 'Delivered').length;
    return { total, booked, transit, delivered };
  }, [consignments]);

  const handleDelete = (docketNumber) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete consignment "${docketNumber}"?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    const updated = deleteConsignmentByDocket(docketNumber);
    setDeletedDocket(docketNumber);
    if (onConsignmentsChange) onConsignmentsChange(updated);

    setTimeout(() => setDeletedDocket(''), 300);
  };

  const handleExportCSV = () => {
    if (consignments.length === 0) {
      alert('No records available to export.');
      return;
    }

    const headers = [
      'Docket Number',
      'Date',
      'Customer Name',
      'Customer Address',
      'Consignor Name',
      'Consignor Address',
      'Item Name',
      'Quantity',
      'Rate',
      'Total Amount',
      'Consignee Name',
      'Consignee Address',
      'Status',
    ];

    const rows = consignments.map(c => [
      `"${c.docketNumber || ''}"`,
      `"${c.date || ''}"`,
      `"${c.customerName || ''}"`,
      `"${(c.customerAddress || '').replace(/"/g, '""')}"`,
      `"${c.consignorName || ''}"`,
      `"${(c.consignorAddress || '').replace(/"/g, '""')}"`,
      `"${c.itemName || ''}"`,
      c.quantity || 0,
      c.rate || 0,
      c.totalAmount || 0,
      `"${c.consigneeName || ''}"`,
      `"${(c.consigneeAddress || '').replace(/"/g, '""')}"`,
      `"${c.status || 'Booked'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cargoflow_consignments_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  const hasConsignments = consignments.length > 0;
  const hasResults = filteredAndSorted.length > 0;

  return (
    <section id="consignments" className="consignment-table-section section" aria-labelledby="consignments-heading">
      <div className="container">
        <header className="section-header">
          <span className="section-tag">Logistics Records</span>
          <h2 id="consignments-heading" className="section-title">
            Consignment <span className="highlight">Management</span>
          </h2>
          <p className="section-subtitle">
            Search, filter, track, and export active freight dispatches and historical archives.
          </p>
        </header>

        {/* Controls Bar */}
        <div className="ct-controls-bar">
          {/* Top Filter Row: Status Pills */}
          <div className="ct-filter-row">
            <div className="ct-pills" role="tablist" aria-label="Filter by status">
              {[
                { id: 'All', label: 'All Shipments', count: counts.total },
                { id: 'Booked', label: 'Booked', count: counts.booked },
                { id: 'In Transit', label: 'In Transit', count: counts.transit },
                { id: 'Delivered', label: 'Delivered', count: counts.delivered },
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`ct-pill${statusFilter === tab.id ? ' active' : ''}`}
                  onClick={() => setStatusFilter(tab.id)}
                  role="tab"
                  aria-selected={statusFilter === tab.id}
                >
                  <span>{tab.label}</span>
                  <span className="ct-pill-badge">{tab.count}</span>
                </button>
              ))}
            </div>

            <button
              className="ct-export-btn"
              onClick={handleExportCSV}
              title="Download records as CSV"
              aria-label="Export CSV"
            >
              📥 Export CSV
            </button>
          </div>

          {/* Bottom Actions Row: Search, Sort & Count */}
          <div className="ct-actions-row">
            <p className="ct-count">
              Showing <strong>{filteredAndSorted.length}</strong> of <strong>{consignments.length}</strong> consignment{consignments.length !== 1 ? 's' : ''}
            </p>

            <div className="ct-tools">
              <div className="ct-search search-wrapper">
                <span className="search-icon" aria-hidden="true">🔍</span>
                <input
                  id="consignment-search"
                  type="search"
                  className="search-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search docket, customer, item..."
                  aria-label="Search consignments"
                />
              </div>

              <select
                className="ct-sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                aria-label="Sort consignments"
              >
                <option value="date-desc">Date: Newest first</option>
                <option value="date-asc">Date: Oldest first</option>
                <option value="amount-desc">Amount: High to Low</option>
                <option value="amount-asc">Amount: Low to High</option>
                <option value="docket-asc">Docket: A–Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="ct-table-wrapper" role="region" aria-label="Consignments table">
          {!hasConsignments ? (
            <div className="ct-empty empty-state">
              <div className="empty-state-icon" aria-hidden="true">📭</div>
              <h3 className="empty-state-title">No consignments have been created yet.</h3>
              <p className="empty-state-desc">
                Create your first consignment using the booking form.
              </p>
              {onNavigate && (
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '16px' }}
                  onClick={() => onNavigate('booking')}
                >
                  + New Booking
                </button>
              )}
            </div>
          ) : !hasResults ? (
            <div className="ct-empty empty-state">
              <div className="empty-state-icon" aria-hidden="true">🔍</div>
              <h3 className="empty-state-title">No matching consignments found.</h3>
              <p className="empty-state-desc">
                Try clearing your search query or switching status filters.
              </p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: '14px' }}
                onClick={() => { setSearch(''); setStatusFilter('All'); }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="ct-table-scroll">
                <table className="ct-table" aria-label="Consignment records">
                  <thead>
                    <tr>
                      <th scope="col">Docket No.</th>
                      <th scope="col">Date</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Consignor</th>
                      <th scope="col">Item Details</th>
                      <th scope="col">Qty</th>
                      <th scope="col">Total Amount</th>
                      <th scope="col">Consignee</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSorted.map((c) => (
                      <tr
                        key={c.docketNumber}
                        className={c.docketNumber === deletedDocket ? '' : 'ct-row-new'}
                        aria-label={`Consignment ${c.docketNumber}`}
                      >
                        <td>{c.docketNumber}</td>
                        <td>{formatDate(c.date || c.createdAt)}</td>
                        <td>
                          <div><strong>{c.customerName}</strong></div>
                          <div className="ct-address" title={c.customerAddress} style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {c.customerAddress}
                          </div>
                        </td>
                        <td>
                          <div>{c.consignorName}</div>
                          <div className="ct-address" title={c.consignorAddress} style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {c.consignorAddress}
                          </div>
                        </td>
                        <td>
                          <div>{c.itemName}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            @ ₹{c.rate}/unit
                          </div>
                        </td>
                        <td><strong>{c.quantity}</strong></td>
                        <td className="ct-total">{formatINRCompact(c.totalAmount)}</td>
                        <td>
                          <div>{c.consigneeName}</div>
                          <div className="ct-address" title={c.consigneeAddress} style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {c.consigneeAddress}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge badge-${
                              c.status === 'Delivered'
                                ? 'delivered'
                                : c.status === 'In Transit'
                                ? 'transit'
                                : 'booked'
                            }`}
                            aria-label={`Status: ${c.status || 'Booked'}`}
                          >
                            {c.status || 'Booked'}
                          </span>
                        </td>
                        <td className="ct-action">
                          <div className="ct-action-group">
                            <button
                              className="ct-btn-receipt"
                              onClick={() => setSelectedReceipt(c)}
                              title="View receipt"
                              aria-label={`View receipt for ${c.docketNumber}`}
                            >
                              📄
                            </button>
                            {onNavigate && (
                              <button
                                className="ct-btn-track"
                                onClick={() => onNavigate('track')}
                                title="Track this consignment"
                                aria-label={`Track ${c.docketNumber}`}
                              >
                                📍
                              </button>
                            )}
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(c.docketNumber)}
                              aria-label={`Delete consignment ${c.docketNumber}`}
                              id={`delete-${c.docketNumber}`}
                              title="Delete record"
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="ct-table-footer">
                <div>
                  Showing {filteredAndSorted.length} of {consignments.length} records
                  {search && ` (filtered by "${search}")`}
                </div>
                <div style={{ color: 'var(--color-violet)', fontWeight: 600 }}>
                  Total Value: {formatINRCompact(filteredAndSorted.reduce((s, c) => s + (c.totalAmount || 0), 0))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div
          className="receipt-modal-backdrop"
          onClick={() => setSelectedReceipt(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="receipt-title"
        >
          <div className="receipt-modal" onClick={e => e.stopPropagation()}>
            <div className="receipt-header">
              <div className="receipt-title" id="receipt-title">
                Consignment Note: {selectedReceipt.docketNumber}
              </div>
              <button
                style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
                onClick={() => setSelectedReceipt(null)}
                aria-label="Close receipt"
              >
                ✕
              </button>
            </div>

            <div className="receipt-body">
              <div className="receipt-row">
                <span className="receipt-label">Booking Date</span>
                <span className="receipt-value">{formatDate(selectedReceipt.date || selectedReceipt.createdAt)}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Customer</span>
                <span className="receipt-value">{selectedReceipt.customerName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Consignor (Origin)</span>
                <span className="receipt-value">{selectedReceipt.consignorName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Consignee (Destination)</span>
                <span className="receipt-value">{selectedReceipt.consigneeName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Item Description</span>
                <span className="receipt-value">{selectedReceipt.itemName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Quantity × Rate</span>
                <span className="receipt-value">{selectedReceipt.quantity} units × ₹{selectedReceipt.rate}</span>
              </div>
              <div className="receipt-total-box">
                <span style={{ fontWeight: 600, color: 'var(--color-violet)' }}>Total Consignment Amount:</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-violet)' }}>
                  {formatINRCompact(selectedReceipt.totalAmount)}
                </span>
              </div>
            </div>

            <div className="receipt-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedReceipt(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                🖨 Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
