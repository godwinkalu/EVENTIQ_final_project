const businessinfomationModel = require('../models/businessinfomationModel');

exports.updateBusinessInfo = async (req, res, next) => {
  try {
    const venueOwnerId = req.user.id; 
    const {businessname,businessphonenumber,businessadress, rcnumber,} = req.body;

    const businessInfo = await businessinfomationModel.findOne({ venueOwnerId });

    if (businessInfo) {

       const location = {
      state: state ? state.trim() : '',
       city: city ? city.trim() : '',
    }
      const data = {
        venueOwnerId:venueOwner._id,
        businessname,
        businessphonenumber,
        businessadress,
         rcnumber,
         location
      }
      businessInfo = await businessinfomationModel.findOneAndUpdate({ venueOwnerId },  data,{ new: true }
      );
      
      return res.status(200).json({
        message: 'Business information updated successfully',
        data: businessInfo,
      });
    } else {
      updates.venueOwnerId = venueOwnerId;
      const newBusinessInfo = await businessinfomationModel.create(updates);
      return res.status(201).json({
        message: 'Business information created successfully',
        data: newBusinessInfo,
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.getMyBusinessInfo = async (req, res, next) => {
  try {
    const venueOwnerId = req.user.id;

    const businessInfo = await businessinfomationModel.findOne({ venueOwnerId });

    if (!businessInfo) {
      return res.status(404).json({
        message: 'No business information found for this venue owner',
      });
    }

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
