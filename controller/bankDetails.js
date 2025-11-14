const bankDetailModel = require('../models/bankDetailModel');
const venueOwnerModel = require('../models/venueOwnerModel');
const jwt = require('jsonwebtoken');


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

    const existBankDetails = await bankDetailModel.findOne({ venueOwnerId: venueOwner._id, bankName: bankName.toUpperCase(), accountName: accountName });

    if (existBankDetails) {
      return res.status(400).json({
        message: 'User already reguistered bank'
      })
    };

    const accountParts = accountName.toLowerCase().split(' ');
    const firstName = venueOwner.firstName.toLowerCase();
    const surname = venueOwner.surname.toLowerCase();

    if (!accountParts.includes(firstName) && !accountParts.includes(surname)) {
      return res.status(400).json({
        message: 'Account name must match registered venue owner name'
      });
    };

    const bankDetail = new bankDetailModel({
      venueOwnerId: venueOwner._id,
      bankName,
      accountName,
      accountType,
      accountNumber
    });

    await bankDetail.save();
    res.status(201).json({
      message: 'Bank details registered successfully'
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expire, login to continue'
      })
    }
    next(error)
  }
};


exports.getBankDetail = async (req, res, next) => {
  try {
    const { id } = req.user;
    const venueOwner = await venueOwnerModel.findById(id);

    if (!venueOwner) {
      return res.status(404).json({
        message: 'Venue owner not found'
      })
    };

    const bankDetail = await bankDetailModel.findOne({ venueOwnerId: venueOwner._id });

    if (!bankDetail) {
      return res.status(404).json({
        message: 'Bank not registered'
      })
    };
    res.status(200).json({
      message: 'Bank details below',
      data: bankDetail
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expire, login to continue'
      })
    }
  }
  next(error)
};


exports.updateBank = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { bankName, accountNumber, accountType, accountName } = req.body;
    const venueOwner = await venueOwnerModel.findById(id);

    if (!venueOwner) {
      return res.status(404).json({
        message: 'Venue owner not found'
      })
    };

    const bankDetail = await bankDetailModel.findOne({ venueOwnerId: venueOwner._id });

    if (!bankDetail) {
      return res.status(404).json({
        message: 'No bank info found'
      })
    };

    const accountParts = accountName.toLowerCase().split(' ');
    const firstName = venueOwner.firstName.toLowerCase();
    const surname = venueOwner.surname.toLowerCase();

    if (!accountParts.includes(firstName) && !accountParts.includes(surname)) {
      return res.status(400).json({
        message: 'Account name must match registered venue owner name'
      });
    };

    Object.assign(bankDetail, {
      accountName,
      accountNumber,
      accountType,
      bankName
    });

    await bankDetail.save();
    res.status(201).json({
      message: 'Bank details updated successfully'
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expire, login to continue'
      })
    }
    next(error)
  }
};