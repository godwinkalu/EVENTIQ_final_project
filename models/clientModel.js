const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema(
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
    isVerified: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
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
      type: String
    },
    otpExpiredat: {
      type: Number
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      default: 'client',
    },
  },
  { timestamps: true }
)

const clientModel = mongoose.model('clients', clientSchema)

module.exports = clientModel
