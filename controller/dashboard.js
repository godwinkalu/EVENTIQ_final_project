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
    const venueBooking = await venuebookingModel.find({venueOwnerId: dashboard.venueOwnerId})

    Object.assign(dashboard, {
      totalVenues: venues.length,
      activeBooking: bookings.length,
      revenue: venueBooking.reduce((a,c)=> a + c.total)
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

// venueSchema.post('save', async function (doc, next) {
//   try {
//     const venues = await venueModel.find({ _id: doc._id })
//     const venueOwner = await venueOwnerModel.findOne({ _id: venues[0].venueOwnerId })
//     const venuebookings = await venuebookingModel.find({ venueId: venues[0]?._id })
//     const dashboard = await dashboardModel.findOne({ venueOwnerId: venueOwner._id })
//     dashboard.totalVenues = venues.length
//     dashboard.activeBooking = venuebookings.length
//     await dashboard.save()
//     next()
//   } catch (error) {
//     console.log(error)
//   }
// })
