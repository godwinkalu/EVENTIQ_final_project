const clientModel = require('../models/clientModel')
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
    const existVenueOwner = await venueModel.findOne({ email: email.toLowerCase() }) 

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

    const imgUrl =
      'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=1024x1024&w=is&k=20&c=oGqYHhfkz_ifeE6-dID6aM7bLz38C6vQTy1YcbgZfx8='

    const response = await cloudinary.uploader.upload(imgUrl)

    const client = new clientModel({
      firstName,
      surname,
      email,
      password: hashedPassword,
      otp: otp,
      otpExpiredat: Date.now() + 1000 * 60 * 2,
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


    console.log(client)
    return res.status(201).json({
      message: 'Client created successfully',
      data: client,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

exports.fetch = async (req, res, next) => {
  try {
    const client = await clientModel
      .find()
      .select('-password -phoneNumber -isVerified -role -otp -otpExpiredat -__v')

    res.status(200).json({
      message: 'Clients fetched',
      data: client,
    })
  } catch (error) {
    next(error)
  }
}

exports.getAclient = async (req, res, next) => {
  try {
    const { id } = req.params
    const client = await clientModel
      .findById(id)
      .select('-password -phoneNumber -isVerified -role -otp -otpExpiredat -__v')

    if (!client) {
      return res.status(404).json(`Client with the ID: ${id} not found`)
    }

    res.status(200).json({
      message: 'Clients found',
      data: client,
    })
  } catch (error) {
    next(error)
  }
}

exports.updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'client_profiles',
      });
      updates.profilePicture = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    delete updates.password;

    const updatedClient = await clientModel.findByIdAndUpdate(
      id,
      updates,
      { new: true}
    ).select('-password -otp -otpExpiredat -__v');

    if (!updatedClient) {
      return res.status(404).json({
        message: 'Client not found',
      });
    }

    res.status(200).json({
      message: 'Client updated successfully',
      data: updatedClient,
    });
  } catch (error) {
    next(error);
  }
};

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