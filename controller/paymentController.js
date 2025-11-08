const featureModel = require('../models/featuresModel')
const venueOwnerModel = require('../models/venueOwnerModel')
const clientModel = require('../models/clientModel')
const featuresPaymentModel = require('../models/featurePayment')
const venueModel = require('../models/venueModel')
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
    
    
    const venueBooking = await venuebookingModel.findById(req.params.id).populate('clientId').populate('venueId')
    // const venue = await venueModel.findOne({ _id: venueBooking.venueId })
   console.log(venueBooking);
   
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
      customer: { email: venueBooking.clientId.email },
      redirect_url: `${process.env.FRONTEND_BASE_URL}/payment-success`
    };
    console.log('payment:',payload);
    

    // const paymentdetails = {
    //   customer: { 
    //     email: venueBooking.clientId.email,
    //     name: client.firstName,
    //   },
    //   currency: 'NGN',
    //   amount: venue.price,
    //   reference: reference,
    //   redirect_url: `${process.env.FRONTEND_BASE_URL}/payment-success`
    // }
    console.log(process.env.KORA_SECRET_KEY);
    
    const { data } = await axios.post(
      'https://api.korapay.com/merchant/api/v1/charges/initialize',
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
        "Content-Type": "application/json"
        },
      }
    )
console.log(data);

    const payment = new paymentModel({
      venuebooking_id: venueBooking._id,
      clientId: venueBooking.clientId._id,
      reference: reference,
      venueId: venueBooking.venueId._id
    })
    venueBooking.paymentreference = data.data.reference;
    await venueBooking.save();
    await payment.save()
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
    const { reference } = req.params
    // Option A: check your DB (if webhook already updated the order)
    const order = await venuebookingModel.findOne({ paymentreference: reference });
    if (order && order.paymentstatus === "paid") {
      return res.json({ message:'payment already made' });
    }
// console.log(order);
 
    // Option B: call Korapay API to verify (if webhook may be delayed)
    const response = await axios.get(
      `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
        },
      }
    );
console.log(response.data);

    if (response.data.data.status === "success") {
      console.log('game');
      
      const order = await venuebookingModel.findOneAndUpdate(
        { paymentreference: reference },
        { paymentstatus: "paid" },
        { new: true }
      );
console.log(order);

      return res.json({message:"payment successful" });
    }

    res.json({ success: false, message: "Payment not confirmed yet" });
  } catch (error) {
    next(error)
  }
}
