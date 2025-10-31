const express = require('express');
const { updateBusinessInfo, getMyBusinessInfo, deleteBusinessInfo } = require('../controller/businessinfomationController');
const router = express.Router();
const { authentication } = require('../middleware/authMiddleware')

/**
 * @swagger
 * /business-info:
 *   post:
 *     summary: Create or update venue owner's business information
 *     description: Allows an authenticated venue owner to create or update their business details.
 *     tags: [Business Information]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BusinessInformation'
 *     responses:
 *       201:
 *         description: Business information created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Business information created successfully
 *                 data:
 *                   $ref: '#/components/schemas/BusinessInformation'
 *       200:
 *         description: Business information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Business information updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/BusinessInformation'
 *       400:
 *         description: Bad request or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input data
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied. Token missing or invalid.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong on the server.
 */

router.put('/business-info', authentication, updateBusinessInfo)


/**
 * @swagger
 * /business-info:
 *   get:
 *     summary: Get venue owner's business information
 *     description: Retrieve the authenticated venue owner's business information from the database.
 *     tags: [Business Information]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Business information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Business information retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/BusinessInformation'
 *       404:
 *         description: Business information not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Business information not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied. Token missing or invalid.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong on the server.
 */

router.get('/mybusiness-info',authentication,getMyBusinessInfo )


/**
 * @swagger
 * /business-info:
 *   delete:
 *     summary: Delete venue owner's business information
 *     description: Allows the authenticated venue owner to delete their business information permanently.
 *     tags: [Business Information]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Business information deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Business information deleted successfully
 *       404:
 *         description: Business information not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Business information not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied. Token missing or invalid.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong on the server.
 */

router.delete('/delete',authentication, deleteBusinessInfo)

module.exports = router;

