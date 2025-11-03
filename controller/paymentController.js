const featureModel = require('../models/featuresModel');
const venueOwnerModel = require('../models/venueOwnerModel')
const featureSubModel = require('../models/featureSub');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const otpGen = require('otp-generator');


exports.createFeatures = async (req, res, next) => {
  try {
    const { duration, amount } = req.body;
    const existedFeature = await featureModel.findOne({ duration: duration, amount: amount });

    if (existedFeature) {
      return res.status(400).json({
        message: 'Features already created'
      })
    };

    const feature = new featureModel({
      amount,
      duration
    });

    await feature.save();
    res.status(201).json({
      message: 'Features created successfully',
      data: feature
    })
  } catch (error) {
    next(error)
  }
};


exports.getAllFeatures = async (req, res, next) => {
  try {
    const { id } = req.user;
    const venueOwner = await venueOwnerModel.findById(id);

    if (!venueOwner) {
      res.status(404).json({
        message: 'Venue Owner not found'
      })
    };

    const features = await featureModel.find();
    res.status(200).json({
      message: 'All features listed below',
      data: features
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, Please login to continue'
      })
    }
    next(error)
  }
};


exports.subscribeOneFeature = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { featureId } = req.params;
    const venueOwner = await venueOwnerModel.findById(id);
    const feature = await featureModel.findById(featureId);

    if (!venueOwner) {
      res.status(404).json({
        message: 'Venue Owner not found'
      })
    };

    if (!feature) {
      res.status(404).json({
        message: 'Feature not found'
      })
    };

    const reference = otpGen.generate(12, { digits: true, upperCaseAlphabets: true, lowerCaseAlphabets: true, specialChars: false });

    const paymentData = {
      customer: {
        email: venueOwner.email,
        name: venueOwner.firstName
      },
      currency: 'NGN',
      amount: feature.amount,
      reference: reference
    };

    const { data } = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', paymentData, {
      headers: {
        Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`
      }
    });

    const featureSub = new featureSubModel({
      venueOwnerId: venueOwner._id,
      featureId: feature._id,
      reference: reference,
      subscriptionType: `${feature.duration} month(s)`,
      
    })

    res.status(200).json({
      message: 'Payment initialized',
      data: data.data
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, Please login to continue'
      })
    }
    next(error)
  }
};


exports.verifyPayment = async (req, res, next) => {
  try {
   const {event, data} = req.body;
    console.log(event);
    console.log(data);
    
   if (!event || !data) {
    res.status(400).json({
      message: 'Error retrieving response from kora pay'
    })
   };

  //  if(event)
    
  } catch (error) {
    next(error)
  }
};