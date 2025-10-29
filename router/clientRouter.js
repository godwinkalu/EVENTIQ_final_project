const {signUp, fetch, getAclient, updateClient, deleteClient} = require('../controller/clientController')

const router = require('express').Router();
const upload = require('../middleware/multer')

/**
 * @swagger
 * /register-client:
 *   post:
 *     summary: Register a new client
 *     description: Creates a new client account, hashes the password, uploads a default profile image to Cloudinary, generates an OTP, sends a welcome email, and saves client information to the database.
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
 *                 example: Precious
 *                 description: Client's first name
 *               surname:
 *                 type: string
 *                 example: Silver
 *                 description: Client's surname
 *               email:
 *                 type: string
 *                 format: email
 *                 example: precioussilver988@gmail.com
 *                 description: Client's unique email address
 *               password:
 *                 type: string
 *                 format: password
 *                 example: iamstronger12#
 *                 description: Client's account password (will be hashed)
 *     responses:
 *       201:
 *         description: Client created successfully
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
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 652f8f6b45e6b2457d9f1234
 *                     firstName:
 *                       type: string
 *                       example: Precious
 *                     surname:
 *                       type: string
 *                       example: Silver
 *                     phoneNumber:
 *                       type: string
 *                       example: "+2348012345678"
 *                     email:
 *                       type: string
 *                       example: precioussilver988@gmail.com
 *                     otp:
 *                       type: string
 *                       example: "123456"
 *                     otpExpiredat:
 *                       type: string
 *                       example: "2025-10-27T12:30:00.000Z"
 *                     profilePicture:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 *                           example: "https://res.cloudinary.com/demo/image/upload/v1234567/user.png"
 *                         publicId:
 *                           type: string
 *                           example: "user_abc123"
 *       404:
 *         description: Account already exists, log in to your account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account already exists, log in to your account
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
 *                   example: "Something went wrong while creating client"
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
router.get('/clients', fetch);


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
router.get('/client/:id', getAclient);

/**
 * @swagger
 * /clients/{id}:
 *   patch:
 *     summary: Update a client profile
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Client ID
 *         schema:
 *           type: string
 *       - in: formData
 *         name: profilePicture
 *         type: file
 *         description: Upload a new profile picture
 *       - in: formData
 *         name: firstName
 *         type: string
 *       - in: formData
 *         name: surname
 *         type: string
 *       - in: formData
 *         name: phoneNumber
 *         type: string
 *     responses:
 *       200:
 *         description: Client updated successfully
 *       404:
 *         description: Client not found
 */
router.patch('/updateclient/:id',  upload.single('profilePicture'), updateClient);

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

module.exports = router