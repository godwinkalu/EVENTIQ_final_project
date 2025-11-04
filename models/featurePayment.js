const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  venueOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'venueOwners',
    required: true
  },
  featureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'features',
    required: true
  },
  reference: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Successful', 'Failed'],
    default: 'Pending'
  },
  subscriptionType: {
    type: String,
    enum: ['1 month(s)', '3 month(s)', '6 month(s)']
  },
  subscriptionExpiresAt: {
    type: Number
  }
}, { timestamps: true });

const subscriptionModel = mongoose.model('subscriptions', subscriptionSchema);

module.exports = subscriptionModel;