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
 *       - Client
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
 *               eventType:
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
 * /acceptbooking/{bookingId}:
 *   get:
 *     summary: Accept a venue booking request
 *     description: Allows a venue owner to accept a booking request made by a client. Once accepted, the booking status is updated to "confirmed" and a confirmation email is sent to the client.
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         description: The ID of the booking to be accepted.
 *         schema:
 *           type: string
 *           example: 6701cda8bf2b4d31e4ef56a2
 *     responses:
 *       200:
 *         description: Booking accepted successfully and client notified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booking accepted successfully, confirmation email sent to client.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6701cda8bf2b4d31e4ef56a2
 *                     bookingstatus:
 *                       type: string
 *                       example: confirmed
 *                     clientId:
 *                       type: string
 *                       example: 6701bda4cf3a812a334aa891
 *                     venueId:
 *                       type: string
 *                       example: 6701ada5ef3a112a304aa233
 *       400:
 *         description: Session expired or invalid request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session expired, login to continue.
 *       404:
 *         description: Venue, client, or booking not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Venue not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get('/acceptbooking/:bookingId', authentication, acceptedBooking)

/**
 * @swagger
 * /rejectbooking/{bookingId}:
 *   get:
 *     summary: Reject a venue booking request
 *     description: Allows a venue owner to reject a client's booking request and notify the client via email and in-app notification.
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         description: The ID of the booking to reject.
 *         schema:
 *           type: string
 *           example: 6701cda8bf2b4d31e4ef56a2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for rejecting the booking.
 *                 example: The venue is not available on the selected date.
 *     responses:
 *       200:
 *         description: Booking rejected successfully and client notified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booking rejected successfully, notification sent to client.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6701cda8bf2b4d31e4ef56a2
 *                     bookingstatus:
 *                       type: string
 *                       example: rejected
 *                     clientId:
 *                       type: string
 *                       example: 6701bda4cf3a812a334aa891
 *                     venueId:
 *                       type: string
 *                       example: 6701ada5ef3a112a304aa233
 *       400:
 *         description: Session expired or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session expired, login to continue.
 *       404:
 *         description: Venue owner, booking, or client not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Venue not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get('/rejectbooking/:bookingId', authentication, rejectedBooking)

module.exports = router 