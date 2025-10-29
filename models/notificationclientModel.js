const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
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
  BookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'venuebookings',
    required: true,
  },
  notificationMsg: {
    type: String,
    enum: ['Booking Confirmed', 'Booking Reject', 'Booking Pending', 'Payment Successful'],
  },
})

const notificationclientModel = mongoose.model('notification', notificationSchema)
module.exports = notificationclientModel
