const { getInvoice, getOneInvoice } = require('../controller/invoiceController')
const { authentication } = require('../middleware/authMiddleware')

const router = require('express').Router()


/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Retrieve all invoices for the authenticated client
 *     description: >
 *       This endpoint returns all invoices associated with the authenticated client.
 *       The user must be logged in and provide a valid Bearer token in the Authorization header.
 *     tags:
 *       - Invoices
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Invoices retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invoice generated successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "674bcf9d9b1d2a00124f8e56"
 *                       clientId:
 *                         type: string
 *                         example: "674bcd8a9b1d2a00124f8e12"
 *                       bookingId:
 *                         type: string
 *                         example: "674bcdb39b1d2a00124f8e34"
 *                       amount:
 *                         type: number
 *                         example: 50000
 *                       status:
 *                         type: string
 *                         example: "paid"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-08T10:23:45.123Z"
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Auth missing or invalid"
 *       404:
 *         description: Client not found or no invoices available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Client not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/invoices', authentication, getInvoice);

/**
 * @swagger
 * /invoice/{invoiceId}:
 *   get:
 *     summary: Retrieve a single invoice by ID
 *     description: Fetches detailed information about a specific invoice, including related client, venue, and booking data.
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         description: The unique ID of the invoice to retrieve
 *         schema:
 *           type: string
 *           example: 6743a8c56e2bdf7c3d1b0b21
 *     responses:
 *       200:
 *         description: Invoice data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: invoice Data
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6743a8c56e2bdf7c3d1b0b21
 *                     clientId:
 *                       type: object
 *                       description: Details of the client who made the booking
 *                     venueId:
 *                       type: object
 *                       description: Details of the venue associated with the invoice
 *                     venuebookingId:
 *                       type: object
 *                       description: Details of the booking associated with the invoice
 *                     totalAmount:
 *                       type: number
 *                       example: 150000
 *                     status:
 *                       type: string
 *                       example: paid
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-11-12T10:23:45.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-11-12T11:00:00.000Z
 *       404:
 *         description: Invoice not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invoice Not Found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/invoice/:invoiceId', getOneInvoice);


module.exports = router