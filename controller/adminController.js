const adminModel = require('../models/adminModel')
const venueModel = require('../models/venueModel')
const venueOwnerModel = require('../models/venueOwnerModel')
const venueBookingModel = require('../models/venuebookingModel')
const clientModel = require('../models/clientModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Brevo = require('@getbrevo/brevo')
const { signUpTemplate } = require('../utils/emailTemplate')
const venuebookingModel = require('../models/venuebookingModel')

exports.signUp = async (req, res, next) => {
  const { firstName, surname, phoneNumber, email, password } = req.body
  try {
    const admin = await adminModel.findOne({ email: email.toLowerCase() })

    if (admin) {
      return res.status(404).json({
        message: 'admin  already exists, log in to your account',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newadmin = new adminModel({
      firstName,
      surname,
      phoneNumber,
      email,
      password: hashedPassword,
    })
    await newadmin.save()

    return res.status(201).json({
      message: 'admin created successfully',
      data: {
        firstName: newadmin.firstName,
        surname: newadmin.surname,
        email: newadmin.email,
        id: newadmin._id,
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.getAllAdmin = async (req, res, next) => {
  try {
    const allAdmin = await adminModel
      .find()
      .select('-password -phoneNumber -isVerified -isLoggedIn -role -__v')

    res.status(200).json({
      message: `All admin fetched`,
      total: allAdmin.length,
      data: allAdmin,
    })
  } catch (error) {
    next(error)
  }
}

exports.getOneAdmin = async (req, res, next) => {
  try {
    const { id } = req.params

    const admin = await adminModel.findById(id).select('-phoneNumber -password -isVerified -isLoggedIn -role')

    if (!admin) {
      return res.status(404).json(`Admin with the ID: ${id} not found`)
    }

    res.status(200).json({
      message: `Admin found`,
      data: admin,
    })
  } catch (error) {
    next(error)
  }
}

exports.updateAdminInfo = async (req, res) => {
  try {
    const { firstName, surname, password, phoneNumber } = req.body
    const { id } = req.params

    const admin = await adminModel.findById(id)
    if (!admin) {
      return res.status(404).json({
        message: `Admin with the ID: ${id} not found`,
      })
    }

    let hashedPassword = admin.password
    if (password) {
      const salt = await bcrypt.genSalt(10)
      hashedPassword = await bcrypt.hash(password, salt)
    }

    const updatedData = {
      firstName: firstName ?? admin.firstName,
      surname: surname ?? admin.surname,
      phoneNumber: phoneNumber ?? admin.phoneNumber,
      password: hashedPassword,
    }

    const updatedAdmin = await adminModel.findByIdAndUpdate(id, updatedData, { new: true })

    return res.status(200).json({
      message: 'Admin updated successfully',
      data: {
        firstName: updatedAdmin.firstName,
        surname: updatedAdmin.surname,
        email: updatedAdmin.email,
      },
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params

    const admin = await adminModel.findById(id)
    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found',
      })
    }

    await adminModel.findByIdAndDelete(id)

    return res.status(200).json({
      message: 'Admin deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}


exports.VenuesOwner = async (req, res, next) => {
  try {
    const id = req.user.id
    const venueowner = await venueOwnerModel.findById(id)
    if (!venueowner) {
      return res.status(404).json({
        message: 'venueowner not found',
      })
    }
    const venues = await venueModel.find({ venueOwnerId: venueowner._id })
    res.status(200).json({
      message: 'All venues listed',
      data: venues,
      total: venues.length,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'session expired please login to continue',
      })
    }
    next(error)
  }
}


exports.allVenues = async (req, res, next) => {
  try {
    const venues = await venueModel.find({ status: 'verified' }).sort({ isFeatured: -1, createdAt: -1 });

    res.status(200).json({
      message: 'All venues listed',
      data: venues,
      total: venues.length,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'session expired please login to continue',
      })
    }
    next(error)
  }
}

exports.allVenueStatus = async (req, res, next) => {
  try {
    const status = req.query.status;
    const adminid = req.user.id
    const admin = await adminModel.findById(adminid)
    if (!admin) {
      return res.status(404).json({
        message: 'admin not found',
      })
    }
    const venues = await venueModel.find({ status: `${status.toLowerCase()}` })
    res.status(200).json({
      message: 'All venues listed',
      data: venues,
      total: venues.length,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'session expired please login to continue',
      })
    }
    next(error)
  }
}


exports.allVenuesFeatured = async (req, res, next) => {
  try {
    const adminid = req.user.id
    const admin = await adminModel.findById(adminid)
    if (!admin) {
      return res.status(404).json({
        message: 'admin not found',
      })
    }
    const venues = await venueModel.find({ isFeatured: true })
    res.status(200).json({
      message: 'All venues listed',
      data: venues,
      total: venues.length,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'session expired please login to continue',
      })
    }
    next(error)
  }
}

exports.verifiyVenue = async (req, res, next) => {
  try {
    const admin = await adminModel.findById(req.user.id);
    const venue = await venueModel.findById(req.params.venueId);

    if (!admin) {
      return res.status(404).json({
        message: 'admin not found',
      })
    }

    if (!venue) {
      return res.status(404).json({
        message: 'venue not found',
      })
    }

    venue.status = 'verified'
    await venue.save()
    res.status(200).json({
      message: 'venue verified  successfully',
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'session expired please login to continue',
      })
    }
    next(error)
  }
}

exports.unverifiedVenue = async (req, res, next) => {
  try {
    const { reason } = req.body
    const admin = await adminModel.findById(req.user.id);
    const venue = await venueModel.findById(req.params.venueId);
    const venueowner = await venueOwnerModel.findOne({ _id: venue.venueOwnerId })

    if (!admin) {
      return res.status(404).json({
        message: 'admin not found',
      })
    }

    if (!venue) {
      return res.status(404).json({
        message: 'venue not found',
      })
    }

    if (!venueowner) {
      return res.status(404).json({
        message: 'venue owner not found',
      })
    }

    venue.status = 'unverified'
    await venue.save()

    const apikey = process.env.brevo
    const apiInstance = new Brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apikey)

    const sendSmtpEmail = new Brevo.SendSmtpEmail()
    sendSmtpEmail.subject = 'Welcome to Eventiq'
    sendSmtpEmail.to = [{ email: venueowner.email }]
    sendSmtpEmail.sender = { name: 'Eventiq', email: 'udumag51@gmail.com' }

    sendSmtpEmail.htmlContent = signUpTemplate(reason, venueowner.firstName)

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    res.status(200).json({
      message: 'venue unverified  successfully',
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'session expired please login to continue',
      })
    }
    next(error)
  }
}



exports.allVenuesForAdmin = async (req, res, next) => {
  try {
    const adminid = req.user.id
    const admin = await adminModel.findById(adminid)
    if (!admin) {
      return res.status(404).json({
        message: 'admin not found',
      })
    }
    const venues = await venueModel.find();

    res.status(200).json({
      message: 'All venues listed',
      data: venues,
      total: venues.length,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'session expired please login to continue',
      })
    }
    next(error)
  }
}


exports.getOverview = async (req, res, next) => {
  try {
    const admin = await adminModel.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found'
      })
    }

    const totalVenues = await venueModel.find();
    const totalVenueOwners = await venueOwnerModel.find({ isVerified: true });
    const totalClients = await clientModel.find({ isVerified: true })
    const totalBookings = await venuebookingModel.find({ bookingstatus: 'confirmed' });
    const totalRevenue = await venueBookingModel.find({ paymentstatus: 'paid' })

    const data = {
      totalVenues: totalVenues.length,
      totalUser: totalVenueOwners.length + totalClients.length,
      totalBookings: totalBookings.length,
      totalRevenue: totalRevenue.reduce((a, c)=> a + c.total, 0)
    }

    res.status(200).json({
      message: 'Overview for admin corrolated successfully',
      totalManagement: totalBookings,
      analysis: data
    })
  } catch (error) {
    next(error)
  }
}