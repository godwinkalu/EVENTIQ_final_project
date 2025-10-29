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
 * tags:
 *   name: Venues
 *   description: API endpoints for managing event venues
 */

/**
 * @swagger
 * /list-venue:
 *   post:
 *     summary: Create a new venue
 *     description: Allows a verified venue owner to list a new venue with images.
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
 *               - name
 *               - description
 *               - capacity
 *               - price
 *               - type
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               capacity:
 *                 type: number
 *               price:
 *                 type: number
 *               type:
 *                 type: string
 *               amenities:
 *                 type: string
 *                 example: Wifi, Parking, Chairs
 *               cautionfee:
 *                 type: number
 *               openhours:
 *                 type: string
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Venue uploaded successfully
 *       400:
 *         description: Invalid input or missing images
 *       404:
 *         description: Venue owner not found
 */

router.post('/list-venue', authentication, upload.array('image', 5), createVenue)

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
