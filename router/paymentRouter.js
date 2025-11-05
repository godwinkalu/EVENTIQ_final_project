const { createFeatures, getAllFeatures, initializeFeaturePayment, verifyPayment, initializeBookingPayment } = require('../controller/paymentController');
const { authentication } = require('../middleware/authMiddleware');

const router = require('express').Router();

router.post('/create-feature', createFeatures);

/**
 * @swagger
 * /features:
 *   get:
 *     summary: Get all venue features
 *     description: Retrieve a list of all available venue features. This endpoint requires authentication and returns all features stored in the database.
 *     tags:
 *       - Features
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All features listed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All features listed below
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6711e023c3b2a42e6a912f12
 *                       name:
 *                         type: string
 *                         example: Free Wi-Fi
 *                       icon:
 *                         type: string
 *                         example: wifi-icon.svg
 *                       description:
 *                         type: string
 *                         example: High-speed Wi-Fi available across all halls.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-15T12:34:56.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-15T12:34:56.000Z
 *       400:
 *         description: Invalid or expired token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session expired, Please login to continue
 *       404:
 *         description: Venue owner not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Venue Owner not found
 *       500:
 *         description: Server error while fetching features.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/features', authentication, getAllFeatures);


/**
 * @swagger
 * /feature-payment/{featureId}:
 *   get:
 *     summary: Subscribe to a specific feature
 *     description: Initialize a payment for a feature subscription using Korapay. The endpoint requires authentication and the feature ID to process the payment.
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: featureId
 *         required: true
 *         description: The ID of the feature to subscribe to.
 *         schema:
 *           type: string
 *           example: 6711e023c3b2a42e6a912f12
 *     responses:
 *       200:
 *         description: Payment initialized successfully with Korapay.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Payment initialized successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: A1B2C3D4E5F6
 *                     amount:
 *                       type: number
 *                       example: 5000
 *                     currency:
 *                       type: string
 *                       example: NGN
 *                     customer:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: string
 *                           example: johndoe@gmail.com
 *                         name:
 *                           type: string
 *                           example: John
 *       400:
 *         description: Invalid or expired token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session expired, Please login to continue
 *       404:
 *         description: Venue owner or feature not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Feature not found
 *       500:
 *         description: Server error during subscription initialization.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/feature-payment/:featureId', authentication, initializeFeaturePayment);

/**
 * @swagger
 * /booking-payment/{clientId}:
 *   get:
 *     summary: Initialize booking payment
 *     description: Initializes a payment for a venue booking using KoraPay. The client must already have a booking before payment can be initialized.
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clientId
 *         in: path
 *         required: true
 *         description: ID of the client making the payment
 *         schema:
 *           type: string
 *           example: 67210f302f89c93be021d9fa
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment initialized
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: 7R2J4K6D9Q2W
 *                     status:
 *                       type: string
 *                       example: pending
 *                     payment_url:
 *                       type: string
 *                       example: https://pay.korapay.com/pay/7R2J4K6D9Q2W
 *       404:
 *         description: Client, booking, or venue not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No booking found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/booking-payment/:clientId', initializeBookingPayment)


router.get('/verify', verifyPayment)

module.exports = router;