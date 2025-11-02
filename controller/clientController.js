const clientModel = require('../models/clientModel')
const venueOwnerModel = require('../models/venueOwnerModel')
const venuebookingModel = require('../models/venuebookingModel')
const notificationclientModel = require('../models/notificationclientModel')
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
    const existVenueOwner = await venueOwnerModel.findOne({ email: email.toLowerCase() })
    const existClient = await clientModel.findOne({ email: email.toLowerCase() })

    if (existVenueOwner) {
      return res.status(404).json({
        message: 'Account already exist as a venue owner, login your account',
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

    const imgUrl =
      'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=1024x1024&w=is&k=20&c=oGqYHhfkz_ifeE6-dID6aM7bLz38C6vQTy1YcbgZfx8='
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
    const notification = await notificationclientModel.create({
      clientId: client._id,
      notificationTitle: 'Welcome To Eventiq',
      notificationMsg: 'Start exploring amazing event venues across Lagos.',
      dot: '#808080',
      time: new Date()
    })
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
    const clients = await clientModel
      .find()
      .select('-password -phoneNumber -isVerified -role -otp -otpExpiredat -__v')

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
        message: 'Client not found',
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
    const { id } = req.user
    const client = await clientModel.findById(id)

    if (!client) {
      return res.status(404).json({
        message: 'Client not found',
      })
    }

    const bookings = await venuebookingModel.find({
      clientId: client._id,
      bookingstatus: { $in: ['confirmed', 'pending'] },
    })
    res.status(200).json({
      message: 'All client bookings',
      data: bookings,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue',
      })
    }
    next(error)
  }
}

exports.deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params

    const client = await clientModel.findById(id)
    if (!client) {
      return res.status(404).json({
        message: 'Client not found',
      })
    }

    if (client.profilePicture && client.profilePicture.publicId) {
      await cloudinary.uploader.destroy(client.profilePicture.publicId)
    }

    await clientModel.findByIdAndDelete(id)

    res.status(200).json({
      message: 'Client deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

exports.getAllVerifiedVenues = async (req, res, next) => {
  try {
    const { id } = req.user
    const city = req.query.city
    const user = await clientModel.findById(id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    let venues

    if (!city || city.toLowerCase() === 'all areas') {
      venues = await venueModel.find({ status: 'verified' })
    } else {
      venues = await venueModel.find({ status: 'verified', 'location.city': city.toLowerCase() })
    }

    res.status(200).json({
      message: 'All venues retrieved successfully',
      data: venues,
      total: venues.length,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue',
      })
    }
    next(error)
  }
}

exports.getAllVerifiedIndoors = async (req, res, next) => {
  try {
    const { id } = req.user
    const city = req.query.city
    const user = await clientModel.findById(id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    let venues

    if (!city || city.toLowerCase() === 'all areas') {
      venues = await venueModel.find({ status: 'verified', type: 'indoor' })
    } else if (city) {
      venues = await venueModel.find({
        status: 'verified',
        type: 'indoor',
        'location.city': city.toLowerCase(),
      })
    }

    res.status(200).json({
      message: 'All venues retrieved successfully',
      data: venues,
      total: venues.length,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue',
      })
    }
    next(error)
  }
}

exports.getAllVerifiedOutdoor = async (req, res, next) => {
  try {
    const { id } = req.user
    const city = req.query.city
    console.log(city)

    const user = await clientModel.findById(id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    let venues

    if (!city || city.toLowerCase() === 'all areas') {
      venues = await venueModel.find({ status: 'verified', type: 'outdoor' })
    } else if (city) {
      venues = await venueModel.find({
        status: 'verified',
        type: 'outdoor',
        'location.city': city.toLowerCase(),
      })
    }

    res.status(200).json({
      message: 'All venues retrieved successfully',
      data: venues,
      total: venues.length,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue',
      })
    }
    next(error)
  }
}

exports.getAllVerifiedMulti = async (req, res, next) => {
  try {
    const { id } = req.user
    const city = req.query.city
    const user = await clientModel.findById(id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    let venues

    if (!city || city.toLowerCase() === 'all areas') {
      venues = await venueModel.find({ status: 'verified', type: 'multipurpose' })
    } else if (city) {
      venues = await venueModel.find({
        status: 'verified',
        type: 'multipurpose',
        'location.city': city.toLowerCase(),
      })
    }

    res.status(200).json({
      message: 'All venues retrieved successfully',
      data: venues,
      total: venues.length,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue',
      })
    }
    next(error)
  }
}
