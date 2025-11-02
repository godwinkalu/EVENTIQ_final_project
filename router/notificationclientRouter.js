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

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark a specific notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Notification ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */
router.patch('/markeasread/:id/read', authentication, markAsRead);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a specific notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Notification ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 */
router.delete('/delete/:id', authentication, deleteNotification);

module.exports = router;
