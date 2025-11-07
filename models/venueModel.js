const venuebookingModel = require('./venuebookingModel')
const dashboardModel = require('./dashboardModel')
const venueOwnerModel = require('./venueOwnerModel')
const mongoose = require('mongoose')

const venueSchema = new mongoose.Schema(
  {
    venueOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'venue-owners',
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
        lowercase: true,
      },
      city: {
        type: String,
        required: true,
        lowercase: true,
      },
      state: {
        type: String,
        required: true,
        lowercase: true,
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
      minimum: {
        type: String,
        required: true,
      },
      maximum: {
        type: String,
        required: true,
      },
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
      lowercase: true,
      enum: ['indoor', 'outdoor', 'multipurpose'],
    },
    amenities: {
      type: [String],
      required: true
    },
    documents: {
      images: [
        {
          url: String,
          publicId: String,
        },
      ],
      cac: [
        {
          url: String,
          publicId: String,
        },
      ],
      doc: [
        {
          url: String,
          publicId: String,
        },
      ],
    },
    isavailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredExpireAt: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'unverified', 'verified'],
      default: 'pending',
      lowercase: true
    },
  },
  { timestamps: true }
)

venueSchema.post('save', async function (doc, next) {
  try {
    const venues = await venueModel.find({ _id: doc._id });
    const venueOwner = await venueOwnerModel.findOne({ _id: venues[0]._id })
    const venuebookings = await venuebookingModel.find({ venueId: venues[0]?._id });
    const dashboard = await dashboardModel.findOne({ venueOwnerId: venueOwner._id })
    dashboard.totalVenues = venues.length
    dashboard.activeBooking = venuebookings.length
    await dashboard.save()
    next();
  } catch (error) {
    console.log(error)
  }
})

const venueModel = mongoose.model('venues', venueSchema)

module.exports = venueModel
