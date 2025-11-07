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

const venueOwnerModel = mongoose.model('venue-owners', venueOwnerSchema)

module.exports = venueOwnerModel