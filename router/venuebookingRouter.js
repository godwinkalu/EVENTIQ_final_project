const express = require('express')
const {
  getMyBookings,
  getAllPendingBookings,
  createvenuebooking,
  getAllConfirmedBookings,
  acceptedBooking,
  rejectedBooking,
} = require('../controller/venuebookingcontroller')
const { authentication } = require('../middleware/authMiddleware')
const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: API endpoints for venue bookings and booking management
 */

/**
 * @swagger
 * /booking/{venueId}:
 *   post:
 *     summary: Create a new venue booking
 *     description: Allows a client to create a booking for a selected venue.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the venue being booked
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - numberofguests
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-11-05
 *               numberofguests:
 *                 type: integer
 *                 example: 120
 *     responses:
 *       201:
 *         description: Venue booked successfully
 *       400:
 *         description: Venue already booked or invalid request
 *       404:
 *         description: Venue or client not found
 */
router.post('/booking/:venueId', authentication, createvenuebooking)

/**
 * @swagger
 * /mybooking:
 *   get:
 *     summary: Get client’s bookings
 *     description: Retrieve all bookings made by the logged-in client.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of client bookings retrieved successfully
 *       404:
 *         description: Client not found
 */
router.get('/mybooking', authentication, getMyBookings)

/**
 * @swagger
 * /pendingbooking:
 *   get:
 *     summary: Get all pending bookings
 *     description: Retrieve all pending bookings for a venue owner.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending bookings retrieved successfully
 *       404:
 *         description: Venue owner not found
 */
router.get('/pendingbooking', authentication, getAllPendingBookings)
/**
 * @swagger
 * /confirmedbooking:
 *   get:
 *     summary: Get all confirmed or pending bookings
 *     description: Retrieve all confirmed and pending bookings for a venue owner.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Confirmed and pending bookings retrieved successfully
 *       404:
 *         description: Venue owner not found
 */
router.get('/confirmedbooking', authentication, getAllConfirmedBookings)

/**
 * @swagger
 * /accept/{clientId}:
 *   post:
 *     summary: Accept a booking and notify the client
 *     description: Sends a confirmation email to the client when their booking is accepted.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
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

router.get('/accepectbooking', authentication, acceptedBooking)

/**
 * @swagger
 * /reject/{clientId}:
 *   post:
 *     summary: Reject a booking and notify the client
 *     description: Sends an email to the client when their booking is rejected, including a reason.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
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

router.get('/rejectbooking', authentication, rejectedBooking)

module.exports = router
