const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
  {
    venuebookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'venuebookings',
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'venues',
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'clients',
    },
    reference: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'successful', 'failed'],
      lowercase: true,
      default: 'pending',
    },
  },
  { timestamps: true }
)

const paymentModel = mongoose.model('Payment', paymentSchema)

module.exports = paymentModel
