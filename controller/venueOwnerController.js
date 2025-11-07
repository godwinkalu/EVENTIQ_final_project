const venueOwnerModel = require('../models/venueOwnerModel')
const dashboardModel = require('../models/dashboardModel');
const venuebookingModel = require('../models/venuebookingModel')
const clientModel = require('../models/clientModel')
const businessinfomationModel = require('../models/businessinfomationModel')
const cloudinary = require('../config/cloudinary')
const bcrypt = require('bcrypt')
const { signUpTemplate } = require('../utils/emailTemplate')
const { emailSender } = require('../middleware/nodemalier')
const Brevo = require('@getbrevo/brevo')
const jwt = require('jsonwebtoken')
const fs = require('fs');
const venueModel = require('../models/venueModel');
const paymentModel = require('../models/bookingPayment')

exports.createVenueOwner = async (req, res, next) => {
  const { firstName, surname, email, password } = req.body
  try {
    const existVenueOwner = await venueOwnerModel.findOne({ email: email.toLowerCase() })
    const existClient = await clientModel.findOne({ email: email.toLowerCase() })

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
      email,
      password: hashedPassword,
      otp: otp,
      otpExpiredat: Date.now() + 1000 * 60 * 10,
      profilePicture: {
        url: response.secure_url,
        publicId: response.public_id,
      },
    })

    const dashboard = await dashboardModel.create({
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
    const businessInfo = await businessinfomationModel.create({
      venueOwnerId: venueOwner._id
    })
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
    const owners = await venueOwnerModel.find().select('-password -otp -password  -isVerified -isLoggedIn');
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

    const owner = await venueOwnerModel.findById(id).select('-password -otp -password  -isVerified -isLoggedIn');

    console.log(owner);

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


exports.getAllBookings = async (req, res, next) => {
  try {
    const venueOwner = await venueOwnerModel.findById(req.user.id)

    if (!venueOwner) {
      return res.status(404).json({
        message: 'Venue owner not found',
      })
    }

    const venue = await venueModel.find({ venueOwnerId: venueOwner._id })

    const bookings = await venuebookingModel.find({ venueownerId: venue[0].venueOwnerId }).select('date eventType')
      .populate('venueId', 'venuename price')
      .populate('clientId', 'firstName surname')

    return res.status(200).json({
      message: 'All bookings retrieved successfully',
      data: bookings,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue'
      })
    }
    next(error)
  }
}


exports.getOneBooking = async (req, res, next) => {
  try {
    const venueOwner = await venueOwnerModel.findById(req.user.id)
    const booking = await venuebookingModel.findById(req.param.venuebookingId).select('date eventType')
      .populate('venueId', 'venuename price')
      .populate('clientId', 'firstName surname')

    if (!venueOwner) {
      return res.status(404).json({
        message: 'Venue owner not found',
      })
    }

    if (!booking) {
      return res.status(404).json({
        message: 'No booking found',
      })
    }

    return res.status(200).json({
      message: 'Booking retrieved successfully',
      data: booking,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue'
      })
    }
    next(error)
  }
}


exports.getAllListed = async (req, res, next) => {
  try {
    const { id } = req.user
    const venueOwner = await venueOwnerModel.findById(id)

    if (!venueOwner) {
      return res.status(404).json({
        message: 'Venue owner not found',
      })
    }

    const venues = await venueModel.find({ venueOwnerId: venueOwner._id })
    res.status(200).json({
      message: 'All venues retrieved successfully',
      data: venues,
      total: venues.length
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'session expired please login to continue',
      })
    }
    next(error)
  }
}


exports.paymentHistory = async (req, res, next) => {
  try {
    const venueowner = await venueOwnerModel.findById(req.user.id)
    if (!venueowner) {
      return res.status(404).json({
        message: "venueowner not found"
      })
    }
    const venue = await venueModel.findOne({ venueOwnerId: venueowner._id })

    if (!venue) {
      return res.status(404).json({
        message: "venueowner not found"
      })
    }
    const venueBooking = await venuebookingModel.findOne({ venueId: venue._id })

    if (!venueowner) {
      return res.status(404).json({
        message: "venueowner not found"
      })
    }

    const payments = await paymentModel.find({ venuebookingId: venueBooking._id }).populate('venueId', 'venuename price').populate('clientId', 'firstName surname').populate('venuebookingId', 'date').sort({ createdAt: -1 })

    res.status(200).json({
      message: 'All Payment History',
      data: payments
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue'
      })
    }
    next(error)
  }
}