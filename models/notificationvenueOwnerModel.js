const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'venues',
  },
  venueOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'venue-owner',
  },
  BookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'venuebookings',
  },
  notificationTitle: {
    type: String,
    required: true,
    enum: ['New Booking Request', 'Payment Received', 'Venue Verified', 'Welcome To Eventiq'],
  },
  notificationMsg: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  dot: {
    type: String,
    required: true,
    enum: ['#800080', '#ffa500', '#808080', '#008000', '#ff0000']
  }
}, {timestamps: true})

const notificationvenueownerModel = mongoose.model('venueowner-notifications', notificationSchema)

module.exports = notificationvenueownerModel
