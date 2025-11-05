const router = require('express').Router()

const {
  signUp,
  getAllAdmin,
  getOneAdmin,
  updateAdminInfo,
  deleteAdmin,
  getAllListed,
  allVenues,
  allVenuesVerified,
  allVenuesUnverified,
  allVenuesFeatured,
  allVenuesPending,
  verifiyVenue,
  unverifiedVenue,
} = require('../controller/adminController')
const { authentication, authorize } = require('../middleware/authMiddleware')

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Register a new admin
 *     description: Creates a new admin account with hashed password. If the admin already exists, returns an error message.
 *     tags:
 *       - Admin 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - surname
 *               - phoneNumber
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               surname:
 *                 type: string
 *                 example: Doe
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin@123
 *     responses:
 *       201:
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: admin created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     surname:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     id:
 *                       type: string
 *                       example: 64ac0c9e5b1b2f001fa2e5a1
 *       404:
 *         description: Admin already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: admin already exists, log in to your account
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong while creating admin
 */
 router.post('/admin', signUp)

/**
 * @swagger
 * /fetch:
 *   get:
 *     summary: Fetch all admins
 *     description: Retrieves a list of all registered admins from the database. Excludes sensitive fields such as password, phone number, verification status, and internal version keys.
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: All admins fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All admin fetched
 *                 total:
 *                   type: number
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 670f9e48c2b9d47c84022f15
 *                       firstName:
 *                         type: string
 *                         example: Precious
 *                       surname:
 *                         type: string
 *                         example: Silver
 *                       email:
 *                         type: string
 *                         example: precioussilver988@gmail.com
 *       500:
 *         description: Internal server error
 */
router.get('/fetch', authorize, getAllAdmin)

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Get a single admin by ID
 *     description: Retrieves details of a specific admin using their unique MongoDB ID. Excludes sensitive fields such as password, phone number, and verification status.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the admin to retrieve
 *         schema:
 *           type: string
 *           example: 670f9e48c2b9d47c84022f15
 *     responses:
 *       200:
 *         description: Admin found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin found
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 670f9e48c2b9d47c84022f15
 *                     firstName:
 *                       type: string
 *                       example: Precious
 *                     surname:
 *                       type: string
 *                       example: Silver
 *                     email:
 *                       type: string
 *                       example: precious@gmail.com
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Admin with the ID, 670f9e48c2b9d47c84022f15 not found
 *       500:
 *         description: Internal server error
 */
router.get('/admin/:id', authorize, getOneAdmin)

/**
 * @swagger
 * /adminInfo/{id}:
 *   put:
 *     summary: Update an admin's information
 *     description: Allows an admin to update their first name, surname, phone number, or password. Email cannot be changed.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the admin to update
 *         schema:
 *           type: string
 *           example: 671a32e4a84b9c5a70f9b2c7
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Precious
 *               surname:
 *                 type: string
 *                 example: Silver
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348123456789"
 *               password:
 *                 type: string
 *                 example: NewStrongPass@123
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: Precious
 *                     surname:
 *                       type: string
 *                       example: Silver
 *                     email:
 *                       type: string
 *                       example: precioussilver988@gmail.com
 *       404:
 *         description: Admin with the ID 671a32e4a84b9c5a70f9b2c7 not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin not found
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
 *                 error:
 *                   type: string
 *                   example: "Cannot read properties of undefined"
 */
router.put('/adminInfo/:id', authorize, updateAdminInfo)

/**
 * @swagger
 * /deleteAdmin/{id}:
 *   delete:
 *     summary: Delete an admin
 *     description: Deletes an admin account from the database using the provided admin ID.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the admin to delete
 *         schema:
 *           type: string
 *           example: 671a32e4a84b9c5a70f9b2c7
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 *                   example: "Cast to ObjectId failed for value 'abc' (type string)"
 */
router.delete('/deleteAdmin/:id', authorize, deleteAdmin)

/**
 * @swagger
 * /venues:
 *   get:
 *     summary: Retrieve all venues
 *     description: Get a list of all venues with status "verified" or "pending". Accessible to authenticated venue owners and admins.
 *     tags: [Venue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all venues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All venues retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 671db92e6fdcbb9b1b1e7a0f
 *                       name:
 *                         type: string
 *                         example: The Grand Palace Hall
 *                       description:
 *                         type: string
 *                         example: Spacious event hall suitable for weddings and conferences.
 *                       location:
 *                         type: object
 *                         properties:
 *                           street:
 *                             type: string
 *                             example: 24 Victoria Street
 *                           city:
 *                             type: string
 *                             example: Lagos
 *                           state:
 *                             type: string
 *                             example: Lagos
 *                       price:
 *                         type: number
 *                         example: 300000
 *                       capacity:
 *                         type: number
 *                         example: 500
 *                       type:
 *                         type: string
 *                         example: Indoor
 *                       status:
 *                         type: string
 *                         enum: [verified, pending, rejected]
 *                         example: verified
 *                       amenities:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: Air conditioning
 *                       image:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             url:
 *                               type: string
 *                               example: https://res.cloudinary.com/demo/image/upload/v1726759445/Event/Venues/image1.jpg
 *                             publicId:
 *                               type: string
 *                               example: Event/Venues/image1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-16T08:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-16T09:00:00.000Z
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error.
 */
