const express = require('express');
const {
  getClientNotifications,
  markAsRead,
  deleteNotification
} = require('../controller/notificationclientController');
const { authentication } = require('../middleware/authMiddleware');

const router = express.Router();



/**
 * @swagger
 * /client-notifications:
 *   get:
 *     summary: Get all notifications for the logged-in client
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       404:
 *         description: Notifications not found
 */
router.get('/client-notifications', authentication, getClientNotifications);

module.exports = router;
