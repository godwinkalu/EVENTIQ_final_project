const notificationclientModel  = require('../models/notificationclientModel');
const clientModel = require('../models/clientModel')
const venuebookingModel = require('../models/venuebookingModel')
exports.createNotification = async (req, res, next) => {
  try {
    const clientId = req.user.id;
    const client = await clientModel.findById(clientId)
    if (!client) {
      return res.status(404).json({
        message: 'client not found'
      })
    }
    const venuebooking = await venuebookingModel.findOne({clientId:client._id})
    if (!venuebooking) {
      return res.status(404).json({
        message: 'venuebooking not found'
      })
    }

    const newNotification = new notificationclientModel({
      venueId,
      clientId,
      BookingId,
      notificationMsg,
    });

    await newNotification.save();

    return res.status(201).json({
      message: 'Notification created successfully',
      data: newNotification,
    });
  } catch (error) {
    next(error);
  }
};

exports.getClientNotifications = async (req, res, next) => {
  try {
    const clientId = req.user.id;

    const notifications = await Notification.find({ clientId })
      .populate('venueId', 'name location')
      .populate('BookingId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Notifications retrieved successfully',
      data: notifications,
    });
  } catch (error) {
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