router.get('/venues', authentication, getAllListed)

/**
 * @swagger
 * /allverified-venues:
 *   get:
 *     summary: Retrieve all verified venues
 *     description: Fetch all venues from the database that have been verified by the admin or system.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []     # Requires Authorization header (JWT)
 *     responses:
 *       200:
 *         description: All verified venues successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All venues listed
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 67305c19bfa2f4f3a6df2320
 *                       venuename:
 *                         type: string
 *                         example: Royal Garden Hall
 *                       description:
 *                         type: string
 *                         example: A modern event center for weddings and corporate gatherings.
 *                       status:
 *                         type: string
 *                         example: verified
 *                       price:
 *                         type: number
 *                         example: 300000
 *                       type:
 *                         type: string
 *                         example: indoor
 *                       location:
 *                         type: object
 *                         properties:
 *                           street:
 *                             type: string
 *                             example: 12 Admiralty Way
 *                           city:
 *                             type: string
 *                             example: Lekki
 *                           state:
 *                             type: string
 *                             example: Lagos
 *                       amenities:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Air Conditioning", "Stage Lighting", "CCTV", "Parking Space"]
 *                       capacity:
 *                         type: object
 *                         properties:
 *                           minimum:
 *                             type: integer
 *                             example: 50
 *                           maximum:
 *                             type: integer
 *                             example: 300
 *                       documents:
 *                         type: object
 *                         properties:
 *                           images:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 url:
 *                                   type: string
 *                                   example: https://res.cloudinary.com/eventiq/image/upload/hall-image.jpg
 *                           cac:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 url:
 *                                   type: string
 *                                   example: https://res.cloudinary.com/eventiq/image/upload/cac-cert.pdf
 *                           doc:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 url:
 *                                   type: string
 *                                   example: https://res.cloudinary.com/eventiq/image/upload/land-agreement.pdf
 *       401:
 *         description: Unauthorized access — missing or invalid token.
 *       500:
 *         description: Server error.
 */

router.get('/allverified-venues', authorize, allVenuesVerified)

/**
 * @swagger
 * /allunverified-venues:
 *   get:
 *     summary: Retrieve all unverified venues
 *     description: Fetch all venues from the database that have not yet been verified.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []   # Requires Authorization header (JWT)
 *     responses:
 *       200:
 *         description: All unverified venues successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All venues listed
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 67305c19bfa2f4f3a6df2320
 *                       venuename:
 *                         type: string
 *                         example: Emerald Event Hall
 *                       description:
 *                         type: string
 *                         example: A spacious outdoor event venue suitable for large gatherings.
 *                       status:
 *                         type: string
 *                         example: unverified
 *                       price:
 *                         type: number
 *                         example: 250000
 *                       type:
 *                         type: string
 *                         example: outdoor
 *                       location:
 *                         type: object
 *                         properties:
 *                           street:
 *                             type: string
 *                             example: 45 Herbert Macaulay Way
 *                           city:
 *                             type: string
 *                             example: Yaba
 *                           state:
 *                             type: string
 *                             example: Lagos
 *                       amenities:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Parking", "Toilets", "Stage Lighting"]
 *                       capacity:
 *                         type: object
 *                         properties:
 *                           minimum:
 *                             type: integer
 *                             example: 100
 *                           maximum:
 *                             type: integer
 *                             example: 800
 *                       documents:
 *                         type: object
 *                         properties:
 *                           images:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 url:
 *                                   type: string
 *                                   example: https://res.cloudinary.com/eventiq/image/upload/hall1.png
 *                           cac:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 url:
 *                                   type: string
 *                                   example: https://res.cloudinary.com/eventiq/image/upload/cac-cert.pdf
 *                           doc:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 url:
 *                                   type: string
 *                                   example: https://res.cloudinary.com/eventiq/image/upload/land-document.pdf
 *       401:
 *         description: Unauthorized — missing or invalid token.
 *       500:
 *         description: Internal server error.
 */
router.get('/allunverified-venues', authorize, allVenuesUnverified)

