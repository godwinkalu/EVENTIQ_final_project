const mongoose = require('mongoose')

const businessinfomationSchema = new mongoose.Schema({
  venueOwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'venue-owners',
        required: true,
      },
   businessname:{
    type:String,
    default: ''
   },
   rcnumber:{
    type:Number,
    default: ''
   },
   businessphonenumber:{
   type:Number,
   default: ''
   },
  location: {
      state: {
        type: String,
        default: ''
      },
      lga: {
        type: String,
        default: ''
      },
      address: {
        type: String,
        default: ''
      },
    },
}, {timestamps:true})
const businessinfomationModel = mongoose.model ('businessinfomation', businessinfomationSchema)


module.exports = businessinfomationModel