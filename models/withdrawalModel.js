const mongoose = require('mongoose')

const withdrawalSchema = new mongoose.Schema(
  {
    venueOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'venue-owners',
    },
    venuebookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'venuebookings',
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'venues',
    },
    amount: {
      type: Number,
      require: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    accountType: {
      type: String,
      trim: true,
      lowercase:true,
      enum: ['savings', 'current', 'fixed', 'corporate'],
    },
    accountName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
)

const withdrawalModel = mongoose.model('withdrawal', withdrawalSchema)

module.exports = withdrawalModel
