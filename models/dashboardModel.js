const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  venueOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'venueOwners'
  },
  totalVenues: {
    total: {
      type: Number,
      default: 0
    },
    stat: {
      type: Number,
      default: 0
    }
  },
  activeBooking: {
    confirmed: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    }
  },
  revenue: {
    total: {
      type: Number,
      default: 0
    },
    stat: {
      type: Number,
      default: 0
    }
  },
  occupancyRate: {
    total: {
      type: Number,
      default: 0
    },
    stat: {
      type: Number,
      default: 0
    }
  }
}, {timestamps: true});

const dashboardModel = mongoose.model('dashboards', dashboardSchema);

module.exports = dashboardModel;