const dashboardModel = require('../models/dashboardModel')
const venueModel = require('../models/venueModel')
const venuebookingModel = require('../models/venuebookingModel')
const venueOwnerModel = require('../models/venueOwnerModel')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const { VenuesOwner } = require('./adminController')


exports.getOverview = async (req, res, next) => {
  try {
    const venueOwner = await venueOwnerModel.findById(req.user.id)

    if (!venueOwner) {
      return res.status(404).json({
        message: 'Venue owner not found',
      })
    }

    const dashboard = await dashboardModel.findOne({ venueOwnerId: venueOwner._id })

    if (!dashboard) {
      return res.status(404).json({
        message: 'No dashboard found',
      })
    }

    const bookings = await venuebookingModel.find({ venueOwnerId: venueOwner._id })
    const venues = await venueModel.find({ venueOwnerId: venueOwner._id })
    const venueBooking = await venuebookingModel.find({venueOwnerId: dashboard.venueOwnerId, paymentstatus: 'paid'})

    Object.assign(dashboard, {
      totalVenues: venues.length,
      activeBooking: bookings.length,
      revenue: venueBooking.reduce((a,c)=> a + c.total, 0)
    })
    await dashboard.save();
    res.status(200).json({
      message: 'User dashboard',
      data: dashboard
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
