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
    paymentStatus: { 
      type: String,
       enum: ["pending","paid","shipped","cancelled"],
       default: "pending",
     },
     paymentRef: String

  },
  { timestamps: true }
)

const paymentModel = mongoose.model('Payment', paymentSchema)

module.exports = paymentModel
