// utils/validation.js
// CargoFlow — Form validation helpers

/**
 * Validate a full consignment form submission.
 * @param {Object} formData - The form state object.
 * @returns {{ isValid: boolean, errors: Object }} Validation result and field-level messages.
 */
export function validateConsignmentForm(formData) {
  const errors = {};

  // -- Shipment Details --
  if (!formData.docketNumber || !formData.docketNumber.trim()) {
    errors.docketNumber = 'Docket number is required.';
  }

  if (!formData.date) {
    errors.date = 'Date is required.';
  }

  // -- Customer Details --
  if (!formData.customerName || !formData.customerName.trim()) {
    errors.customerName = 'Customer name is required.';
  }

  if (!formData.customerAddress || !formData.customerAddress.trim()) {
    errors.customerAddress = 'Please enter the customer address.';
  }

  // -- Consignor Details --
  if (!formData.consignorName || !formData.consignorName.trim()) {
    errors.consignorName = 'Consignor name is required.';
  }

  if (!formData.consignorAddress || !formData.consignorAddress.trim()) {
    errors.consignorAddress = 'Please enter the consignor address.';
  }

  // -- Item Details --
  if (!formData.itemName || !formData.itemName.trim()) {
    errors.itemName = 'Item name is required.';
  }

  const qty = Number(formData.quantity);
  if (!formData.quantity && formData.quantity !== 0) {
    errors.quantity = 'Quantity is required.';
  } else if (isNaN(qty) || qty < 1) {
    errors.quantity = 'Quantity must be at least 1.';
  }

  const rate = Number(formData.rate);
  if (formData.rate === '' || formData.rate === undefined || formData.rate === null) {
    errors.rate = 'Rate is required.';
  } else if (isNaN(rate) || rate < 0) {
    errors.rate = 'Rate cannot be negative.';
  }

  // -- Consignee Details --
  if (!formData.consigneeName || !formData.consigneeName.trim()) {
    errors.consigneeName = 'Consignee name is required.';
  }

  if (!formData.consigneeAddress || !formData.consigneeAddress.trim()) {
    errors.consigneeAddress = 'Please enter the consignee address.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
