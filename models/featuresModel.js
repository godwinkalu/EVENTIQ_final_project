const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  duration: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const featureModel = mongoose.model('features', featureSchema);

module.exports = featureModel;