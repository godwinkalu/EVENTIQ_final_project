const clientModel = require('../models/clientModel')
const venueOwnerModelModel = require('../models/venueOwnerModel')
const venuebookingModel = require('../models/venuebookingModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('../config/cloudinary')
const { signUpTemplate } = require('../utils/emailTemplate')
const { emailSender } = require('../middleware/nodemalier')
const Brevo = require('@getbrevo/brevo')
const venueModel = require('../models/venueModel')


exports.signUp = async (req, res, next) => {
  const { firstName, surname, email, password } = req.body
  try {
    const existClient = await clientModel.findOne({ email: email.toLowerCase() }) 
    const existVenueOwner = await clientModel.findOne({ email: email.toLowerCase() }) 

    if (existClient) {
      return res.status(404).json({
        message: 'Account already exist as a client, log in to your account',
      })
    }

    if (existVenueOwner) {
      return res.status(404).json({
        message: 'Account already exist as a venue owner, log in to your account',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const otp = Math.round(Math.random() * 1e6)
      .toString()
      .padStart(6, '0')

    const imgUrl = 'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=1024x1024&w=is&k=20&c=oGqYHhfkz_ifeE6-dID6aM7bLz38C6vQTy1YcbgZfx8=';
    const response = await cloudinary.uploader.upload(imgUrl)

    const client = new clientModel({
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

    const apikey = process.env.brevo
    const apiInstance = new Brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apikey)

    const sendSmtpEmail = new Brevo.SendSmtpEmail()
    sendSmtpEmail.subject = 'Welcome to Eventiq'
    sendSmtpEmail.to = [{ email: client.email }]
    sendSmtpEmail.sender = { name: 'Eventiq', email: 'udumag51@gmail.com' }

    sendSmtpEmail.htmlContent = signUpTemplate(otp, client.firstName)

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    await client.save()

    return res.status(201).json({
      message: 'Client created successfully',
      data: client,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

exports.getClients = async (req, res, next) => {
  try {
    const clients = await clientModel.find().select('-password -phoneNumber -isVerified -role -otp -otpExpiredat -__v')

    res.status(200).json({
      message: 'Clients fetched',
      data: clients,
    })
  } catch (error) {
    next(error)
  }
}


exports.getClient = async (req, res, next) => {
  try {
    const { id } = req.params
    const client = await clientModel
      .findById(id)
      .select('-password -phoneNumber -isVerified -role -otp -otpExpiredat -__v')

    if (!client) {
      return res.status(404).json({
        message: 'Client not found'
      })
    }

    res.status(200).json({
      message: 'Clients found',
      data: client,
    })
  } catch (error) {
    next(error)
  }
}


exports.getAllClientBooking = async (req, res, next) => {
  try {
    const {id} = req.user;
    const client = await clientModel.findById(id);

    if (!client) {
      return res.status(404).json({
        message: 'Client not found'
      })
    };

    const bookings = await venuebookingModel.find({clientId: client._id,  bookingstatus: { $in: ['confirmed', 'pending'] } });
    res.status(200).json({
      message: 'All client bookings',
      data: bookings
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


exports.deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await clientModel.findById(id);
    if (!client) {
      return res.status(404).json({
        message: 'Client not found',
      });
    }

    if (client.profilePicture && client.profilePicture.publicId) {
      await cloudinary.uploader.destroy(client.profilePicture.publicId);
    }

    await clientModel.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Client deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};