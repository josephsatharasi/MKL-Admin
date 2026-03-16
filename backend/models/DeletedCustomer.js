const mongoose = require('mongoose');

const deletedCustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  area: String,
  service: String,
  brand: String,
  originalId: String,
  deletedAt: { type: Date, default: Date.now },
  createdAt: Date
});

module.exports = mongoose.model('DeletedCustomer', deletedCustomerSchema);
