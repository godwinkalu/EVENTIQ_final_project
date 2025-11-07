const express = require('express')
const {
  createvenuebooking,
  acceptedBooking,
  rejectedBooking,
} = require('../controller/venuebookingcontroller')
const { authentication } = require('../middleware/authMiddleware')
const { getOneBooking } = require('../controller/venueOwnerController')
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
 *     summary: Accept a venue booking
 *     description: Allows a venue owner to confirm a client's booking. Once confirmed, an email is sent to the client with a payment link.
 *     tags:
 *       - Venue Owner
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         description: The unique ID of the booking to be accepted.
 *         schema:
 *           type: string
 *           example: 6532e9c94c1234567890abcd
 *     responses:
 *       200:
 *         description: Booking accepted successfully, and a confirmation email is sent to the client.
 *         content:
 *           application/json:
 *             example:
 *               message: Booking confirmed successfully. A confirmation email has been sent to the client.
 *       400:
 *         description: Invalid or expired session token.
 *         content:
 *           application/json:
 *             example:
 *               message: Session expired, login to continue
 *       404:
 *         description: Venue owner, booking, client, or venue not found.
 *         content:
 *           application/json:
 *             examples:
 *               VenueOwnerNotFound:
 *                 summary: Venue owner not found
 *                 value:
 *                   message: venue owner not found
 *               BookingNotFound:
 *                 summary: Booking not found
 *                 value:
 *                   message: Venue not booked
 *               ClientNotFound:
 *                 summary: Client not found
 *                 value:
 *                   message: Client not found
 *               VenueNotFound:
 *                 summary: Venue not found
 *                 value:
 *                   message: venue not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               message: Something went wrong
 */
router.get('/acceptbooking/:bookingId', authentication, acceptedBooking)


/**
 * @swagger
 * /rejectbooking/{bookingId}:
 *   post:
 *     summary: Reject a venue booking
 *     description: Allows a venue owner to reject a client's booking and notifies the client via email and in-app notification with the reason for rejection.
 *     tags:
 *       - Venue Owner
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         description: The unique ID of the booking to be rejected.
 *         schema:
 *           type: string
 *           example: 6532e9c94c1234567890abcd
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: The reason why the booking was rejected.
 *                 example: The venue is not available on the selected date.
 *     responses:
 *       200:
 *         description: Booking rejected successfully, and client notified via email and in-app notification.
 *         content:
 *           application/json:
 *             example:
 *               message: Booking has been rejected
 *       400:
 *         description: Invalid or expired session token.
 *         content:
 *           application/json:
 *             example:
 *               message: Session expired, login to continue
 *       404:
 *         description: Venue owner, booking, client, or venue not found.
 *         content:
 *           application/json:
 *             examples:
 *               VenueOwnerNotFound:
 *                 summary: Venue owner not found
 *                 value:
 *                   message: venue owner not found
 *               BookingNotFound:
 *                 summary: Booking not found
 *                 value:
 *                   message: Venue not booked
 *               ClientNotFound:
 *                 summary: Client not found
 *                 value:
 *                   message: Client not found
 *               VenueNotFound:
 *                 summary: Venue not found
 *                 value:
 *                   message: venue not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               message: Something went wrong
 */
router.post('/rejectbooking/:bookingId', authentication, rejectedBooking)

/**
 * @swagger
 * /booking/{venuebookingId}:
 *   get:
 *     summary: Get details of a specific booking
 *     description: Allows a venue owner to retrieve detailed information about a specific venue booking, including event type, date, client, and venue details.
 *     tags:
 *       - Venue Owner
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: venuebookingId
 *         required: true
 *         description: The unique ID of the booking to retrieve.
 *         schema:
 *           type: string
 *           example: 6532e9c94c1234567890abcd
 *     responses:
 *       200:
 *         description: Booking retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: Booking retrieved successfully
 *               data:
 *                 _id: 6532e9c94c1234567890abcd
 *                 date: "2025-12-15T00:00:00.000Z"
 *                 eventType: "Wedding Reception"
 *                 venueId:
 *                   _id: 652e8b7f4c1234567890abcd
 *                   venuename: "The Grand Hall"
 *                   price: 200000
 *                 clientId:
 *                   _id: 651d9a3b4a234567890bcdef
 *                   firstName: "John"
 *                   surname: "Doe"
 *       400:
 *         description: Invalid or expired session token.
 *         content:
 *           application/json:
 *             example:
 *               message: Session expired, login to continue
 *       404:
 *         description: Venue owner or booking not found.
 *         content:
 *           application/json:
 *             examples:
 *               VenueOwnerNotFound:
 *                 summary: Venue owner not found
 *                 value:
 *                   message: Venue owner not found
 *               BookingNotFound:
 *                 summary: No booking found
 *                 value:
 *                   message: No booking found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               message: Something went wrong
 */
router.get('/booking/:venuebookingId', authentication, getOneBooking)

module.exports = router 