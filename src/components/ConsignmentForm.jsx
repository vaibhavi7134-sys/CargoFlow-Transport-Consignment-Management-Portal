// components/ConsignmentForm.jsx
import { useState, useCallback } from 'react';
import { validateConsignmentForm } from '../utils/validation';
import { calculateTotal, formatINRCompact } from '../utils/calculations';
import { addConsignment } from '../utils/storage';
import './ConsignmentForm.css';

const INITIAL_FORM = {
  docketNumber: '',
  date: '',
  customerName: '',
  customerAddress: '',
  consignorName: '',
  consignorAddress: '',
  itemName: '',
  quantity: '',
  rate: '',
  consigneeName: '',
  consigneeAddress: '',
};

const STEPS = [
  { id: 0, label: 'General & Customer', icon: '🚀' },
  { id: 1, label: 'Consignor & Consignee', icon: '🏭' },
  { id: 2, label: 'Cargo & Pricing', icon: '📦' },
  { id: 3, label: 'Review & Confirm', icon: '✅' },
];

export default function ConsignmentForm({ onConsignmentAdded }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [lastDocket, setLastDocket] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Computed total
  const total = calculateTotal(form.quantity, form.rate);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }, [errors]);

  const handleFillDemo = () => {
    const randomId = Math.floor(10000 + Math.random() * 90000);
    const today = new Date().toISOString().split('T')[0];
    setForm({
      docketNumber: `CF-EXP-${randomId}`,
      date: today,
      customerName: 'AeroLine Systems India',
      customerAddress: 'Plot 45, Industrial Suburb, Whitefield, Bengaluru - 560066',
      consignorName: 'Apex Precision Engineering',
      consignorAddress: 'Gate 2, MIDC Industrial Area, Andheri East, Mumbai - 400093',
      itemName: 'Precision Avionics Components & Sensors',
      quantity: '12',
      rate: '1500',
      consigneeName: 'Global Aerospace Logistics',
      consigneeAddress: 'Terminal 3 Cargo Complex, Kempegowda Intl Airport, Devanahalli, Bengaluru - 560300',
    });
    setErrors({});
  };

  // Validate only fields corresponding to current step
  const validateStep = (stepIndex) => {
    const { errors: allErrors } = validateConsignmentForm(form);
    const stepErrors = {};

    if (stepIndex === 0) {
      ['docketNumber', 'date', 'customerName', 'customerAddress'].forEach(k => {
        if (allErrors[k]) stepErrors[k] = allErrors[k];
      });
    } else if (stepIndex === 1) {
      ['consignorName', 'consignorAddress', 'consigneeName', 'consigneeAddress'].forEach(k => {
        if (allErrors[k]) stepErrors[k] = allErrors[k];
      });
    } else if (stepIndex === 2) {
      ['itemName', 'quantity', 'rate'].forEach(k => {
        if (allErrors[k]) stepErrors[k] = allErrors[k];
      });
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(s => Math.max(s - 1, 0));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setSubmitting(true);

    const { isValid, errors: validationErrors } = validateConsignmentForm(form);
    if (!isValid) {
      setErrors(validationErrors);
      setSubmitting(false);

      // Identify which step contains the first error
      const keys = Object.keys(validationErrors);
      if (keys.some(k => ['docketNumber', 'date', 'customerName', 'customerAddress'].includes(k))) {
        setCurrentStep(0);
      } else if (keys.some(k => ['consignorName', 'consignorAddress', 'consigneeName', 'consigneeAddress'].includes(k))) {
        setCurrentStep(1);
      } else if (keys.some(k => ['itemName', 'quantity', 'rate'].includes(k))) {
        setCurrentStep(2);
      }
      return;
    }

    // Build record
    const consignment = {
      docketNumber: form.docketNumber.trim(),
      date: form.date,
      customerName: form.customerName.trim(),
      customerAddress: form.customerAddress.trim(),
      consignorName: form.consignorName.trim(),
      consignorAddress: form.consignorAddress.trim(),
      itemName: form.itemName.trim(),
      quantity: Number(form.quantity),
      rate: Number(form.rate),
      totalAmount: total,
      consigneeName: form.consigneeName.trim(),
      consigneeAddress: form.consigneeAddress.trim(),
      status: 'Booked',
      createdAt: new Date().toISOString(),
    };

    const updated = addConsignment(consignment);
    setLastDocket(consignment.docketNumber);
    setShowSuccess(true);
    setForm(INITIAL_FORM);
    setErrors({});
    setCurrentStep(0);
    setSubmitting(false);

    if (onConsignmentAdded) onConsignmentAdded(updated);

    setTimeout(() => {
      document.getElementById('cf-success-bar')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    setTimeout(() => setShowSuccess(false), 8000);
  }, [form, total, onConsignmentAdded]);

  const Field = ({ id, label, name, type = 'text', placeholder, required = true, inputMode }) => (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`form-input${errors[name] ? ' error' : ''}`}
        aria-required={required}
        aria-describedby={errors[name] ? `${id}-error` : undefined}
        aria-invalid={errors[name] ? 'true' : undefined}
      />
      {errors[name] && (
        <span id={`${id}-error`} className="form-error" role="alert">
          ⚠ {errors[name]}
        </span>
      )}
    </div>
  );

  const TextareaField = ({ id, label, name, placeholder, required = true }) => (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required" aria-hidden="true">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`form-textarea${errors[name] ? ' error' : ''}`}
        aria-required={required}
        aria-describedby={errors[name] ? `${id}-error` : undefined}
        aria-invalid={errors[name] ? 'true' : undefined}
      />
      {errors[name] && (
        <span id={`${id}-error`} className="form-error" role="alert">
          ⚠ {errors[name]}
        </span>
      )}
    </div>
  );

  return (
    <section
      id="book"
      className="consignment-form-section section"
      aria-labelledby="book-heading"
    >
      <div className="container">
        <header className="section-header">
          <span className="section-tag">Direct Booking System</span>
          <h2 id="book-heading" className="section-title">
            Book a <span className="highlight">Consignment</span>
          </h2>
          <p className="section-subtitle">
            Enter dispatch specifications in our structured 4-step workflow. Automatic valuation & instant docket logging.
          </p>
        </header>

        {/* Stepper Progress */}
        <div className="cf-stepper" aria-label="Booking steps">
          <div className="cf-stepper-progress-bg" aria-hidden="true">
            <div
              className="cf-stepper-progress-fill"
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
          {STEPS.map((step, idx) => (
            <button
              key={step.id}
              type="button"
              className={`cf-step-item${currentStep === idx ? ' active' : ''}${currentStep > idx ? ' completed' : ''}`}
              onClick={() => {
                if (idx < currentStep || validateStep(currentStep)) {
                  setCurrentStep(idx);
                }
              }}
              aria-current={currentStep === idx ? 'step' : undefined}
            >
              <div className="cf-step-circle">
                {currentStep > idx ? '✓' : idx + 1}
              </div>
              <span className="cf-step-label">{step.label}</span>
            </button>
          ))}
        </div>

        {/* Success Banner */}
        {showSuccess && (
          <div id="cf-success-bar" className="cf-success-bar" role="status" aria-live="polite">
            <span className="cf-success-icon" aria-hidden="true">✅</span>
            <div>
              <div className="cf-success-title">Consignment Submitted Successfully!</div>
              <div className="cf-success-msg">
                Docket <strong>{lastDocket}</strong> has been logged to records and is ready for live tracking.
              </div>
            </div>
          </div>
        )}

        <form
          id="consignment-booking-form"
          className="cf-form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Consignment booking form"
        >
          {/* ── STEP 0: General & Customer Details ── */}
          {currentStep === 0 && (
            <>
              <div className="cf-card">
                <div className="cf-card-header">
                  <div className="cf-card-header-left">
                    <div className="cf-card-icon" aria-hidden="true">🚀</div>
                    <div>
                      <div className="cf-card-title">Shipment Details</div>
                      <div className="cf-card-subtitle">Docket tracking reference and date</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cf-sample-btn"
                    onClick={handleFillDemo}
                    title="Auto-populate sample test data"
                  >
                    ⚡ Auto-Fill Demo
                  </button>
                </div>
                <div className="cf-card-body">
                  <div className="cf-row">
                    <Field
                      id="docketNumber"
                      label="Docket Number"
                      name="docketNumber"
                      placeholder="e.g. CF-2026-9041"
                    />
                    <Field
                      id="date"
                      label="Date"
                      name="date"
                      type="date"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              <div className="cf-card">
                <div className="cf-card-header">
                  <div className="cf-card-header-left">
                    <div className="cf-card-icon" aria-hidden="true">👤</div>
                    <div>
                      <div className="cf-card-title">Customer Details</div>
                      <div className="cf-card-subtitle">Primary client or enterprise account</div>
                    </div>
                  </div>
                </div>
                <div className="cf-card-body">
                  <Field
                    id="customerName"
                    label="Customer Name"
                    name="customerName"
                    placeholder="Enter customer or enterprise name"
                  />
                  <TextareaField
                    id="customerAddress"
                    label="Customer Address"
                    name="customerAddress"
                    placeholder="Complete corporate or billing address"
                  />
                </div>
              </div>
            </>
          )}

          {/* ── STEP 1: Consignor & Consignee ── */}
          {currentStep === 1 && (
            <>
              <div className="cf-card">
                <div className="cf-card-header">
                  <div className="cf-card-header-left">
                    <div className="cf-card-icon" aria-hidden="true">🏭</div>
                    <div>
                      <div className="cf-card-title">Consignor Details (Shipper)</div>
                      <div className="cf-card-subtitle">Dispatch location and sender contact</div>
                    </div>
                  </div>
                </div>
                <div className="cf-card-body">
                  <Field
                    id="consignorName"
                    label="Consignor Name"
                    name="consignorName"
                    placeholder="Sender name or company"
                  />
                  <TextareaField
                    id="consignorAddress"
                    label="Consignor Address"
                    name="consignorAddress"
                    placeholder="Pickup address with city and pin"
                  />
                </div>
              </div>

              <div className="cf-card">
                <div className="cf-card-header">
                  <div className="cf-card-header-left">
                    <div className="cf-card-icon" aria-hidden="true">📍</div>
                    <div>
                      <div className="cf-card-title">Consignee Details (Receiver)</div>
                      <div className="cf-card-subtitle">Destination facility and receiving party</div>
                    </div>
                  </div>
                </div>
                <div className="cf-card-body">
                  <Field
                    id="consigneeName"
                    label="Consignee Name"
                    name="consigneeName"
                    placeholder="Recipient or receiving depot"
                  />
                  <TextareaField
                    id="consigneeAddress"
                    label="Consignee Address"
                    name="consigneeAddress"
                    placeholder="Delivery address with city and pin"
                  />
                </div>
              </div>
            </>
          )}

          {/* ── STEP 2: Item Details & Commercials ── */}
          {currentStep === 2 && (
            <div className="cf-card">
              <div className="cf-card-header">
                <div className="cf-card-header-left">
                  <div className="cf-card-icon" aria-hidden="true">📦</div>
                  <div>
                    <div className="cf-card-title">Cargo Specifications & Valuation</div>
                    <div className="cf-card-subtitle">Auto-calculated: Quantity × Rate = Total</div>
                  </div>
                </div>
              </div>
              <div className="cf-card-body">
                <Field
                  id="itemName"
                  label="Item Name & Specification"
                  name="itemName"
                  placeholder="e.g. Industrial Automation Spares"
                />
                <div className="cf-row">
                  <Field
                    id="quantity"
                    label="Quantity (Units/Packages)"
                    name="quantity"
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g. 25"
                  />
                  <Field
                    id="rate"
                    label="Rate per Unit (₹)"
                    name="rate"
                    type="number"
                    inputMode="decimal"
                    placeholder="e.g. 450"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Total Valuation
                    <span style={{ marginLeft: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      (auto-calculated: Qty × Rate)
                    </span>
                  </label>
                  <div className="cf-total-display" aria-live="polite" aria-label={`Total amount: ${formatINRCompact(total)}`}>
                    <span className="cf-total-label">Total Amount</span>
                    <span style={{ fontSize: total > 0 ? '1.4rem' : '1rem', color: total > 0 ? 'var(--color-violet)' : 'var(--text-muted)' }}>
                      {total > 0 ? formatINRCompact(total) : '—'}
                    </span>
                  </div>
                  <span className="cf-total-formula" aria-hidden="true">
                    Formula: Quantity × Rate = Total &nbsp;|&nbsp;
                    {form.quantity && form.rate
                      ? `${form.quantity} × ₹${form.rate} = ${formatINRCompact(total)}`
                      : 'Enter quantity and rate above'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Review & Confirmation ── */}
          {currentStep === 3 && (
            <div className="cf-card">
              <div className="cf-card-header">
                <div className="cf-card-header-left">
                  <div className="cf-card-icon" aria-hidden="true">📋</div>
                  <div>
                    <div className="cf-card-title">Review Consignment Booking</div>
                    <div className="cf-card-subtitle">Verify details before final logging</div>
                  </div>
                </div>
              </div>

              <div className="cf-card-body">
                <div className="cf-review-grid">
                  <div className="cf-review-block">
                    <div className="cf-review-block-title">🚀 Shipment Details</div>
                    <div className="cf-review-list">
                      <div className="cf-review-row">
                        <span className="cf-review-key">Docket No:</span>
                        <span className="cf-review-val">{form.docketNumber || '—'}</span>
                      </div>
                      <div className="cf-review-row">
                        <span className="cf-review-key">Booking Date:</span>
                        <span className="cf-review-val">{form.date || '—'}</span>
                      </div>
                      <div className="cf-review-row">
                        <span className="cf-review-key">Customer:</span>
                        <span className="cf-review-val">{form.customerName || '—'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="cf-review-block">
                    <div className="cf-review-block-title">📦 Cargo Valuation</div>
                    <div className="cf-review-list">
                      <div className="cf-review-row">
                        <span className="cf-review-key">Item:</span>
                        <span className="cf-review-val">{form.itemName || '—'}</span>
                      </div>
                      <div className="cf-review-row">
                        <span className="cf-review-key">Quantity:</span>
                        <span className="cf-review-val">{form.quantity} units</span>
                      </div>
                      <div className="cf-review-row">
                        <span className="cf-review-key">Rate / Unit:</span>
                        <span className="cf-review-val">₹{form.rate}</span>
                      </div>
                      <div className="cf-review-row" style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid var(--border-color)' }}>
                        <span className="cf-review-key" style={{ fontWeight: 700, color: 'var(--color-violet)' }}>Total:</span>
                        <span className="cf-review-val" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-violet)' }}>
                          {formatINRCompact(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="cf-review-block">
                    <div className="cf-review-block-title">🏭 Origin (Consignor)</div>
                    <div className="cf-review-list">
                      <div className="cf-review-row">
                        <span className="cf-review-key">Name:</span>
                        <span className="cf-review-val">{form.consignorName || '—'}</span>
                      </div>
                      <div className="cf-review-row">
                        <span className="cf-review-key">Address:</span>
                        <span className="cf-review-val">{form.consignorAddress || '—'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="cf-review-block">
                    <div className="cf-review-block-title">📍 Destination (Consignee)</div>
                    <div className="cf-review-list">
                      <div className="cf-review-row">
                        <span className="cf-review-key">Name:</span>
                        <span className="cf-review-val">{form.consigneeName || '—'}</span>
                      </div>
                      <div className="cf-review-row">
                        <span className="cf-review-key">Address:</span>
                        <span className="cf-review-val">{form.consigneeAddress || '—'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Wizard Navigation Bar ── */}
          <div className="cf-wizard-nav">
            <div>
              {currentStep > 0 ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handlePrev}
                  aria-label="Previous Step"
                >
                  ← Back
                </button>
              ) : (
                <button
                  type="button"
                  className="cf-sample-btn"
                  onClick={handleFillDemo}
                >
                  ⚡ Fill Sample Data
                </button>
              )}
            </div>

            <div className="cf-nav-right">
              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNext}
                  aria-label="Next Step"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  id="submit-consignment-btn"
                  type="submit"
                  className="btn btn-primary cf-submit-btn"
                  disabled={submitting}
                  aria-label="Submit consignment"
                >
                  {submitting ? '⏳ Processing...' : '📦 Submit Consignment'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
