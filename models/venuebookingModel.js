const mongoose = require('mongoose')

const venuebookingSchema = new mongoose.Schema(
  {
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'venues',
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'clients',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    servicecharge: {
      type: Number,
      default: 0,
    },
    eventtype:{
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    cautionfeestatus: {
      type: String,
      enum: ['pending', 'refunded'],
      default: 'pending',
    },
    paymentreference: {
      type: String,
      default: false,
    },
    paymentstatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    bookingstatus: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

const venuebookingModel = mongoose.model('venuebookings', venuebookingSchema)

module.exports = venuebookingModel
