const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  venueOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'venue-owners'
  },
  totalVenues: {
      type: Number,
      default: 0                          
  },
  activeBooking: {
      type: Number,
      default: 0
  },
  revenue: {
      type: Number,
      default: 0
  },
  occupancyRate: {
      type: Number,
      default: 0
  }
}, {timestamps: true});

const dashboardModel = mongoose.model('dashboards', dashboardSchema);

module.exports = dashboardModel;