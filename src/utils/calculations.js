// utils/calculations.js
// CargoFlow — Arithmetic helpers for consignment amounts

/**
 * Calculate the total amount from quantity and rate.
 * @param {number|string} quantity - Number of items.
 * @param {number|string} rate     - Per-unit rate in ₹.
 * @returns {number} Calculated total (0 if inputs are invalid).
 */
export function calculateTotal(quantity, rate) {
  const qty = parseFloat(quantity);
  const rt = parseFloat(rate);
  if (isNaN(qty) || isNaN(rt) || qty < 0 || rt < 0) return 0;
  return qty * rt;
}

/**
 * Format a number as Indian Rupee string.
 * @param {number} amount
 * @returns {string} e.g. "₹2,500.00"
 */
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number as a compact INR display (no decimal if whole number).
 * @param {number} amount
 * @returns {string} e.g. "₹2,500"
 */
export function formatINRCompact(amount) {
  if (amount === 0) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
