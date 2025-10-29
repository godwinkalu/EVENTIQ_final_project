const mongoose = require('mongoose');

const  notificationvenueOwnerSchema = new mongoose.Schema({
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
  },
  venueOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'venueOwners',
  },
   notificationMsg: {
    type: String,
    enum: ['newBookings', 'paymentReceived', 'eventReminder'],
  },
});

const notificationvenueOwner = mongoose.model('notificationvenueOwner', notificationvenueOwnerSchema);
module.exports = notificationvenueOwner;
