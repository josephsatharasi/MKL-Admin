const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  address: String,
  area: String,
  service: String,
  brand: String,
  profilePic: String,
  additionalPics: { type: [String], default: [] },
  serviceDate: { type: String },
  followUpStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Add indexes for faster queries
customerSchema.index({ name: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ area: 1 });
customerSchema.index({ service: 1 });
customerSchema.index({ followUpStatus: 1 });
customerSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Customer', customerSchema);
