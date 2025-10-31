const venueModel = require('../models/venueModel');
const venuebookingModel = require('../models/venuebookingModel');
const dashboardModel = require('../models/dashboardModel');
const moment = require('moment')
const mongoose = require('mongoose')

const venueOwnerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: ''
    },
    profilePicture: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
    otp: {
      type: String,

    },
    otpExpiredat: {
      type: Number,

    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: 'venue-owner'
    },
  },
  { timestamps: true }
);

venueOwnerSchema.post('save', async function (doc, next) {
  const venues = await venueModel.find({ venueOwnerId: doc._id });
  const venuebookings = await venuebookingModel.find({ venueId: venues[0]?._id });
  const dashboard = await dashboardModel.findOne({ venueOwnerId: this._id })
  const now = new Date();

  const startOfMonth = moment().startOf('month').toDate();
  const endOfMonth = moment().endOf('month').toDate();

  const newVenuesThisMonth = await venueModel.countDocuments({
    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
  });

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const thisMonthRevenueData = await venuebookingModel.aggregate([
    {
      $match: {
        venueOwnerId: dashboard._id,
        createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: venuebookings?.reduce((a, b) => a + b.totalamount, 0) }
      }
    }
  ]);

  const lastMonthRevenueData = await Booking.aggregate([
    {
      $match: {
        venueOwnerId: ownerId,
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: venuebookings?.reduce((a, b) => a + b.totalamount, 0) }
      }
    }
  ]);

  const thisMonthRevenue = thisMonthRevenueData[0]?.totalRevenue || 0;
  const lastMonthRevenue = lastMonthRevenueData[0]?.totalRevenue || 0;

  let growth = 0;
  if (lastMonthRevenue > 0) {
    growth = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
  }

  dashboard.totalVenues = {
    total: venues.length,
    stat: newVenuesThisMonth
  }

  dashboard.activeBooking = {
    confirmed: venuebookings.length,
    pending: venuebookings.filter((e) => e.bookingstatus === 'pending').length
  }

  dashboard.revenue = {
    total: thisMonthRevenue,
    stat: growth
  }

  await dashboard.save()
  next();
})

const venueOwnerModel = mongoose.model('venueOwners', venueOwnerSchema)

module.exports = venueOwnerModel