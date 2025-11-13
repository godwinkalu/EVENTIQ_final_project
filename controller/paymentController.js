const featureModel = require('../models/featuresModel')
const venueOwnerModel = require('../models/venueOwnerModel')
const featuresPaymentModel = require('../models/featurePayment')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const Brevo = require('@getbrevo/brevo')
const otpGen = require('otp-generator')
const venuebookingModel = require('../models/venuebookingModel')
const paymentModel = require('../models/bookingPayment')
const invoiceModel = require('../models/invoiceModel')
const venueModel = require('../models/venueModel')
const { ClientInvoiceHtml } = require('../utils/confirmemailTemplate')
const withdrawalModel = require('../models/withdrawalModel')

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
    const { featureId, venueId } = req.params
    const venueOwner = await venueOwnerModel.findById(id)
    const feature = await featureModel.findById(featureId)
    const venue = await venueModel.findById(venueId)

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

    if (!venue) {
      res.status(404).json({
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
        email: venueOwner.email,
        name: venueOwner.firstName,
      },
      currency: 'NGN',
      amount: feature.amount,
      reference: reference,
      redirect_url: `${process.env.FRONTEND_BASE_URL}/payment-success`,
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
      venueId: venue._id,
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
    const venueBooking = await venuebookingModel
      .findById(req.params.bookingId)
      .populate('clientId')
      .populate('venueId')

    if (!venueBooking) {
      return res.status(404).json({
        message: 'No booking found',
      })
    }

    const reference = otpGen.generate(12, {
      digits: true,
      upperCaseAlphabets: true,
      lowerCaseAlphabets: true,
      specialChars: false,
    })

    const payload = {
      amount: venueBooking.total,
      currency: 'NGN',
      reference,
      customer: { email: venueBooking.clientId.email, name: venueBooking.clientId.firstName },
      redirect_url: `${process.env.FRONTEND_BASE_URL}/#/payment-success`,
    }

    const { data } = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', payload, {
      headers: {
        Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
      },
    })

    const payment = paymentModel.create({
      venuebookingId: venueBooking._id,
      clientId: venueBooking.clientId._id,
      reference: reference,
      venueId: venueBooking.venueId._id,
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
    const { reference } = req.query

    if (!reference) {
      return res.status(400).json({ message: 'Reference is required' })
    }
    console.log('reference:', reference)

    // Check both models for matching reference
    const payment =
      (await paymentModel.findOne({ reference }).populate('venueId').populate('venuebookingId')) ||
      (await featuresPaymentModel.findOne({ reference }).populate('venueId').populate('venuebookingId'))

    console.log('Payment:', payment)

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    // Verify payment with KoraPay API
    const { data } = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
      },
    })

    console.log('kora res:', data)

    if (data.status === true && data.data.status === 'success') {
      if (payment.type === 'venuebooking') {
        const booking = await venuebookingModel
          .findById(payment.venuebookingId)
          .populate('clientId')
          .populate('venueId')

        if (!booking) {
          return res.status(404).json({ message: 'Booking not found' })
        }

        if (data.status === true && data.data.status === 'success') {
          payment.status = 'successful'
          booking.paymentstatus = 'paid'
          await Promise.all([payment.save(), booking.save()])
          const venue = await venueModel.findById(booking.venueId._id)
          const per = (10 / 100) * booking.total
          venue.availableBalance = booking.total - per
          await venue.save()
          // Create invoice
          const invoice = await invoiceModel.create({
            clientId: booking.clientId._id,
            venueId: booking.venueId._id,
            venuebookingId: booking._id,
          })

          // Send email notification
          const link = `https://event-app-theta-seven.vercel.app/#/invoice/${invoice._id}`
          console.log(link);
          
          const apikey = process.env.brevo
          const apiInstance = new Brevo.TransactionalEmailsApi()
          apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apikey)

          const sendSmtpEmail = new Brevo.SendSmtpEmail()
          sendSmtpEmail.subject = 'Venue Invoice'
          sendSmtpEmail.to = [{ email: booking.clientId.email }]
          sendSmtpEmail.sender = { name: 'Eventiq', email: 'udumag51@gmail.com' }
          sendSmtpEmail.htmlContent = ClientInvoiceHtml(
            link,
            booking.clientId.firstName,
            booking.venueId.venuename.toUpperCase()
          )

          try {
            await apiInstance.sendTransacEmail(sendSmtpEmail)
          } catch (emailError) {
            console.error('Email sending failed:', emailError.message)
          }

          return res.status(200).json({
            message: 'Payment verified successfully',
            data: data,
            invoice,
          })
        }
      }

      // Handle venue booking payments
      else if (data.status === true && data.data.status === 'failed') {
        payment.status = 'failed'
        booking.paymentstatus = 'failed'
        await Promise.all([payment.save(), booking.save()])
        return res.status(400).json({ message: 'Payment failed' })
      }
    }

    // Handle feature payments
    else if (payment.type === 'feature') {
      const venue = await venueModel.findById(payment.venueId)
      if (!venue) {
        return res.status(404).json({ message: 'Venue not found' })
      }

      if (data.status === true && data.data.status === 'success') {
        payment.status = 'successful'
        venue.isFeatured = true
        await Promise.all([payment.save(), venue.save()])

        return res.status(200).json({
          message: 'Venue feature payment verified successfully',
          data: data,
        })
      }

      if (data.status === true && data.data.status === 'failed') {
        payment.status = 'failed'
        await payment.save()

        return res.status(400).json({
          message: 'Venue feature payment failed',
          data: data,
        })
      }
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    next(error)
  }
}

exports.withdrawEarnings = async (req, res, next) => {
  try {
    const { amount, bankName, accountType, accountName, accountNumber } = req.body

    const venueOwner = await venueOwnerModel.findById(req.user.id)
    const venue = await venueModel.findOne({ venueOwnerId: venueOwner._id })
    const venueBooking = await venuebookingModel.findOne({ venueId: venue._id })
    console.log(venueBooking)

    if (!venueOwner) {
      return res.status(404).json({
        message: 'venue Owner not found',
      })
    }
    if (!venue) {
      return res.status(404).json({
        message: 'venue  not found',
      })
    }
    if (!venueBooking) {
      return res.status(404).json({
        message: 'venueBooking  not found',
      })
    }

    if (amount < venue.availableBalance) {
      return res.status(400).json({
        message: 'insuffeint Available Balance',
      })
    }

    const withdrawal = await withdrawalModel.create({
      venueOwnerId: venueOwner._id,
      venuebookingId: venueBooking._id,
      venueId: venue._id,
      amount,
      bankName,
      accountName,
      accountType,
      accountNumber,
    })

    return res.status(200).json({
      message: 'Withdrawal request submitted successfully.',
      data: {
        withdrawalId: withdrawal._id,
        amount: withdrawal.amount,
        status: withdrawal.status,
        availableBalance: venue.availableBalance,
      },
    })
  } catch (error) {
    next(error)
  }
}
