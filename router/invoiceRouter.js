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
 * /invoice/{invoiceId:
 *   get:
 *     summary: Retrieve a single invoice by ID
 *     description: >
 *       This endpoint retrieves a specific invoice belonging to the authenticated client using the invoice ID.
 *       A valid Bearer token must be provided in the Authorization header.
 *     tags:
 *       - Invoices
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the invoice to retrieve.
 *         schema:
 *           type: string
 *           example: "674bcd8a9b1d2a00124f8e12"
 *     responses:
 *       200:
 *         description: Invoice retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invoice Data"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "674bcf9d9b1d2a00124f8e56"
 *                     clientId:
 *                       type: string
 *                       example: "674bcd8a9b1d2a00124f8e12"
 *                     bookingId:
 *                       type: string
 *                       example: "674bcdb39b1d2a00124f8e34"
 *                     amount:
 *                       type: number
 *                       example: 50000
 *                     status:
 *                       type: string
 *                       example: "paid"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-08T10:23:45.123Z"
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
 *         description: Invoice or client not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invoice Not Found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/invoice/:invoiceId', authentication, getOneInvoice);


module.exports = router