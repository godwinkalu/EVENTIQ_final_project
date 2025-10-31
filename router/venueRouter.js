const router = require('express').Router()
const {
  createVenue,
  getAllVenues,
  getOnevenue,
  updateVenue,
  deleteVenue,
  uploadDoc,
} = require('../controller/venueController')
const { authentication } = require('../middleware/authMiddleware')

const upload = require('../middleware/multer')

/**
 * @swagger
 * /list-venue:
 *   post:
 *     summary: Create a new venue listing
 *     description: Allows a verified venue owner to create a new venue with full details such as location, capacity, and amenities.
 *     tags:
 *       - Venue
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - venuename
 *               - description
 *               - capacity
 *               - price
 *               - type
 *               - street
 *               - city
 *               - state
 *             properties:
 *               venuename:
 *                 type: string
 *                 example: "Grand Royale Event Hall"
 *               description:
 *                 type: string
 *                 example: "Spacious hall perfect for weddings, conferences, and parties."
 *               capacity:
 *                 type: number
 *                 example: 500
 *               price:
 *                 type: number
 *                 example: 250000
 *               type:
 *                 type: string
 *                 example: "indoor"
 *               amenities:
 *                 type: string
 *                 example: "Parking Space, Air Conditioning, WiFi"
 *               cautionfee:
 *                 type: number
 *                 example: 50000
 *               openingtime:
 *                 type: string
 *                 example: "08:00 AM"
 *               closingtime:
 *                 type: string
 *                 example: "11:00 PM"
 *               hallsize:
 *                 type: string
 *                 example: "200 sqm"
 *               street:
 *                 type: string
 *                 example: "45 Freedom Street"
 *               city:
 *                 type: string
 *                 example: "Lagos"
 *               state:
 *                 type: string
 *                 example: "Lagos"
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "Upload up to 5 venue images"
 *     responses:
 *       201:
 *         description: Venue uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Venue uploaded successfully"
 *                 data:
 *                   type: object
 *                   example:
 *                     _id: "66a345ffebd9083412d45b21"
 *                     name: "Grand Royale Event Hall"
 *                     capacity: 500
 *                     price: 250000
 *                     location:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                           example: "12 Unity Close"
 *                         city:
 *                           type: string
 *                           example: "Ikeja"
 *                         state:
 *                           type: string
 *                           example: "Lagos"
 *                     image:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           url:
 *                             type: string
 *                             example: "https://res.cloudinary.com/demo/image/upload/v1729342/venue1.jpg"
 *                           publicId:
 *                             type: string
 *                             example: "Event/Venues/abc123xyz"
 *       400:
 *         description: Venue already exists in this city
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Venue already exists in this city"
 *       404:
 *         description: Venue owner not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Venue owner not found, can't create venue"
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
router.post('/list-venue', authentication, createVenue)


/**
 * @swagger
 * /venues/all:
 *   get:
 *     summary: Get all venues
 *     description: Retrieve all venues listed in the platform.
 *     tags: [Venues]
 *     responses:
 *       200:
 *         description: List of all venues retrieved successfully
 */
router.get('/allvenues', getAllVenues)

/**
 * @swagger
 * /venues/getOneVenue/{id}:
 *   get:
 *     summary: Get one venue by ID
 *     description: Retrieve details of a specific venue.
 *     tags: [Venues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The venue ID
 *     responses:
 *       200:
 *         description: Venue retrieved successfully
 *       404:
 *         description: Venue not found
 */

router.get('/getOneVenue/:id', getOnevenue)


router.put('/upload-docs', upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'cac', maxCount: 1 },
  { name: 'doc', maxCount: 1 },
]), uploadDoc)


/**
 * @swagger
 * /venues/updatedvenue/{id}:
 *   put:
 *     summary: Update a venue
 *     description: Allows a venue owner to update their venue details.
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The venue ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: Updated Hall
 *               capacity: 300
 *               price: 200000
 *               amenities: WiFi, Chairs, Parking
 *     responses:
 *       200:
 *         description: Venue updated successfully
 *       404:
 *         description: Venue not found or unauthorized
 */
router.put('/updatedvenue/:id', authentication, upload.array('image', 5), updateVenue)
/**
 * @swagger
 * /venues/deletevenue/{id}:
 *   delete:
 *     summary: Delete a venue
 *     description: Allows a venue owner to delete a venue.
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The venue ID to delete
 *     responses:
 *       200:
 *         description: Venue deleted successfully
 *       404:
 *         description: Venue not found or unauthorized
 */
router.delete('/deletevenue/:id', authentication, deleteVenue)

module.exports = router
