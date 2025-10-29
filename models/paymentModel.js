const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({

  amount:{
    type:Number
  },
  email:{
    type:String
  },
  name:{
    type:String
  },
  reference:{
     type:String
  },
  status:{
    type:String,
    enum:['initiated','successful','failed', 'refunded'],
    default:'pending'
  },
  venuebookingId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'venuebooking',
    },
}, {timestamps:true})

const paymentModel = mongoose.model('Payment', paymentSchema)

module.exports = paymentModel