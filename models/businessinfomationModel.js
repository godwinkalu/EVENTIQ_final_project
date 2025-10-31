const mongoose = require('mongoose')

const businessinfomationSchema = new mongoose.Schema({
  venueOwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'venueOwners',
        required: true,
      },
   businessname:{
    type:String,
    required:true
   },
   rcnumber:{
    type:Number,
    required:true
   },
   businessphonenumber:{
   type:Number,
   required:true
   },
   businessadress:{
   type:Number,
   required:true
   },
  location: {
      state: {
        type: String,
        required: true,
      },
      localgovernmentarea: {
        type: String,
        required: true,
      },
    },
}, {timestamps:true})
const businessinfomationModel = mongoose.model ('businessinfomation', businessinfomationSchema)


module.exports = businessinfomationModel