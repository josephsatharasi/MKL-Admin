const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: { type: String, required: true },
  spareParts: { type: Object, required: true },
  totalBill: { type: Number, required: true },
  paymentMode: { type: String, required: true },
  images: { type: [String], default: [] },
  serviceDate: { type: String, default: () => new Date().toISOString().split('T')[0] }
});

module.exports = mongoose.model('Service', serviceSchema);
