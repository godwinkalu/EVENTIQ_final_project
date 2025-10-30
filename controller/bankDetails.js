const bankDetailModel = require('../models/bankDetailModel');
const venueOwnerModel = require('../models/venueOwnerModel');


exports.registerBank = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { bankName, accountNumber, accountType, accountName } = req.body;
    const venueOwner = await venueOwnerModel.findById(id);
    
    if (!venueOwner) {
      return res.status(404).json({
        message: 'Venue owner not found'
      })
    };

    const existBankDetails = await bankDetailModel.findOne({venueOwnerId: venueOwner._id, bankName: bankName.toUp});

    if (existBankDetails) {
      return res.status(400).json({
        message: ''
      })
    }
  } catch (error) {
    next(error)
  }
}