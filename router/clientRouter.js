const {signUp, getClients, getClient, deleteClient, getAllClientBooking, getAllVerifiedVenues, getAllVerifiedIndoors, getAllVerifiedOutdoor, getAllVerifiedMulti} = require('../controller/clientController');
const { authentication } = require('../middleware/authMiddleware');

const router = require('express').Router();
const upload = require('../middleware/multer')


/**
 * @swagger
 * /register-client:
 *   post:
 *     summary: Register a new client
 *     tags: [Client]
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
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: Client account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Client created successfully
 *                 data:
 *                   type: object
 *                   example:
 *                     _id: 6710e47fdbaab8e3e66e9cf4
 *                     firstName: John
 *                     surname: Doe
 *                     email: johndoe@example.com
 *                     profilePicture:
 *                       url: https://res.cloudinary.com/example/image/upload/v1730211899/default.jpg
 *                       publicId: default_image_id
 *                     otp: "893120"
 *                     otpExpiredat: 1730212012000
 *       400:
 *         description: Invalid input or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *       404:
 *         description: Account already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account already exist as a client, log in to your account
 *       500:
 *         description: Internal server error
 */
router.post('/register-client', signUp);


/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Fetch all clients
 *     description: Retrieves a list of all registered clients from the database, excluding sensitive fields such as password, phone number, OTP, and verification data.
 *     tags: [Client]
 *     responses:
 *       200:
 *         description: Clients fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clients fetched
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 671a32e4a84b9c5a70f9b2c7
 *                       firstName:
 *                         type: string
 *                         example: Precious
 *                       surname:
 *                         type: string
 *                         example: Silver
 *                       email:
 *                         type: string
 *                         example: precioussilver988@gmail.com
 *                       profilePicture:
 *                         type: object
 *                         properties:
 *                           url:
 *                             type: string
 *                             example: "https://res.cloudinary.com/demo/image/upload/v1234567/profile.png"
 *                           publicId:
 *                             type: string
 *                             example: "profile_abc123"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 *                   example: "Operation `clients.findOne()` buffering timed out after 10000ms"
 */
router.get('/clients', getClients);


/**
 * @swagger
 * /client/{id}:
 *   get:
 *     summary: Get a single client by ID
 *     description: Retrieves details of a specific client using their unique MongoDB ID. Excludes sensitive fields such as password, phone number, and verification status.
 *     tags:
 *       - Client
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the client to retrieve
 *         schema:
 *           type: string
 *           example: 670f9e48c2b9d47c84022f15
 *     responses:
 *       200:
 *         description: Client found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Client found
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 670f9e48c2b9d47c84022f15
 *                     firstName:
 *                       type: string
 *                       example: Precious
 *                     surname:
 *                       type: string
 *                       example: Silver
 *                     email:
 *                       type: string
 *                       example: precious@gmail.com
 *       404:
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Client with the ID, 670f9e48c2b9d47c84022f15 not found
 *       500:
 *         description: Internal server error
 */
router.get('/client/:id', getClient);


/**
 * @swagger
 * /client-bookings:
 *   get:
 *     summary: Get all bookings for a client
 *     description: Retrieve all bookings made by the authenticated client, including both confirmed and pending bookings.
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all client bookings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All client bookings
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 671d4caa9e11b79e30f5a1b2
 *                       clientId:
 *                         type: string
 *                         example: 671cbaab2d41e18f3f534ce7
 *                       venueId:
 *                         type: string
 *                         example: 671cbad72d41e18f3f534cf2
 *                       bookingstatus:
 *                         type: string
 *                         enum: [confirmed, pending, cancelled]
 *                         example: confirmed
 *                       eventDate:
 *                         type: string
 *                         format: date
 *                         example: 2025-11-01
 *                       totalAmount:
 *                         type: number
 *                         example: 150000
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-28T14:22:17.000Z
 *       400:
 *         description: Session expired or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session expired, login to continue
 *       404:
 *         description: Client not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Client not found
 *       500:
 *         description: Internal server error.
 */
router.get('/client-bookings', authentication, getAllClientBooking)


/**
 * @swagger
 * /api/v1/clients/{id}:
 *   delete:
 *     summary: Delete a client
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Client ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *       404:
 *         description: Client not found
 */
router.delete('/delete/:id', deleteClient);


/**
 * @swagger
 * /allvenues:
 *   get:
 *     summary: Get all venues
 *     description: Retrieve all venues listed in the platform.
 *     tags: [Client]
 *     responses:
 *       200:
 *         description: List of all venues retrieved successfully
 */
router.get('/allvenues', authentication, getAllVerifiedVenues)


/**
 * @swagger
 * /allvenues-indoor:
 *   get:
 *     summary: Get all venues
 *     description: Retrieve all indoor venues listed in the platform.
 *     tags: [Client]
 *     responses:
 *       200:
 *         description: List of all venues retrieved successfully
 */
router.get('/allvenues-indoor', authentication, getAllVerifiedIndoors)


/**
 * @swagger
 * /allvenues-outdoor:
 *   get:
 *     summary: Get all venues
 *     description: Retrieve all outdoor venues listed in the platform.
 *     tags: [Client]
 *     responses:
 *       200:
 *         description: List of all venues retrieved successfully
 */
router.get('/allvenues-outdoor', authentication, getAllVerifiedOutdoor)


/**
 * @swagger
 * /allvenues-multipurpose:
 *   get:
 *     summary: Get all venues
 *     description: Retrieve all multipurpose venues listed in the platform.
 *     tags: [Client]
 *     responses:
 *       200:
 *         description: List of all venues retrieved successfully
 */
router.get('/allvenues-multipurpose', authentication, getAllVerifiedMulti)

module.exports = router