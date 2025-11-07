const clientModel = require('../models/clientModel')
const venuebookingModel = require('../models/venuebookingModel')
const venueModel = require('../models/venueModel')
const venueOwnerModel = require('../models/venueOwnerModel')
const notificationvenueownerModel = require('../models/notificationvenueOwnerModel')
const notificationclientModel = require('../models/notificationclientModel')
const { confirmedHtml, rejectedHtml } = require('../utils/confirmemailTemplate')
const jwt = require('jsonwebtoken')
const Brevo = require('@getbrevo/brevo')
const { date } = require('joi')

exports.createvenuebooking = async (req, res, next) => {
  try {
    const { date, days, eventType } = req.body
    const { venueId } = req.params
    const clientId = req.user.id
    const venue = await venueModel.findById(venueId)
    console.log(venue.venueOwnerId);
    const venueOwner = await venueOwnerModel.findById(venue.venueOwnerId)

    const client = await clientModel.findById(clientId)

    if (!client) {
      return res.status(404).json({ message: 'Client not found' })
    }

    if (!venueOwner) {
      return res.status(404).json({ message: 'Venue owner not found' })
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
      bookingstatus: 'pending',
      date: date
    })

    if (!eventType) {
      return res.status(400).json({
        message: 'Event Type is required'
      })
    }
    if (existingBooking) {
      return res.status(400).json({
        message: 'Venue is already booked for the selected date by this user',
      })
    }

    // Calculate total cost
    const basePrice = venue.price * days
    const serviceCharge = basePrice * (10 / 100)
    const totalAmount = basePrice + serviceCharge

    const [day, month, year] = date.split('/')
    const jsDate = new Date(`${month} ${day}, ${year}`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    //  Create booking
    const newBooking = new venuebookingModel({
      venueId: venue._id,
      venueownerId: venueOwner._id,
      clientId: client._id,
      venueOwnerId: venue.venueOwnerId,
      date: jsDate,
      total: totalAmount * days,
      servicecharge: serviceCharge,
      eventType
    })

    await newBooking.save()

    const notification = await notificationvenueownerModel.create({
      venueOwnerId: venueOwner._id,
      BookingId: newBooking._id,
      venueId: venue._id,
      notificationTitle: 'New Booking Request',
      notificationMsg: `${client.firstName} ${client.surname} requested ${venue.venuename} for ${newBooking.date}.`,
      dot: '#800080',
      time: new Date(),
    })

    return res.status(201).json({
      message: 'Venue booked successfully',
      data: newBooking,
    })
  } catch (error) {
    console.error('Booking Error:', error)
    next(error)
  }
}

exports.acceptedBooking = async (req, res, next) => {
  try {
    const venueOwner = await venueOwnerModel.findById(req.user.id)
    const venueBooking = await venuebookingModel.findById(req.params.bookingId).populate('clientId')
    const client = await clientModel.findById(venueBooking.clientId)
    const venue = await venueModel.findById(venueBooking.venueId)

    if (!venueOwner) {
      return res.status(404).json({
        message: 'venue owner not found',
      })
    }

    if (!venue) {
      return res.status(404).json({
        message: 'venue not found',
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

    venueBooking.bookingstatus = 'confirmed'
    await venueBooking.save()
    const link = `${req.protocol}://${req.get('host')}/payment`

    const apikey = process.env.brevo
    const apiInstance = new Brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apikey)
    const sendSmtpEmail = new Brevo.SendSmtpEmail()
    sendSmtpEmail.subject = 'Venue Approval'
    sendSmtpEmail.to = [{ email: client.email }]
    sendSmtpEmail.sender = { name: 'Eventiq', email: 'udumag51@gmail.com' }
    sendSmtpEmail.htmlContent = confirmedHtml(link, client.firstName, venue.venuename, venueBooking.date)
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    
    res.status(200).json({
      message: 'Booking accepted successfully'
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

exports.rejectedBooking = async (req, res, next) => {
  try {
    const { reason } = req.body
    const venueOwner = await venueOwnerModel.findById(req.user.id)
    const venueBooking = await venuebookingModel.findById(req.params.bookingId).populate('clientId')
    const client = await clientModel.findById(venueBooking.clientId)
    const venue = await venueModel.findById(venueBooking.venueId)

    if (!venueOwner) {
      return res.status(404).json({
        message: 'venue owner not found',
      })
    }

    if (!venue) {
      return res.status(404).json({
        message: 'venue not found',
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

    venueBooking.bookingstatus = 'rejected'
    await venueBooking.save()

    const notification = await notificationclientModel.create({
      clientId: client._id,
      BookingId: venueBooking._id,
      venueId: venue._id,
      notificationTitle: 'Booking Rejected',
      notificationMsg: `Your booking request at ${venue.venuename} has been confirmed for ${venueBooking.date}.`,
      dot: '#ff0000',
      time: new Date(),
    })

    const apikey = process.env.brevo
    const apiInstance = new Brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apikey)
    const sendSmtpEmail = new Brevo.SendSmtpEmail()
    sendSmtpEmail.subject = 'Venue Rejected'
    sendSmtpEmail.to = [{ email: client.email }]
    sendSmtpEmail.sender = { name: 'Eventiq', email: 'udumag51@gmail.com' }
    sendSmtpEmail.htmlContent = rejectedHtml(reason, client.firstName, venue.venuename, venueBooking.date)
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    await venuebookingModel.findByIdAndDelete(venueBooking._id)
      res.status(200).json({
      message: 'Booking has been rejected'
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
