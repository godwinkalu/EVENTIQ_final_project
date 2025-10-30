const mongoose = require('mongoose')

const venueSchema = new mongoose.Schema(
  {
    venueOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'venueOwners',
      required: true,
    },
    name: {
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
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },
    openhours: {
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
    image: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    cac: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
    document: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
    isfeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    isavailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
     status: {
      type: String,
      enum:['pending', 'unverified', 'verified'],
      default:'unverified'
    },
  },
  { timestamps: true }
)

const venueModel = mongoose.model('venues', venueSchema)

module.exports = venueModel
