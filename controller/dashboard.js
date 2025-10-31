const dashboardModel = require('../models/dashboardModel');
const jwt = require('jsonwebtoken');


exports.getOverview = async (req, res, next) => {
  try {
    const {id}= req.user;
    const dashboard = await dashboardModel.findOne({venueOwnerId: id});

    if (!dashboard) {
      return res.status(404).json({
        message: 'No dashboard found'
      })
    }

    res.status(200).json({
      message: 'User dashboard',
      data: dashboard
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue'
      })
    }
    next(error)
  }
}