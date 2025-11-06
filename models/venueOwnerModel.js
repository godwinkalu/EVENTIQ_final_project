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
 try {
   const venues = await venueModel.find({ venueOwnerId: doc._id });
  console.log(`venues: ${venues.length}`,venues);
  
  const venuebookings = await venuebookingModel.find({ venueId: venues[0]?._id });
  console.log(`venue booking: ${venuebookings.length}`,venuebookings);
  
  const dashboard = await dashboardModel.findOne({ venueOwnerId: this._id })
  const now = new Date().toLocaleDateString();

  dashboard.totalVenues = venues.length
  dashboard.activeBooking = venuebookings.length
  await dashboard.save()
  next();
 } catch (error) {
  console.log(error)
 }
})

const venueOwnerModel = mongoose.model('venue-owners', venueOwnerSchema)

module.exports = venueOwnerModel