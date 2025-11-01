const adminModel = require('../models/adminModel')
const bcrypt = require('bcrypt');
const venueOwnerModel = require('../models/venueOwnerModel');

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
        id: newadmin._id
      }
    })
  } catch (error) {
    next(error)
  }
};


exports.getAllAdmin = async (req, res, next) => {
  try {
    const allAdmin = await adminModel.find().select('-password -phoneNumber -isVerified -isLoggedIn -role -__v')

    res.status(200).json({
      message: `All admin fetched`,
      total: allAdmin.length,
      data: allAdmin
    })

  } catch (error) {
    next(error)
  }
};


exports.getOneAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const admin = await adminModel.findById(id).select('-phoneNumber -password -isVerified -isLoggedIn -role')

    if (!admin) {
      return res.status(404).json(`Admin with the ID: ${id} not found`)
    }

    res.status(200).json({
      message: `Admin found`,
      data: admin
    })
    
  } catch (error) {
    next(error)
  }
};


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

    const updatedAdmin = await adminModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    )

    return res.status(200).json({
      message: 'Admin updated successfully',
      data: {
        firstName: updatedAdmin.firstName,
        surname: updatedAdmin.surname,
        email: updatedAdmin.email
      },
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
};


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
};


exports.getAllVenues = async (req, res, next) => {
  try {
    const {id} = req.user;
    const user = await venueOwnerModel.findById(id) || await adminModel.findById(id);
    const venues = await venueModel.find({status: { $in: ['verified', 'pending'] }})

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      message: 'All venues retrieved successfully',
      data: venues,
    })
  } catch (error) {
    next(error)
  }
};