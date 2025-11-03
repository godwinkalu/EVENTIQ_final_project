const express = require('express');
const { createBusinessInfo, getMyBusinessInfo, deleteBusinessInfo } = require('../controller/businessinfomationController');
const router = express.Router();
const { authentication } = require('../middleware/authMiddleware')


/**
 * @swagger
 * /create-business-info:
 *   post:
 *     summary: Create venue owner's business information
 *     description: Allows an authenticated venue owner to create their business information. This includes business name, phone number, address, RC number, and location details.
 *     tags:
 *       - Venue Owner
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessname
 *               - businessphonenumber
 *               - address
 *               - rcnumber
 *               - state
 *               - lga
 *             properties:
 *               businessname:
 *                 type: string
 *                 example: "Eventiq Spaces Ltd"
 *               businessphonenumber:
 *                 type: string
 *                 example: "+2348012345678"
 *               address:
 *                 type: string
 *                 example: "42 Allen Avenue, Ikeja"
 *               rcnumber:
 *                 type: string
 *                 example: "RC1234567"
 *               state:
 *                 type: string
 *                 example: "Lagos"
 *               lga:
 *                 type: string
 *                 example: "Ikeja"
 *     responses:
 *       200:
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
 *                   type: object
 *                   properties:
 *                     venueOwnerId:
 *                       type: string
 *                       example: "6523fe1b45e0cd1234ab5678"
 *                     businessname:
 *                       type: string
 *                       example: "Eventiq Spaces Ltd"
 *                     businessphonenumber:
 *                       type: string
 *                       example: "+2348012345678"
 *                     rcnumber:
 *                       type: string
 *                       example: "RC1234567"
 *                     location:
 *                       type: object
 *                       properties:
 *                         state:
 *                           type: string
 *                           example: "Lagos"
 *                         lga:
 *                           type: string
 *                           example: "Ikeja"
 *                         address:
 *                           type: string
 *                           example: "42 Allen Avenue, Ikeja"
 *       400:
 *         description: Business info already exists or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Business info created already
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
// router.post('/create-business-info', authentication, createBusinessInfo)


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

router.get('/mybusiness-info', authentication, getMyBusinessInfo)


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

router.delete('/delete', authentication, deleteBusinessInfo)

module.exports = router;

