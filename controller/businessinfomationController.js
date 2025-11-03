const businessinfomationModel = require('../models/businessinfomationModel');
const venueOwnerModel = require('../models/venueOwnerModel')
const jwt = require('jsonwebtoken')

exports.updateBusinessInfo = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { businessname, businessphonenumber, address, rcnumber, state, lga } = req.body;
    const venueOwner = await venueOwnerModel.findById(id)

    if (!venueOwner) {
      return res.status(404).json({
        message: 'Venue owner not found'
      })
    }

    

    if (existBusinessInfo) {
      return res.status(400).json({
        message: 'Business info created already'
      })
    }

    const businessInfo = new businessinfomationModel({
      venueOwnerId: venueOwner._id,
      businessname,
      rcnumber,
      businessphonenumber,
      location: {
        state: state,
        lga: lga,
        address: address
      }
    })

    await businessInfo.save()
    res.status(200).json({
      message: 'Business information created successfully',
      data: businessInfo,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue',
        data: businessInfo,
      })
    }
    next(error);
  }
};


exports.getMyBusinessInfo = async (req, res, next) => {
  try {
     const { id } = req.user;
    const venueOwner = await venueOwnerModel.findById(id)

    if (!venueOwner) {
      return res.status(404).json({
        message: 'Venue owner not found'
      })
    }

    const businessInfo = await businessinfomationModel.findOne({ venueOwnerId: venueOwner._id });

    res.status(200).json({
      message: 'Business information retrieved successfully',
      data: businessInfo,
    });
  } catch (error) {
    next(error);
  }
};
exports.deleteBusinessInfo = async (req, res, next) => {
  try {
    const venueOwnerId = req.user.id;

    const deletedInfo = await businessinfomationModel.findOneAndDelete({ venueOwnerId });

    if (!deletedInfo) {
      return res.status(404).json({
        message: 'Business information not found',
      });
    }

    res.status(200).json({
      message: 'Business information deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
