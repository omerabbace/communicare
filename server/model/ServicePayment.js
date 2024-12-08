const mongoose = require('mongoose');

const ServicePaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'usd',
  },
  status: {
    type: String,
    default: 'pending', // e.g., 'completed', 'failed'
  },
  paymentIntentId: {
    type: String,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card'], // Allowed values
    required: true,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ServicePayment', ServicePaymentSchema);
