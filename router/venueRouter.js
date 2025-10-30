const router = require('express').Router()
const {
  createVenue,
  uploadCac,
  uploadDocument,
  getAllVenues,
  getOnevenue,
  updateVenue,
  deleteVenue,
} = require('../controller/venueController')
const { authentication } = require('../middleware/authMiddleware')

const upload = require('../middleware/multer')


/**
 * @swagger
 * /list-venue:
 *   post:
 *     summary: Create a new venue listing
 *     description: This endpoint allows an authenticated venue owner to upload venue details with one or more images.
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []   # Requires JWT authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - capacity
 *               - price
 *               - type
 *               - cautionfee
 *               - openhours
 *               - street
 *               - city
 *               - state
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: "The Grand Event Center"
 *               description:
 *                 type: string
 *                 example: "Spacious event center with AC, parking, and stage facilities."
 *               capacity:
 *                 type: integer
 *                 example: 300
 *               price:
 *                 type: number
 *                 example: 150000
 *               type:
 *                 type: string
 *                 example: "Indoor"
 *               cautionfee:
 *                 type: number
 *                 example: 25000
 *               openhours:
 *                 type: string
 *                 example: "08:00 AM - 10:00 PM"
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Air Conditioning", "Parking", "WiFi"]
 *               street:
 *                 type: string
 *                 example: "12 Unity Close"
 *               city:
 *                 type: string
 *                 example: "Ikeja"
 *               state:
 *                 type: string
 *                 example: "Lagos"
 *     responses:
 *       201:
 *         description: Venue created successfully
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
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67203016a93b8b86d94e2321"
 *                     name:
 *                       type: string
 *                       example: "The Grand Event Center"
 *                     description:
 *                       type: string
 *                       example: "Spacious event center with AC, parking, and stage facilities."
 *                     price:
 *                       type: number
 *                       example: 150000
 *                     capacity:
 *                       type: integer
 *                       example: 300
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
 *       400:
 *         description: Invalid request or duplicate venue
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
 *         description: Server error while creating venue
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
 * /venues/uploadCAC:
 *   post:
 *     summary: Upload CAC document for a venue
 *     description: Allows a venue owner to upload their CAC certificate.
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cac
 *             properties:
 *               cac:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: CAC uploaded successfully
 *       404:
 *         description: Venue or venue owner not found
 */

router.post('/uploadCAC', authentication, upload.single('cac'), uploadCac)

/**
 * @swagger
 * /venues/upload:
 *   post:
 *     summary: Upload legal document for a venue
 *     description: Allows a venue owner to upload additional legal documents (like ownership proof).
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       404:
 *         description: Venue or venue owner not found
 */
router.post('/upload', authentication, upload.single('document'), uploadDocument)

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
