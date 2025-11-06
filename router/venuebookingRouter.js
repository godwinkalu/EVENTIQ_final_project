const express = require('express')
const {
  createvenuebooking,
  acceptedBooking,
  rejectedBooking,
} = require('../controller/venuebookingcontroller')
const { authentication } = require('../middleware/authMiddleware')
const router = express.Router()

/**
 * @swagger
 * /booking/{venueId}:
 *   post:
 *     summary: Create a new venue booking
 *     description: Allows a client to book a specific venue by providing the event date, duration, and event type.
 *     tags:
 *       - [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the venue to be booked.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - days
 *               - eventType
 *             properties:
 *               date:
 *                 type: string
 *                 example: "12/06/2025"
 *                 description: The date of the event (format DD/MM/YYYY).
 *               days:
 *                 type: number
 *                 example: 2
 *                 description: The number of days the venue is booked for.
 *               eventtype:
 *                 type: string
 *                 example: "Wedding"
 *                 description: The type of event being hosted.
 *     responses:
 *       201:
 *         description: Venue booked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Venue booked successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "672f89a12d93af001fcbcc12"
 *                     venueId:
 *                       type: string
 *                       example: "672e1c121e5a23001fbcdd34"
 *                     clientId:
 *                       type: string
 *                       example: "672d7a8b43f672001eacdd09"
 *                     venueOwnerId:
 *                       type: string
 *                       example: "672e7a2e56b7cd001fcdcc80"
 *                     date:
 *                       type: string
 *                       example: "June 12, 2025"
 *                     totalamount:
 *                       type: number
 *                       example: 55000
 *                     servicecharge:
 *                       type: number
 *                       example: 5000
 *                     eventType:
 *                       type: string
 *                       example: "Wedding"
 *       400:
 *         description: Invalid input or user not authorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Only client can book for venue
 *       404:
 *         description: Venue, client, or owner not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Venue not found
 */
router.post('/booking/:venueId', authentication, createvenuebooking)


/**
 * @swagger
 * /accepectbooking/{bookingId}:
 *   post:
 *     summary: Accept a booking and notify the client
 *     description: Sends a confirmation email to the client when their booking is accepted.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the client whose booking is being accepted
 *     responses:
 *       200:
 *         description: Booking accepted and client notified
 *       404:
 *         description: Venue owner or client not found
 */

router.get('/accepectbooking/:bookingId', authentication, acceptedBooking)

/**
 * @swagger
 * /rejectbooking{bookingId}:
 *   post:
 *     summary: Reject a booking and notify the client
 *     description: Sends an email to the client when their booking is rejected, including a reason.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the client whose booking is being rejected
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 example: The venue is already booked for that date.
 *     responses:
 *       200:
 *         description: Booking rejected and client notified
 *       400:
 *         description: Reason is missing
 *       404:
 *         description: Venue owner or client not found
 */

router.get('/rejectbooking/:bookingId', authentication, rejectedBooking)

module.exports = router 