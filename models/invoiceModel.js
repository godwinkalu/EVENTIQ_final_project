const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clients'
  },
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'venues'
  },
  venuebookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'venuebookings'
  },
  issuedDate: {
    type: String,
    default: new Date().toDateString()
  },
}, {timestamps: true});

const invoiceModel = mongoose.model('invoices', invoiceSchema);

module.exports = invoiceModel;