/**
 * @swagger
 * /allfeatured-venues:
 *   get:
 *     summary: Retrieve all featured venues
 *     description: Fetch all venues that are marked as featured
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []   # Requires Authorization header (JWT)
 *     responses:
 *       200:
 *         description: All featured venues successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All venues listed
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 67305c19bfa2f4f3a6df2320
 *                       venuename:
 *                         type: string
 *                         example: Grand Royale Hall
 *                       description:
 *                         type: string
 *                         example: A luxurious multipurpose hall with top-notch amenities.
 *                       isFeatured:
 *                         type: boolean
 *                         example: true
 *                       status:
 *                         type: string
 *                         example: verified
 *                       price:
 *                         type: number
 *                         example: 400000
 *                       type:
 *                         type: string
 *                         example: multipurpose
 *                       location:
 *                         type: object
 *                         properties:
 *                           street:
 *                             type: string
 *                             example: 22 Admiralty Way
 *                           city:
 *                             type: string
 *                             example: Lekki
 *                           state:
 *                             type: string
 *                             example: Lagos
 *                       amenities:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["AC", "WiFi", "Parking", "Stage"]
 *                       capacity:
 *                         type: object
 *                         properties:
 *                           minimum:
 *                             type: integer
 *                             example: 100
 *                           maximum:
 *                             type: integer
 *                             example: 500
 *                       documents:
 *                         type: object
 *                         properties:
 *                           images:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 url:
 *                                   type: string
 *                                   example: https://res.cloudinary.com/eventiq/image/upload/hall1.jpg
 *                           cac:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 url:
 *                                   type: string
 *                                   example: https://res.cloudinary.com/eventiq/image/upload/cac-cert.pdf
 *                           doc:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 url:
 *                                   type: string
 *                                   example: https://res.cloudinary.com/eventiq/image/upload/land-doc.pdf
 *       401:
 *         description: Unauthorized — missing or invalid token.
 *       500:
 *         description: Internal server error.
 */
router.get('/allfeatured-venues', authorize, allVenuesFeatured)

/**
 * @swagger
 * /allpending-venues:
 *   get:
 *     summary: Retrieve all pending venues
 *     description: Fetch all venues that have a `status` of `pending` — typically awaiting verification or approval.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []   # Requires Authorization header (JWT)
 *     responses:
 *       200:
 *         description: All pending venues successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All venues listed
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 67305c19bfa2f4f3a6df2320
 *                       venuename:
 *                         type: string
 *                         example: Crystal Palace Event Center
 *                       description:
 *                         type: string
 *                         example: A mid-sized hall pending approval.
 *                       status:
 *                         type: string
 *                         example: pending
 *                       price:
 *                         type: number
 *                         example: 250000
 *                       type:
 *                         type: string
 *                         example: conference
 *                       location:
 *                         type: object
 *                         properties:
 *                           street:
 *                             type: string
 *                             example: 12 Freedom Street
 *                           city:
 *                             type: string
 *                             example: Ikeja
 *                           state:
 *                             type: string
 *                             example: Lagos
 *                       amenities:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Air conditioning", "Stage", "Restrooms"]
 *                       capacity:
 *                         type: object
 *                         properties:
 *                           minimum:
 *                             type: integer
 *                             example: 50
 *                           maximum:
 *                             type: integer
 *                             example: 200
 *                       documents:
 *                         type: object
 *                         properties:
 *                           images:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 url:
 *                                   type: string
 *                                   example: https://res.cloudinary.com/eventiq/image/upload/hall2.jpg
 *                           cac:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 url:
 *                                   type: string
 *                                   example: https://res.cloudinary.com/eventiq/image/upload/cac-cert.pdf
 *                           doc:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 url:
 *                                   type: string
 *                                   example: https://res.cloudinary.com/eventiq/image/upload/land-doc.pdf
 *       401:
 *         description: Unauthorized — missing or invalid token.
 *       500:
 *         description: Internal server error.
 */

router.get('/allpending-venues', authorize, allVenuesPending)

/**
 * @swagger
 * /venue-verifiy/{id}:
 *   get:
 *     summary: Verify a venue
 *     description: Marks a venue's status as **verified** once it has passed the verification process.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []   # Requires Authorization header (JWT)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the venue to verify.
 *         schema:
 *           type: string
 *           example: 67305c19bfa2f4f3a6df2320
 *     responses:
 *       200:
 *         description: Venue successfully verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: venue verified successfully
 *       404:
 *         description: Venue not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: venue not found
 *       401:
 *         description: Unauthorized — missing or invalid token.
 *       500:
 *         description: Internal server error.
 */

router.get('/venue-verifiy/:id', authorize, verifiyVenue)

/**
 * @swagger
 * /venue-unverified/{venueId}:
 *   post:
 *     summary: Unverify a specific venue
 *     description: Allows an admin to mark a venue as **unverified** and sends an email notification to the venue owner.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []   # Admin must be logged in
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         description: The ID of the venue to be marked as unverified
 *         schema:
 *           type: string
 *           example: 671b245f5a7cfe52d3fae342
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 description: The reason for unverifying the venue
 *                 example: Venue failed verification due to incomplete CAC documentation.
 *     responses:
 *       200:
 *         description: Venue marked as unverified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: venue unverified successfully
 *       400:
 *         description: Session expired or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: session expired please login to continue
 *       404:
 *         description: Admin, venue, or venue owner not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: venue not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */
router.post('/venue-unverified/:venueId', authorize, unverifiedVenue)

module.exports = router