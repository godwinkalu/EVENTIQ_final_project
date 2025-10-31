const { registerBank, getBankDetail, updateBank } = require('../controller/bankDetails');
const { authentication } = require('../middleware/authMiddleware');

const router = require('express').Router();


/**
 * @swagger
 * /register-bank:
 *   post:
 *     summary: Register a venue owner's bank details
 *     description: Allows a verified venue owner to register their bank account details. The account name must match the registered venue owner's name.
 *     tags:
 *       - Bank Details
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bankName
 *               - accountNumber
 *               - accountType
 *               - accountName
 *             properties:
 *               bankName:
 *                 type: string
 *                 example: Access Bank
 *               accountNumber:
 *                 type: string
 *                 example: "0123456789"
 *               accountType:
 *                 type: string
 *                 enum: [Savings, Current]
 *                 example: Savings
 *               accountName:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: Bank details registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bank details registered successfully
 *       400:
 *         description: Invalid input or account name mismatch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account name must match registered venue owner name
 *       401:
 *         description: Unauthorized or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
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
router.post('/register-bank', authentication, registerBank);


/**
 * @swagger
 * /bank-detail:
 *   get:
 *     summary: Retrieve registered bank details
 *     description: Fetches the registered bank details of the authenticated venue owner.
 *     tags:
 *       - Bank Details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bank details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bank details below"
 *                 data:
 *                   type: object
 *                   example:
 *                     _id: "66a367a8ebd9012345cd782a"
 *                     venueOwnerId: "66a35efdebd9098723cd2345"
 *                     bankName: "ACCESS BANK"
 *                     accountName: "John Doe"
 *                     accountNumber: "0123456789"
 *                     accountType: "Savings"
 *                     createdAt: "2025-10-15T10:45:23.000Z"
 *                     updatedAt: "2025-10-15T10:45:23.000Z"
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
 *         description: Venue owner or bank details not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               oneOf:
 *                 - properties:
 *                     message:
 *                       type: string
 *                       example: "Venue owner not found"
 *                 - properties:
 *                     message:
 *                       type: string
 *                       example: "Bank not registered"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/bank-detail', authentication, getBankDetail);


/**
 * @swagger
 * /update-bank:
 *   put:
 *     summary: Update registered bank details
 *     description: Allows an authenticated venue owner to update their registered bank information.
 *     tags:
 *       - Bank Details
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bankName
 *               - accountName
 *               - accountNumber
 *               - accountType
 *             properties:
 *               bankName:
 *                 type: string
 *                 example: "ACCESS BANK"
 *               accountName:
 *                 type: string
 *                 example: "John Doe"
 *               accountNumber:
 *                 type: string
 *                 example: "0123456789"
 *               accountType:
 *                 type: string
 *                 example: "Savings"
 *     responses:
 *       200:
 *         description: Bank details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bank details updated successfully"
 *       400:
 *         description: Account name mismatch or invalid session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               oneOf:
 *                 - properties:
 *                     message:
 *                       type: string
 *                       example: "Account name must match registered venue owner name"
 *                 - properties:
 *                     message:
 *                       type: string
 *                       example: "Session expire, login to continue"
 *       404:
 *         description: Venue owner or bank info not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               oneOf:
 *                 - properties:
 *                     message:
 *                       type: string
 *                       example: "Venue owner not found"
 *                 - properties:
 *                     message:
 *                       type: string
 *                       example: "No bank info found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.put('/update-bank', authentication, updateBank);

module.exports = router;