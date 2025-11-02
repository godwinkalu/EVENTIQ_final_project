const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'venues',
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clients',
  },
  BookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'venuebookings',
  },
  notificationTitle: {
    type: String,
    required: true,
    enum: ['Booking Confirmed', 'Booking Rejected', 'Booking Pending', 'Payment Successful', 'Payment Failed', 'Welcome To Eventiq'],
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

const notificationclientModel = mongoose.model('notification', notificationSchema)
module.exports = notificationclientModel
