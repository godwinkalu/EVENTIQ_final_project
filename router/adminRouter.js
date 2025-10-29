const router = require('express').Router()

const { signUp, getAllAdmin, getOneAdmin, updateAdminInfo, deleteAdmin } = require('../controller/adminController')


/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Register a new admin
 *     description: Creates a new admin account. The email must be unique, and the password is securely hashed before saving.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - surname
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Precious
 *               surname:
 *                 type: string
 *                 example: Silver
 *               email:
 *                 type: string
 *                 example: precioussilver988@gmail.com
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
 *                       example: Precious
 *                     surname:
 *                       type: string
 *                       example: Silver
 *                     email:
 *                       type: string
 *                       example: precioussilver988@gmail.com
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
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post("/admin", signUp)


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
router.get('/fetch', getAllAdmin);


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
router.get('/admin/:id', getOneAdmin);


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
router.put('/adminInfo/:id', updateAdminInfo);


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
router.delete('/deleteAdmin/:id', deleteAdmin);



module.exports = router 