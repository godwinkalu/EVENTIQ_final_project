const { required } = require('joi');
const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  venueOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'venueOwners'
  },
  bankName: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true,
  },
  accountType: {
    type: String,
    trim: true,
    enum: ['Savings', 'Current', 'Fixed']
  },
  accountName: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

const bankModel = mongoose.model('banks', bankSchema);

module.exports = bankModel;