const venueOwnerModel = require('../models/venueOwnerModel')
const clientModel = require('../models/clientModel')
const adminModel = require('../models/adminModel')
const jwt = require('jsonwebtoken')
const { signUpTemplate } = require('../utils/emailTemplate')
const { emailSender } = require('../middleware/brevo')
const bcrypt = require('bcrypt')
const Brevo = require('@getbrevo/brevo')
const cloudinary = require('../config/cloudinary')
const fs = require('fs')

exports.verify = async (req, res, next) => {
  const { email, otp } = req.body
  try {
    const user =
      (await venueOwnerModel.findOne({ email: email.toLowerCase() })) ||
      (await clientModel.findOne({ email: email.toLowerCase() }))

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (Date.now() >= user.otpExpiredat) {
      return res.status(400).json({
        message: 'Otp expired',
      })
    }

    if (otp !== user.otp) {
      return res.status(404).json({
        message: 'Incorrect Otp',
      })
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: 'User already verified, please proceed to login',
      })
    }

    Object.assign(user, {
      isVerified: true,
      otp: null,
      otpExpiredat: null,
    })
      const token = jwt.sign(
      { id: user._id, isLoggedIn: user.isLoggedIn, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    ) 
    await user.save()
    res.status(200).json({
      message: 'User verified Successfully',
      token
    })
  } catch (error) {
    next(error)
  }
}

exports.resendOtp = async (req, res, next) => {
  const { email } = req.body
  try {
    const user =
      (await venueOwnerModel.findOne({ email: email.toLowerCase() })) ||
      (await clientModel.findOne({ email: email.toLowerCase() }))

    if (!user) {
      return res.status(404).json({
        message: 'user not found',
      })
    }

    const newOtp = Math.floor(1000 + Math.random() * 1e6)
      .toString()
      .padStart(6, '0')
    user.otp = newOtp
    user.otpExpiredat = Date.now() + 2 * 60 * 1000
    await user.save()
    const apikey = process.env.brevo
    const apiInstance = new Brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apikey)

    const sendSmtpEmail = new Brevo.SendSmtpEmail()
    sendSmtpEmail.subject = 'Welcome to Eventiq'
    sendSmtpEmail.to = [{ email: user.email }]
    sendSmtpEmail.sender = { name: 'Eventiq', email: 'udumag51@gmail.com' }

    sendSmtpEmail.htmlContent = signUpTemplate(newOtp, user.firstName)

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    res.status(200).json({
      message: 'OTP resent successfully',
    })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user =
      (await venueOwnerModel.findOne({ email: email.toLowerCase() })) ||
      (await clientModel.findOne({ email: email.toLowerCase() })) ||
      (await adminModel.findOne({ email: email.toLowerCase() }))

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }
    if (user.isVerified === false) {
      return res.status(404).json({
        message: 'please verify',
      })
    }

    const correctPassword = await bcrypt.compare(password, user.password)

    if (!correctPassword) {
      return res.status(400).json({
        message: 'Invaild Credentials',
      })
    }

    user.isLoggedIn = true
    const token = jwt.sign(
      { id: user._id, isLoggedIn: user.isLoggedIn, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )

    await user.save()
    const { otp, otpExpiredat, isVerified, isLoggedIn, createdAt, updatedAt, __v, ...data } = user.toObject()
    res.status(200).json({
      message: 'Logged in successfully',
      data,
      token,
    })
  } catch (error) {
    next(error)
  }
}

exports.changePassword = async (req, res, next) => {
  const { id } = req.user
  const { oldPassword, newPassword, confirmPassword } = req.body

  try {
    const user =
      (await venueOwnerModel.findById(id)) ||
      (await clientModel.findById(id)) ||
      (await adminModel.findById(id))

    if (!user) {
      return res.status(404).json({
        message: 'user not found',
      })
    }

    const checkOldPassword = await bcrypt.compare(oldPassword, user.password)
    if (!checkOldPassword) {
      return res.status(400).json({
        message: 'Oldpassword Incorrect',
      })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'newPassword mismatch',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedPassword
    await user.save()
    return res.status(200).json({
      message: 'Password changed successfully',
    })
  } catch (error) {
    next(error)
  }
}

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body
  try {
    const user =
      (await venueOwnerModel.findOne({ email: email.toLowerCase() })) ||
      (await adminModel.findOne({ email: email.toLowerCase() })) ||
      (await clientModel.findOne({ email: email.toLowerCase() }))

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const newOtp = Math.floor(1000 + Math.random() * 1e6)
      .toString()
      .padStart(6, '0')
    user.otp = newOtp
    user.otpExpiredat = Date.now() + 2 * 60 * 1000
    await user.save()

    if (`${req.protocol}://${req.get('host')}`.startsWith('http://localhost')) {
      const emailOptions = {
        email: user.email,
        subject: 'Reset Password',
        html: signUpTemplate(newOtp, user.firstName),
      }

      emailSender(emailOptions)
    } else {
    }

    return res.status(200).json({
      message: 'forgot password request sent',
    })
  } catch (error) {
    next(error)
  }
}

exports.resetPassword = async (req, res, next) => {
  const { email, newPassword, confirmPassword } = req.body
  try {
    const user =
      (await venueOwnerModel.findOne({ email: email.toLowerCase() })) ||
      (await adminModel.findOne({ email: email.toLowerCase() })) ||
      (await clientModel.findOne({ email: email.toLowerCase() }))

    if (!user) {
      return res.status(404).json({
        message: 'user not found',
      })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Password mismatch',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    user.password = hashedPassword
    await user.save()
    return res.status(404).json({
      message: 'Password reset successfully',
    })
  } catch (error) {
    next(error)
  }
}

exports.updateProfile = async (req, res, next) => {
  try {
    const { id } = req.user
    const { phoneNumber } = req.body
    const file = req.file

    const user =
      (await venueOwnerModel.findById(id)) ||
      (await clientModel.findById(id)) ||
      (await adminModel.findById(id))

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    let img

    if (file && file.path) {
      const response = await cloudinary.uploader.upload(file.path)
      fs.unlinkSync(file.path)
      img = {
        url: response.secure_url,
        publicId: response.public_id,
      }
    }

    let data = {
      phoneNumber: phoneNumber ?? user.phoneNumber,
      profilePicture: img ?? user.profilePicture,
    }

    Object.assign(user, data)
    await user.save()
    res.status(200).json({
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
      },
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
