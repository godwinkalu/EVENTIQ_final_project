const { createVenueOwner, getAllVenueOwners, getVenueOwner, updatePhoneNumber, deleteVenueOwner, updateProfile } = require("../controller/venueOwnerController");

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
 *               - businessemail
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
 * /update-phoneNumber:
 *   put:
 *     summary: Update venue owner's phone number
 *     tags: [Venue Owner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+2349133063508"
 *     responses:
 *       200:
 *         description: Phone number updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Phone number updated successfully
 *       400:
 *         description: Session expired or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session expired, login to continue
 *       404:
 *         description: Venue owner not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Venue owner not found
 *       500:
 *         description: Internal server error
 */
router.put('/update-phoneNumber', authentication, updatePhoneNumber);


/**
 * @swagger
 * /update-profile:
 *   put:
 *     summary: Update venue owner's profile picture
 *     tags: [Venue Owner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Image file for profile picture
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile picture updated successfully
 *       400:
 *         description: Session expired or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session expired, login to continue
 *       404:
 *         description: Venue owner not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Venue owner not found
 *       500:
 *         description: Internal server error
 */
router.put('/update-profile', authentication, updateProfile);


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

module.exports = router
