const featureModel = require('../models/featuresModel')
const venueOwnerModel = require('../models/venueOwnerModel')
const featuresPaymentModel = require('../models/featurePayment')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const otpGen = require('otp-generator')
const venuebookingModel = require('../models/venuebookingModel')
const paymentModel = require('../models/bookingPayment')
const invoiceModel = require('../models/invoiceModel')
const venueModel = require('../models/venueModel')

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
      redirect_url: `${process.env.FRONTEND_BASE_URL}/payment-success`
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
      venueId: venue._id
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
    const venueBooking = await venuebookingModel.findById(req.params.bookingId).populate('clientId').populate('venueId')

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
      currency: "NGN",
      reference,
      customer: { email: venueBooking.clientId.email, name: venueBooking.clientId.firstName },
      redirect_url: `${process.env.FRONTEND_BASE_URL}/#/payment-success`
    };

    const { data } = await axios.post(
      'https://api.korapay.com/merchant/api/v1/charges/initialize',
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
        },
      }
    )

    const payment = paymentModel.create({
      venuebookingId: venueBooking._id,
      clientId: venueBooking.clientId._id,
      reference: reference,
      venueId: venueBooking.venueId._id
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
    const { reference } = req.query;
    const payment = await paymentModel.findOne({ reference: reference }) || await featuresPaymentModel.findOne({ reference: reference });

    if (payment.type === 'venuebooking') {
      const booking = await venuebookingModel.findById(payment.venuebookingId).populate('clientId').populate('venueId')

      if (!payment) {
        return res.json({ message: 'payment not found' });
      }

      if (!booking) {
        return res.json({ message: 'booking not found' });
      }

      const { data } = await axios.get(
        `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
          },
        }
      );

      if (data.status === true && data.data.status === 'success') {
        payment.status = 'successful'
        booking.paymentstatus = 'paid'
        await payment.save()
        await booking.save()
        const invoice = await invoiceModel.create({
          clientId: booking.clientId._id,
          venueId: booking.venueId._id,
          venuebookingId: booking._id
        })
        res.json({ message: "payment verified successful" });
      } else if (data.status === true && data.data.status === 'failed') {
        payment.status = 'failed'
        booking.paymentstatus = 'failed'
        await payment.save()
        await booking.save()
        res.json({ message: "payment verified successful" });
      }
    } else if (payment.type === 'feature') {
      const venue = await venueModel.findById(payment.venueId);

      if (!venue) {
        return res.status(404).json({
          message: 'Venue not found'
        })
      }

      const { data } = await axios.get(
        `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
          },
        }
      );

      if (data.status === true && data.data.status === 'success') {
        payment.paymentstatus = 'successful'
        venue.isFeatured = true
        await payment.save()
        await venue.save()
        const invoice = await invoiceModel.create({
          clientId: booking.clientId._id,
          venueId: booking.venueId._id,
          venuebookingId: booking._id
        })
        res.json({ message: "payment verified successful" });
      } else if (data.status === true && data.data.status === 'failed') {
        payment.paymentStatus = 'failed'
        await payment.save()
        res.json({ message: "payment verified successful" });
      }
    }
  } catch (error) {
    next(error)
  }
}
