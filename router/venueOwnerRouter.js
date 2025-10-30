const { createVenueOwner, getAllVenueOwners, getVenueOwner, updateVenueOwner, deleteVenueOwner } = require("../controller/venueOwnerController")

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
router.get('/venueowners',  getAllVenueOwners);

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
router.get('/venueowner/:id',  getVenueOwner);

/**
 * @swagger
 * /venueowners/{id}:
 *   patch:
 *     summary: Update a venue owner
 *     tags: [Venue Owner]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Venue owner ID
 *         schema:
 *           type: string
 *       - in: formData
 *         name: profilePicture
 *         type: file
 *         description: Upload new profile picture
 *       - in: formData
 *         name: firstName
 *         type: string
 *       - in: formData
 *         name: surname
 *         type: string
 *       - in: formData
 *         name: businessName
 *         type: string
 *       - in: formData
 *         name: phoneNumber
 *         type: string
 *     responses:
 *       200:
 *         description: Venue owner updated successfully
 *       404:
 *         description: Venue owner not found
 */
router.put('/updateVenue/:id', upload.single('profilePicture'), updateVenueOwner);

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
router.delete('/delete/:id',  deleteVenueOwner);
module.exports = router
