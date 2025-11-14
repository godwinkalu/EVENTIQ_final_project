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
 *     summary: Get a single invoice by ID
 *     description: Retrieve full invoice details including client and venue information.
 *     tags:
 *       - Invoice
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the invoice to retrieve
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
 *                   $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Invalid invoice ID
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal server error
 */
router.get('/invoice/:invoiceId', getOneInvoice);

module.exports = router