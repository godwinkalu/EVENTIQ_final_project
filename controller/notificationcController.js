const notificationclientModel = require('../models/notificationclientModel');
const notificationvenueOwnerModel = require('../models/notificationvenueOwnerModel');
const venueOwnerModel = require('../models/venueOwnerModel');
const clientModel = require('../models/clientModel')
const jwt = require('jsonwebtoken')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime');


exports.getClientNotifications = async (req, res, next) => {
  try {
    const { id } = req.user;
    const client = await clientModel.findById(id);

    if (!client) {
      return res.status(404).json({
        message: 'Client not found'
      })
    }

    const notifications = await notificationclientModel.find({ clientId: client._id }).sort({ createdAt: -1 });
    dayjs.extend(relativeTime)
    notifications.forEach((e) => {
      e.time = dayjs(e.createdAt).fromNow()
    })
  
    return res.status(200).json({
      message: 'Notifications retrieved successfully',
      data: notifications,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue'
      })
    }
    next(error);
  }
};


exports.getVenueownerNotifications = async (req, res, next) => {
  try {
    const { id } = req.user;    
    const venueOwner = await venueOwnerModel.findById(id);
    
    if (!venueOwner) {
      return res.status(404).json({
        message: 'Venue owner not found'
      })
    }

    const notifications = await notificationvenueOwnerModel.find({ venueId: venueOwner._id }).sort({ createdAt: -1 });
    dayjs.extend(relativeTime)
    notifications.forEach((e) => {
      e.time = dayjs(e.createdAt).fromNow()
    })
  
    return res.status(200).json({
      message: 'Notifications retrieved successfully',
      data: notifications,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue'
      })
    }
    next(error);
  }
};