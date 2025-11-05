const featureModel = require('../models/featuresModel')
const venueOwnerModel = require('../models/venueOwnerModel')
const clientModel = require('../models/clientModel')
const featuresPaymentModel = require('../models/featurePayment')
const venueModel = require('../models/venueModel')
const bookingPaymentModel = require('../models/bookingPayment')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const otpGen = require('otp-generator')
const venuebookingModel = require('../models/venuebookingModel')
const paymentModel = require('../models/bookingPayment')

exports.createFeatures = async (req, res, next) => {
  try {
    const { duration, amount } = req.body
    const existedFeature = await featureModel.findOne({ duration: duration, amount: amount })

    if (existedFeature) {
      return res.status(400).json({
        message: 'Features already created',
      })
    }

    const feature = new featureModel({
      amount,
      duration,
    })

    await feature.save()
    res.status(201).json({
      message: 'Features created successfully',
      data: feature,
    })
  } catch (error) {
    next(error)
  }
}

exports.getAllFeatures = async (req, res, next) => {
  try {
    const { id } = req.user
    const venueOwner = await venueOwnerModel.findById(id)

    if (!venueOwner) {
      res.status(404).json({
        message: 'Venue Owner not found',
      })
    }

    const features = await featureModel.find()
    res.status(200).json({
      message: 'All features listed below',
      data: features,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, Please login to continue',
      })
    }
    next(error)
  }
}

exports.initializeFeaturePayment = async (req, res, next) => {
  try {
    const { id } = req.user
    const { featureId } = req.params
    const venueOwner = await venueOwnerModel.findById(id)
    const feature = await featureModel.findById(featureId)

    if (!venueOwner) {
      res.status(404).json({
        message: 'Venue Owner not found',
      })
    }

    if (!feature) {
      res.status(404).json({
        message: 'Feature not found',
      })
    }

    const reference = otpGen.generate(12, {
      digits: true,
      upperCaseAlphabets: true,
      lowerCaseAlphabets: true,
      specialChars: false,
    })

    const paymentdetails = {
      customer: {
        email: venueOwner.email,
        name: venueOwner.firstName,
      },
      currency: 'NGN',
      amount: feature.amount,
      reference: reference,
    }

    const { data } = await axios.post(
      'https://api.korapay.com/merchant/api/v1/charges/initialize',
      paymentdetails,
      {
        headers: {
          Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
        },
      }
    )

    const featurePayment = new featuresPaymentModel({
      venueOwnerId: venueOwner._id,
      featureId: feature._id,
      reference: data.reference,
      subscriptionType: `${feature.duration} month(s)`,
    })

    res.status(200).json({
      message: 'Payment initialized',
      data: data.data,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, Please login to continue',
      })
    }
    next(error)
  }
}

exports.initializeBookingPayment = async (req, res, next) => {
  try {
    const { clientId } = req.params
    const client = await clientModel.findById(clientId)
    const venueBooking = await venuebookingModel.findOne({ clientId: client._id })
    const venue = await venueModel.findOne({ _id: venueBooking.venueId })

    if (!client) {
      return res.status(404).json({
        message: 'client not found',
      })
    }

    if (!venueBooking) {
      return res.status(404).json({
        message: 'No booking found',
      })
    }

    if (!venue) {
      return res.status(404).json({
        message: 'Venue not found',
      })
    }

    const reference = otpGen.generate(12, {
      digits: true,
      upperCaseAlphabets: true,
      lowerCaseAlphabets: true,
      specialChars: false,
    })

    const paymentdetails = {
      customer: {
        email: client.email,
        name: client.firstName,
      },
      currency: 'NGN',
      amount: venue.price,
      reference: reference,
    }

    const { data } = await axios.post(
      'https://api.korapay.com/merchant/api/v1/charges/initialize',
      paymentdetails,
      {
        headers: {
          Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
        },
      }
    )

    const bookingPayment = await bookingPaymentModel.create({
      venuebookingId: venue._id,
      clientId: client._id,
      reference: data.reference,
    })
    res.status(200).json({
      message: 'Payment initialized',
      data: data.data,
    })
  } catch (error) {
    next(error)
  }
}

exports.verifyPayment = async (req, res, next) => {
  try {
    const { event, data } = req.body
    console.log('event:', event)
    console.log('data:', data)
    if (!event || !data) {
      res.status(400).json({
        message: 'Error retrieving response from kora pay',
      })
    }

    const payment = await paymentModel.findOne({ reference: data.reference })
    const venueBooking = await venuebookingModel.findOne({ _id: payment.venuebookingId })

    if (!payment) {
      return res.status(404).json({
        message: 'No payment found',
      })
    }

    if (!venueBooking) {
      return res.status(404).json({
        message: 'Booking not found',
      })
    }

    if (event === 'charge.success' && data.status === 'success') {
      payment.status = successful
      venueBooking.paymentstatus = 'paid'
      await payment.save()
      await venueBooking.save()
      res.status(200).json({
        messagwe: 'Payment verified successful',
      })
    } else if (event === 'charge.failed' && data.status === 'failed') {
      payment.status = failed
      venueBooking.paymentstatus = 'failed'
      await payment.save()
      await venueBooking.save()
      res.status(200).json({
        messagwe: 'Payment failed via webhook',
      })
    } else if (event === 'charge.failed' && data.status === 'failed') {
    }
  } catch (error) {
    next(error)
  }
}
