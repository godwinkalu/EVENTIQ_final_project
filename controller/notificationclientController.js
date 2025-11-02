const notificationclientModel = require('../models/notificationclientModel');
const clientModel = require('../models/clientModel')
const venuebookingModel = require('../models/venuebookingModel')
const jwt = require('jsonwebtoken')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')


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


exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.status(200).json({
      message: 'Notification marked as read',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Notification.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
};
