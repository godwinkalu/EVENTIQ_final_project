const clientModel = require('../models/clientModel')
const venuebookingModel = require('../models/venuebookingModel')
const venueModel = require('../models/venueModel')
const venueOwnerModel = require('../models/venueOwnerModel')
const { confirmedHtml, rejectedHtml } = require('../utils/confirmemailTemplate')
const jwt = require('jsonwebtoken')

exports.createvenuebooking = async (req, res, next) => {
  try {
    const { date, numberofguests } = req.body
    const { venueId } = req.params
    const clientId = req.user.id

    const venue = await venueModel.findById(venueId)
    const client = await clientModel.findById(clientId)

    if (!client) {
      return res.status(404).json({ message: 'Client not found' })
    }

    if (client.role !== 'client') {
      return res.status(400).json({ message: 'Only client can book for venue' })
    }

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' })
    }

    // Check if venue is already booked on that date
    const existingBooking = await venuebookingModel.findOne({
      clientId: client._id,
      venueId: venue._id,
      paymentstatus: 'paid',
      bookingstatus: 'accepted',
    })

    if (existingBooking) {
      return res.status(400).json({
        message: 'Venue is already booked for the selected date by this user',
      })
    }

    // Calculate total cost
    const basePrice = venue.price
    const serviceCharge = +(0.1 * basePrice).toFixed(2)
    const totalAmount = basePrice + serviceCharge

    //  Create booking
    const newBooking = new venuebookingModel({
      venueId: venue._id,
      clientId: client._id,
      venueOwnerId: venue.venueOwnerId,
      date,
      totalamount: totalAmount,
      servicecharge: serviceCharge,
      numberofguests,
    })

    await newBooking.save()

    return res.status(201).json({
      message: 'Venue booked successfully',
      data: newBooking,
    })
  } catch (error) {
    console.error('Booking Error:', error)
    next(error)
  }
}

exports.getMyBookings = async (req, res, next) => {
  try {
    const clientId = req.user.id

    const bookings = await venuebookingModel
      .find({ clientId })
      .populate('venueId', 'name location capacity')
      .populate('clientId', 'name email')

    return res.status(200).json({
      message: 'Your bookings retrieved successfully',
      data: bookings,
    })
  } catch (error) {
    next(error)
  }
}


exports.getAllBookings = async (req, res, next) => {
  try {
    const user = await venueOwnerModel.findById(req.user.id) || await clientModel.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        message: 'Venue owner not found',
      })
    }

    const bookings = await venuebookingModel
      .find({
        $or: [{ bookingstatus: 'pending' }, { bookingstatus: 'confirmed' }],
      })
      .populate('venueId')
      .populate('clientId', 'name email')

    return res.status(200).json({
      message: 'Your bookings retrieved successfully',
      data: bookings,
    })
  } catch (error) {
    next(error)
  }
}

exports.acceptedBooking = async (req, res, next) => {
  try {
    const { id } = req.user
    const { bookingId } = req.params
    const venueOwner = await venueOwnerModel.findById(id)
    const venueBooking = await venuebookingModel.findById(bookingId).populate('clientId')
    const client = await clientModel.findById(venueBooking.clientId);

    if (!venueOwner) {
      return res.status(404).json({
        message: 'venue owner not found',
      })
    }

    if (!client) {
      return res.status(404).json({
        message: 'Client not found',
      })
    }

    if (!venueBooking) {
      return res.status(404).json({
        message: 'Venue not booked',
      })
    }

    const link = `${req.protocol}://${req.get('host')}/payment`
    const apikey = process.env.brevo
    const apiInstance = new Brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apikey)

    const sendSmtpEmail = new Brevo.SendSmtpEmail()
    sendSmtpEmail.subject = 'Welcome to Eventiq'
    sendSmtpEmail.to = [{ email: client.email }]
    sendSmtpEmail.sender = { name: 'Eventiq', email: 'udumag51@gmail.com' }

    sendSmtpEmail.htmlContent = confirmedHtml(link, client.firstName)

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue'
      })
    }
    next(error)
  }
}


exports.rejectedBooking = async (req, res, next) => {
  try {
    const { id } = req.user
    const { bookingId } = req.params
    const { reason } = req.body
    const venueOwner = await venueOwnerModel.findById(id)
    const venueBooking = await venuebookingModel.findById(bookingId).populate('clientId')
    const client = await clientModel.findById(venueBooking.clientId);

    if (!venueOwner) {
      return res.status(404).json({
        message: 'venue owner not found',
      })
    }

    if (!client) {
      return res.status(404).json({
        message: 'Client not found',
      })
    }

    if (!venueBooking) {
      return res.status(404).json({
        message: 'Venue not booked',
      })
    }

    const apikey = process.env.brevo
    const apiInstance = new Brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apikey)

    const sendSmtpEmail = new Brevo.SendSmtpEmail()
    sendSmtpEmail.subject = 'Welcome to Eventiq'
    sendSmtpEmail.to = [{ email: client.email }]
    sendSmtpEmail.sender = { name: 'Eventiq', email: 'udumag51@gmail.com' }

    sendSmtpEmail.htmlContent = rejectedHtml(reason, client.firstName)

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue'
      })
    }
    next(error)
  }
}