const dashboardModel = require('../models/dashboardModel')
const venueModel = require('../models/venueModel')
const venuebookingModel = require('../models/venuebookingModel')
const venueOwnerModel = require('../models/venueOwnerModel')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const { VenuesOwner } = require('./adminController')
const { login } = require('./general')

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
    const venueBooking = await venuebookingModel.find({
      venueOwnerId: dashboard.venueOwnerId,
      paymentstatus: 'paid',
    })

    const today = new Date()
    const passedBookingdate = bookings.filter((e) => {
      const booking = new Date(e.dateChecker)
      return booking < today
    })

    let total = [];
    passedBookingdate.forEach((e) => {
    const venue = venues.find((p) => {
        p._id === e.venueId
        total.push(p)
      })
    })

    Object.assign(dashboard, {
      totalVenues: venues.length ?? 0,
      activeBooking: bookings.length ?? 0,
      revenue: venues.reduce((a, c) => a + c.availableBalance, 0) ?? 0,
      availableBalance: total.reduce((a, c) => a + c.availableBalance, 0) ?? 0
    })
    await dashboard.save()
    res.status(200).json({
      message: 'User dashboard',
      data: dashboard,
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
