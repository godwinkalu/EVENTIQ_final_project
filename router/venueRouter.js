const router = require('express').Router()
const {
  createVenue,
  getOnevenue,
  updateVenue,
  deleteVenue
} = require('../controller/venueController')
const { authentication } = require('../middleware/authMiddleware')

const upload = require('../middleware/multer')


/**
 * @swagger
 * /list-venue:
 *   post:
 *     summary: Create and upload a new venue
 *     description: Allows an authenticated venue owner to upload venue details along with required documents and images.
 *     tags:
 *       - Venue
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - venuename
 *               - description
 *               - minimum
 *               - maximum
 *               - price
 *               - type
 *               - amenities
 *               - cautionfee
 *               - openingtime
 *               - closingtime
 *               - hallsize
 *               - street
 *               - city
 *               - state
 *               - images
 *               - cac
 *               - doc
 *             properties:
 *               venuename:
 *                 type: string
 *                 example: "The Grand Palace Hall"
 *               description:
 *                 type: string
 *                 example: "A spacious event hall suitable for weddings and conferences."
 *               minimum:
 *                 type: integer
 *                 example: 200
 *               maximum:
 *                 type: integer
 *                 example: 500
 *               price:
 *                 type: number
 *                 example: 250000
 *               type:
 *                 type: string
 *                 example: "Indoor"
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: [string]
 *                 example: ["Air Conditioning", "Parking Space", "Sound System"]
 *               cautionfee:
 *                 type: number
 *                 example: 50000
 *               openingtime:
 *                 type: string
 *                 example: "08:00"
 *               closingtime:
 *                 type: string
 *                 example: "23:00"
 *               hallsize:
 *                 type: string
 *                 example: "1000 sqm"
 *               street:
 *                 type: string
 *                 example: "15 Admiralty Way"
 *               city:
 *                 type: string
 *                 example: "Lekki"
 *               state:
 *                 type: string
 *                 example: "Lagos"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 5 venue images
 *               cac:
 *                 type: string
 *                 format: binary
 *                 description: Upload CAC document (PDF or image)
 *               doc:
 *                 type: string
 *                 format: binary
 *                 description: Upload additional document (PDF or image)
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
 *                   example: Venue uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     venuename:
 *                       type: string
 *                       example: "The Grand Palace Hall"
 *                     description:
 *                       type: string
 *                       example: "A spacious event hall suitable for weddings and conferences."
 *                     location:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                           example: "15 Admiralty Way"
 *                         city:
 *                           type: string
 *                           example: "Lekki"
 *                         state:
 *                           type: string
 *                           example: "Lagos"
 *                     price:
 *                       type: number
 *                       example: 250000
 *                     documents:
 *                       type: object
 *                       properties:
 *                         images:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               url:
 *                                 type: string
 *                                 example: "https://res.cloudinary.com/demo/image/upload/v1/Event/Venues/img123.jpg"
 *                               publicId:
 *                                 type: string
 *                                 example: "Event/Venues/img123"
 *                         cac:
 *                           type: object
 *                           properties:
 *                             url:
 *                               type: string
 *                               example: "https://res.cloudinary.com/demo/image/upload/v1/Event/Venues/cac123.pdf"
 *                             publicId:
 *                               type: string
 *                               example: "Event/Venues/cac123"
 *                         doc:
 *                           type: object
 *                           properties:
 *                             url:
 *                               type: string
 *                               example: "https://res.cloudinary.com/demo/image/upload/v1/Event/Venues/doc123.pdf"
 *                             publicId:
 *                               type: string
 *                               example: "Event/Venues/doc123"
 *       400:
 *         description: Bad request (missing or duplicate data)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Venue already exists in this city
 *       404:
 *         description: Venue owner not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Venue owner not found, can't create venue
 *       500:
 *         description: Internal server error
 */
router.post('/list-venue', authentication, upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'cac', maxCount: 1 },
  { name: 'doc', maxCount: 1 },
]), createVenue)


/**
 * @swagger
 * /getOneVenue/{id}:
 *   get:
 *     summary: Get one venue by ID
 *     description: Retrieve details of a specific venue.
 *     tags: [Venue]
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
 * /updatedvenue/{id}:
 *   put:
 *     summary: Update a venue
 *     description: Allows a venue owner to update their venue details.
 *     tags: [Venue]
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
 *               amenities: ["WiFi", "Chairs", "Parking"]
 *     responses:
 *       200:
 *         description: Venue updated successfully
 *       404:
 *         description: Venue not found or unauthorized
 */
router.put('/updatedvenue/:id', authentication, upload.array('image', 5), updateVenue)


/**
 * @swagger
 * /deletevenue/{id}:
 *   delete:
 *     summary: Delete a venue
 *     description: Allows a venue owner to delete a venue.
 *     tags: [Venue]
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
