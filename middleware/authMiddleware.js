const jwt = require('jsonwebtoken')
const clientModel = require('../models/clientModel')
const venueOwnerModel = require('../models/venueOwnerModel')
const adminModel = require('../models/adminModel')

exports.authentication = async (req, res, next) => {
  try {
    const auth = req.headers.authorization
    if (!auth) {
      return res.status(404).json({
        message: 'Auth missing',
      })
    }

    const token = auth.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user =
      (await clientModel.findById(decoded.id)) ||
      (await venueOwnerModel.findById(decoded.id)) ||
      (await adminModel.findById(decoded.id))
      
    if (!user) {
      return res.status(404).json({
        message: 'Authentication failed, User not found',
      })
    }

    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(500).json({
        message: ' Session timed out, please login to your account',
      })
    }
    next(error)
  }
}

exports.authorize = async (req, res, next) => {
  try {
    const auth = req.headers.authorization
    if (!auth) {
      return res.status(404).json({
        message: 'Auth missing',
      })
    }

    const token = auth.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user =
      (await clientModel.findById(decoded.id)) ||
      (await venueOwnerModel.findById(decoded.id)) ||
      (await adminModel.findById(decoded.id))
    if (!user) {
      return res.status(404).json({
        message: 'Authorization failed, User not found',
      })
    }
    if (user.role === 'admin') {
      return res.status(404).json({
        message: 'Authorization failed: Contact Admin',
      })
    }

    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(500).json({
        message: ' Session timed out, please login to your account',
      })
    }
    next(error)
  }
}