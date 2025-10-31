const { getOverview } = require('../controller/dashboard');

const { authentication } = require('../middleware/authMiddleware');

const router = require('express').Router();


/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get venue owner's dashboard overview
 *     tags: [Dashboard Overview]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User dashboard
 *                 data:
 *                   type: object
 *                   example:
 *                     totalVenues: 3
 *                     totalBookings: 12
 *                     totalRevenue: 250000
 *                     thisMonthBookings: 4
 *                     growthRate: "+25%"
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
 *         description: Dashboard not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No dashboard found
 *       500:
 *         description: Internal server error
 */
router.get('/dashboard', authentication, getOverview);

module.exports = router;