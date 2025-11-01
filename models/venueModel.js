const mongoose = require('mongoose')

const venueSchema = new mongoose.Schema(
  {
    venueOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'venueOwners',
      required: true,
    },
    venuename: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      street: {
        type: String,
        required: true,
        lowercase: true
      },
      city: {
        type: String,
        required: true,
        lowercase: true
      },
      state: {
        type: String,
        required: true,
        lowercase: true
      },
    },
    openingtime: {
      type: String,
      required: true,
    },
    closingtime: {
      type: String,
      required: true,
    },
    cautionfee: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    hallsize: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['indoor', 'outdoor', 'multipurpose'],
    },
    amenities: {
      type: String,
    },
    documents: {
      images: [
        {
          url: String,
          publicId: String,
        },
      ],
      cac: {
        url: String,
        publicId: String,
      },
      doc: {
        url: String,
        publicId: String,
      },
    },
    isavailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    featuredExpireAt: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'unverified', 'verified'],
      default: 'unverified'
    },
  },
  { timestamps: true }
)

const venueModel = mongoose.model('venues', venueSchema)

module.exports = venueModel
