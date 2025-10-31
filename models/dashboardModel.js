const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  venueOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'venueOwners'
  },
  totalVenues: {
    total: {
      type: Number
    },
    stat: {
      type: String
    }
  },
  activeBooking: {
    total: {
      type: Number
    },
    stat: {
      type: String
    }
  },
  revenue: {
    total: {
      type: Number
    },
    stat: {
      type: String
    }
  },
  occupancyRate: {
    total: {
      type: Number
    },
    stat: {
      type: String
    }
  }
}, {timestamps: true});

const dashboardModel = mongoose.model('dashboards', dashboardSchema);

module.exports = dashboardModel;