const router = require('express').Router()

const {
  signUp,
  getAllAdmin,
  getOneAdmin,
  updateAdminInfo,
  deleteAdmin,
  allVenues,
  allVenueStatus,
  allVenuesFeatured,
  verifiyVenue,
  unverifiedVenue,
  VenuesOwner,
  allVenuesForAdmin,
  getOverview,
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
 * /halls:
 *   get:
 *     summary: Get all venues filtered by status
 *     description: Retrieve all venues from the database filtered by their status (e.g., verified, pending, rejected). Only accessible to admin users.
 *     tags:
 *       - [Admin]
 *     security:
 *       - bearerAuth: []    # JWT authentication
 *     parameters:
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [verified, pending, rejected]
 *         description: Status to filter venues by
 *     responses:
 *       200:
 *         description: List of venues filtered by status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All venues listed
 *                 total:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "671a1e3c6d9f5a20c0e20a47"
 *                       venuename:
 *                         type: string
 *                         example: "Luxe Event Center"
 *                       address:
 *                         type: string
 *                         example: "45 Kingsway Road, Lagos"
 *                       price:
 *                         type: number
 *                         example: 250000
 *                       capacity:
 *                         type: number
 *                         example: 500
 *                       status:
 *                         type: string
 *                         example: verified
 *       400:
 *         description: Session expired or bad token
 *         content:
 *           application/json:
 *             example:
 *               message: session expired please login to continue
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             example:
 *               message: admin not found
 */
router.get('/halls', authorize, allVenueStatus)

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
 * /venue-verifiy/{venueId}:
 *   get:
 *     summary: Verify a venue
 *     description: Allows an admin to verify a venue by its ID.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         description: The unique ID of the venue to be verified.
 *         schema:
 *           type: string
 *           example: 652e8b7f4c1234567890abcd
 *     responses:
 *       200:
 *         description: Venue verified successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: venue verified successfully
 *       400:
 *         description: Invalid or expired session token.
 *         content:
 *           application/json:
 *             example:
 *               message: session expired please login to continue
 *       404:
 *         description: Admin or venue not found.
 *         content:
 *           application/json:
 *             examples:
 *               AdminNotFound:
 *                 summary: Admin not found
 *                 value:
 *                   message: admin not found
 *               VenueNotFound:
 *                 summary: Venue not found
 *                 value:
 *                   message: venue not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               message: Something went wrong
 */
router.get('/venue-verifiy/:venueId', authorize, verifiyVenue)


/**
 * @swagger
 * /venue-unverified/{venueId}:
 *   post:
 *     summary: Mark a venue as unverified
 *     description: Allows an admin to mark a venue as unverified and notify the venue owner with a reason via email.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         description: The unique ID of the venue to be marked as unverified.
 *         schema:
 *           type: string
 *           example: 652e8b7f4c1234567890abcd
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: The reason why the venue was marked as unverified.
 *                 example: Missing required documentation for verification.
 *     responses:
 *       200:
 *         description: Venue marked as unverified successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: venue unverified successfully
 *       400:
 *         description: Invalid or expired session token.
 *         content:
 *           application/json:
 *             example:
 *               message: session expired please login to continue
 *       404:
 *         description: Admin, venue, or venue owner not found.
 *         content:
 *           application/json:
 *             examples:
 *               AdminNotFound:
 *                 summary: Admin not found
 *                 value:
 *                   message: admin not found
 *               VenueNotFound:
 *                 summary: Venue not found
 *                 value:
 *                   message: venue not found
 *               VenueOwnerNotFound:
 *                 summary: Venue owner not found
 *                 value:
 *                   message: venue owner not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               message: Something went wrong
 */
router.post('/venue-unverified/:venueId', authorize, unverifiedVenue)

/**
 * @swagger
 * /ownervenue:
 *   get:
 *     summary: Get all venues owned by the logged-in venue owner
 *     description: Retrieves all venues created by the authenticated venue owner.
 *     tags:
 *       - Venue Owner
 *     security:
 *       - bearerAuth: []   # Requires authentication token
 *     responses:
 *       200:
 *         description: Successfully retrieved all venues owned by the user
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
 *                         example: 67201c62f5e7b34328e4dabc
 *                       venuename:
 *                         type: string
 *                         example: Crystal Event Hall
 *                       description:
 *                         type: string
 *                         example: A spacious hall for weddings and conferences.
 *                       price:
 *                         type: number
 *                         example: 500000
 *                       type:
 *                         type: string
 *                         example: indoor
 *                       status:
 *                         type: string
 *                         example: verified
 *                       location:
 *                         type: object
 *                         properties:
 *                           street:
 *                             type: string
 *                             example: 14 Admiralty Way
 *                           city:
 *                             type: string
 *                             example: Lagos
 *                           state:
 *                             type: string
 *                             example: Lagos
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: session expired please login to continue
 *       404:
 *         description: Venue owner not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: venueowner not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/ownervenue', authentication, VenuesOwner)

/**
 * @swagger
 * /api/v1/venues:
 *   get:
 *     summary: Retrieve all verified venues
 *     description: This endpoint fetches all venues that have been verified. Venues are sorted by whether they are featured first, then by the most recently created.
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Successfully retrieved all verified venues.
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
 *                   example: 12
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "671fc8b3d3d9f1b2a8c8d923"
 *                       venuename:
 *                         type: string
 *                         example: "Eventiq Grand Hall"
 *                       location:
 *                         type: string
 *                         example: "Victoria Island, Lagos"
 *                       capacity:
 *                         type: integer
 *                         example: 300
 *                       price:
 *                         type: number
 *                         example: 250000
 *                       status:
 *                         type: string
 *                         example: verified
 *                       isFeatured:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-25T14:30:00.000Z"
 *       400:
 *         description: Session expired or token invalid (if token-based access is added later).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: session expired please login to continue
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/venues', allVenues)


/**
 * @swagger
 * /all-listed-venues:
 *   get:
 *     summary: Retrieve all venues (Admin only)
 *     description: This endpoint allows the admin to view all venues listed on the platform.
 *     tags:
 *       - Admin
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
 *                         example: "671fc8b3d3d9f1b2a8c8d923"
 *                       venuename:
 *                         type: string
 *                         example: "Eventiq Grand Hall"
 *                       location:
 *                         type: string
 *                         example: "Lekki Phase 1, Lagos"
 *                       capacity:
 *                         type: integer
 *                         example: 300
 *                       price:
 *                         type: number
 *                         example: 250000
 *                       status:
 *                         type: string
 *                         example: "verified"
 *                       isFeatured:
 *                         type: boolean
 *                         example: true
 *       400:
 *         description: Session expired or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session expired please login to continue
 *       404:
 *         description: Admin not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: admin not found
 */
router.get('/all-listed-venues', authorize, allVenuesForAdmin)

/**
 * @swagger
 * /overview:
 *   get:
 *     summary: Retrieve admin overview statistics
 *     description: >
 *       Provides overall statistics for the admin dashboard including total venues, verified users, confirmed bookings, and total revenue generated.
 *       Only authenticated admins can access this endpoint.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin overview data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Overview for admin corrolated successfully"
 *                 totalManagement:
 *                   type: array
 *                   description: List of confirmed bookings
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "674bcd8a9b1d2a00124f8e12"
 *                       clientId:
 *                         type: string
 *                         example: "674bcdb39b1d2a00124f8e34"
 *                       venueId:
 *                         type: string
 *                         example: "674bccff9b1d2a00124f8e78"
 *                       bookingstatus:
 *                         type: string
 *                         example: "confirmed"
 *                       total:
 *                         type: number
 *                         example: 150000
 *                 analysis:
 *                   type: object
 *                   properties:
 *                     totalVenues:
 *                       type: integer
 *                       example: 25
 *                     totalUser:
 *                       type: integer
 *                       example: 40
 *                     totalBookings:
 *                       type: integer
 *                       example: 18
 *                     totalRevenue:
 *                       type: number
 *                       example: 2300000
 *       401:
 *         description: Unauthorized - Missing or invalid admin token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Auth missing or invalid"
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin not found"
 *       500:
 *         description: Server error while retrieving overview data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/overview', authorize, getOverview);


module.exports = router