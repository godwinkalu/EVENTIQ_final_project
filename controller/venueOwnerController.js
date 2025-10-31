const venueOwnerModel = require('../models/venueOwnerModel')
const dashboardModel = require('../models/dashboardModel');
const cloudinary = require('../config/cloudinary')
const bcrypt = require('bcrypt')
const { signUpTemplate } = require('../utils/emailTemplate')
const { emailSender } = require('../middleware/nodemalier')
const Brevo = require('@getbrevo/brevo')
const jwt = require('jsonwebtoken')
const fs = require('fs')

exports.createVenueOwner = async (req, res, next) => {
  const { firstName, surname, businessemail, password } = req.body
  try {
    const existVenueOwner = await venueOwnerModel.findOne({ email: email.toLowerCase() })
    const existClient = await venueOwnerModel.findOne({ email: email.toLowerCase() })

    if (existVenueOwner) {
      return res.status(404).json({
        message: 'Account already exists, login your account',
      })
    }

    if (existClient) {
      return res.status(404).json({
        message: 'Account already exist as a client, log in to your account',
      })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const otp = Math.round(Math.random() * 1e6)
      .toString()
      .padStart(6, '0')

    const imgUrl = 'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=1024x1024&w=is&k=20&c=oGqYHhfkz_ifeE6-dID6aM7bLz38C6vQTy1YcbgZfx8=';

    const response = await cloudinary.uploader.upload(imgUrl)

    const venueOwner = new venueOwnerModel({
      firstName,
      surname,
      businessemail,
      password: hashedPassword,
      otp: otp,
      otpExpiredat: Date.now() + 1000 * 60,
      profilePicture: {
        url: response.secure_url,
        publicId: response.public_id,
      },
    })
    
    const dashboard = new dashboardModel({
      venueOwnerId: venueOwner._id
    });

    const apikey = process.env.brevo
    const apiInstance = new Brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apikey)

    const sendSmtpEmail = new Brevo.SendSmtpEmail()
    sendSmtpEmail.subject = 'Welcome to Eventiq'
    sendSmtpEmail.to = [{ email: venueOwner.email }]
    sendSmtpEmail.sender = { name: 'Eventiq', email: 'udumag51@gmail.com' }

    sendSmtpEmail.htmlContent = signUpTemplate(otp, venueOwner.firstName)

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    await venueOwner.save()
    await dashboard.save()
    res.status(201).json({
      message: 'venueOwner created successfully',
      data: venueOwner,
    })
  } catch (error) {
    next(error)
  }
}
exports.getAllVenueOwners = async (req, res, next) => {
  try {
    const owners = await venueOwnerModel.find().select('-password -otp');
    res.status(200).json({
      message: 'All venue owners retrieved successfully',
      data: owners,
    });
  } catch (error) {
    next(error);
  }
};

exports.getVenueOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const owner = await venueOwnerModel.findById(id).select('-password -otp');
    if (!owner) {
      return res.status(404).json({
        message: 'Venue owner not found',
      });
    }

    res.status(200).json({
      message: 'Venue owner retrieved successfully',
      data: owner,
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePhoneNumber = async (req, res, next) => {
  try {
    const { id } = req.user;
    const venueOwner = await venueOwnerModel.findById(id);
    const { phoneNumber } = req.body;

    if (!venueOwner) {
      return res.status(404).json({
        message: 'Venue owner not found',
      });
    };

    venueOwner.phoneNumber = phoneNumber ?? venueOwner.phoneNumber;
    await venueOwner.save();
    res.status(200).json({
      message: 'Phone number updated successfully',
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue'
      })
    }
    next(error);
  }
};


exports.updateProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const venueOwner = await venueOwnerModel.findById(id);
    const file = req.file;

    if (!venueOwner) {
      return res.status(404).json({
        message: 'Venue owner not found',
      });
    };

    let profilePicture = venueOwner.profilePicture;

    if (file && file.path) {
      const response = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path)
      profilePicture = {
        url: response.secure_url,
        publicId: response.public_id
      }
    }

    Object.assign(venueOwner, {
      profilePicture
    });
    await venueOwner.save();
    res.status(200).json({
      message: 'Profile picture updated successfully',
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue'
      })
    }
    next(error);
  }
};

exports.deleteVenueOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const owner = await venueOwnerModel.findById(id);

    if (!owner) {
      return res.status(404).json({
        message: 'Venue owner not found',
      });
    }

    if (owner.profilePicture && owner.profilePicture.publicId) {
      await cloudinary.uploader.destroy(owner.profilePicture.publicId);
    }

    await venueOwnerModel.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Venue owner deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};