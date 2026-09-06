// utils/storage.js
// CargoFlow — LocalStorage helpers for consignment records

const STORAGE_KEY = 'cargoflow_consignments';

/**
 * Retrieve all consignment records from localStorage.
 * @returns {Array} Array of consignment objects, or empty array if none found.
 */
export function getConsignments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persist the full consignment list to localStorage.
 * @param {Array} consignments - Array of consignment objects to store.
 */
export function saveConsignments(consignments) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consignments));
  } catch (err) {
    console.error('CargoFlow: Failed to save consignments to localStorage.', err);
  }
}

/**
 * Append a single new consignment record to localStorage.
 * @param {Object} consignment - A consignment record object.
 * @returns {Array} Updated list of all consignments.
 */
export function addConsignment(consignment) {
  const existing = getConsignments();
  const updated = [consignment, ...existing];
  saveConsignments(updated);
  return updated;
}

/**
 * Delete a consignment by its docket number.
 * @param {string} docketNumber - The docket number to remove.
 * @returns {Array} Updated list after removal.
 */
export function deleteConsignmentByDocket(docketNumber) {
  const existing = getConsignments();
  const updated = existing.filter((c) => c.docketNumber !== docketNumber);
  saveConsignments(updated);
  return updated;
}
