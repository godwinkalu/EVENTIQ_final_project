const mongoose = require('mongoose')

const venuebookingSchema = new mongoose.Schema(
  {
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'venues',
      required: true,
    },
    venueOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'venue-owners',
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
    eventType:{
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
