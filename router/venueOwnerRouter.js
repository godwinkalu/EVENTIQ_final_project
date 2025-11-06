const { createVenueOwner, getAllVenueOwners, getVenueOwner, deleteVenueOwner, getAllBookings, getAllListed, paymentHistory } = require("../controller/venueOwnerController");

const { authentication } = require("../middleware/authMiddleware");

const router = require('express').Router();

const upload = require('../middleware/multer')


/**
 * @swagger
 * /venueOwner:
 *   post:
 *     summary: Create a new venue owner
 *     description: Registers a new venue owner. The system checks if the email already exists, hashes the password, generates an OTP, uploads a default profile image to Cloudinary, and sends a verification email via Brevo.
 *     tags:
 *       - Venue Owner
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - surname
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               surname:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *     responses:
 *       201:
 *         description: Venue owner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: venueOwner created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 671b1a0af2d1caa5678ef901
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     surname:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     phoneNumber:
 *                       type: string
 *                       example: "08123456789"
 *                     otp:
 *                       type: string
 *                       example: "123456"
 *                     otpExpiredat:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-29T11:00:00Z
 *                     profilePicture:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 *                           example: https://res.cloudinary.com/yourcloud/image/upload/v12345/default.jpg
 *                         publicId:
 *                           type: string
 *                           example: profile_abc123
 *       404:
 *         description: Account already exists (as client or venue owner)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account already exists, login your account
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/venueOwner', createVenueOwner)

/**
 * @swagger
 * /venueowners:
 *   get:
 *     summary: Get all venue owners
 *     tags: [Venue Owner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all venue owners retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/venueowners', getAllVenueOwners);

/**
 * @swagger
 * /venueowner/{id}:
 *   get:
 *     summary: Get a single venue owner by ID
 *     tags: [Venue Owner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Venue owner ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Venue owner retrieved successfully
 *       404:
 *         description: Venue owner not found
 */
router.get('/venueowner/:id', getVenueOwner);


/**
 * @swagger
 * /venueowners/{id}:
 *   delete:
 *     summary: Delete a venue owner
 *     tags: [Venue Owner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Venue owner ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Venue owner deleted successfully
 *       404:
 *         description: Venue owner not found
 */
router.delete('/delete/:id', deleteVenueOwner);


/**
 * @swagger
 * /allbooking:
 *   get:
 *     summary: Get all confirmed or pending bookings
 *     description: Retrieve all confirmed and pending bookings for a venue owner.
 *     tags: [Venue Owner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Confirmed and pending bookings retrieved successfully
 *       404:
 *         description: Venue owner not found
 */
router.get('/allbooking', authentication, getAllBookings)


/**
 * @swagger
 * /listed-venues:
 *   get:
 *     summary: Retrieve all venues
 *     description: Get a list of all venues with status "verified" or "pending". Accessible to authenticated venue owners and admins.
 *     tags: [Venue Owner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all venues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All venues retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 671db92e6fdcbb9b1b1e7a0f
 *                       name:
 *                         type: string
 *                         example: The Grand Palace Hall
 *                       description:
 *                         type: string
 *                         example: Spacious event hall suitable for weddings and conferences.
 *                       location:
 *                         type: object
 *                         properties:
 *                           street:
 *                             type: string
 *                             example: 24 Victoria Street
 *                           city:
 *                             type: string
 *                             example: Lagos
 *                           state:
 *                             type: string
 *                             example: Lagos
 *                       price:
 *                         type: number
 *                         example: 300000
 *                       capacity:
 *                         type: number
 *                         example: 500
 *                       type:
 *                         type: string
 *                         example: Indoor
 *                       status:
 *                         type: string
 *                         enum: [verified, pending, rejected]
 *                         example: verified
 *                       amenities:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: Air conditioning
 *                       image:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             url:
 *                               type: string
 *                               example: https://res.cloudinary.com/demo/image/upload/v1726759445/Event/Venues/image1.jpg
 *                             publicId:
 *                               type: string
 *                               example: Event/Venues/image1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-16T08:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-16T09:00:00.000Z
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error.
 */
router.get('/listed-venues', authentication, getAllListed)

/**
 * @swagger
 * /historypayment:
 *   get:
 *     summary: Retrieve all payment history for a venue owner
 *     description: >
 *       This endpoint returns a list of all payments related to the venue(s) owned by the authenticated venue owner.
 *       The response includes populated data such as venue name, price, client details, and booking date.
 *     tags:
 *       - Venue Owner
 *     security:
 *       - bearerAuth: []     # JWT token required for authentication
 *     responses:
 *       200:
 *         description: A list of all payment history records for the venue owner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment history retrieved successfully"
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "674ac12f83d92c001f6b5ea3"
 *                       amount:
 *                         type: number
 *                         example: 120000
 *                       reference:
 *                         type: string
 *                         example: "KORA123456ABC"
 *                       paymentStatus:
 *                         type: string
 *                         example: "successful"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-20T10:30:45.123Z"
 *                       venueId:
 *                         type: object
 *                         properties:
 *                           venuename:
 *                             type: string
 *                             example: "Grand Royale Hall"
 *                           price:
 *                             type: number
 *                             example: 50000
 *                       clientId:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                             example: "John"
 *                           surname:
 *                             type: string
 *                             example: "Doe"
 *                       venuebookingId:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             example: "June 12, 2025"
 *       400:
 *         description: Session expired or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session expired, login to continue"
 *       404:
 *         description: Venue owner or payment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "venueowner not found"
 *       500:
 *         description: Internal server error
 */
router.get('/historypayment', authentication, paymentHistory)

module.exports = router
