const express = require('express');
const {
  createNotification,
  getClientNotifications,
  markAsRead,
  deleteNotification
} = require('../controller/notificationclientController');
const { authentication } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Manage client notifications
 */

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               venueId:
 *                 type: string
 *                 example: 671a8f3d8b8d2b6780a92d9c
 *               BookingId:
 *                 type: string
 *                 example: 671a8f3d8b8d2b6780a92d9e
 *               notificationMsg:
 *                 type: string
 *                 enum: [Booking Confirmed, Booking Reject, Booking Pending, Payment Successful]
 *                 example: Booking Confirmed
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Client or booking not found
 */
router.post('/notification/', authentication, createNotification);

/**
 * @swagger
 * /notifications:
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
router.get('/getclient/', authentication, getClientNotifications);

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
