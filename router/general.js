const router = require('express').Router()
const { verify, resendOtp, login, changePassword, forgotPassword, resetPassword, updateProfile } = require('../controller/general')
const { authentication } = require('../middleware/authMiddleware')
const upload = require ('../middleware/multer')

/**
 * @swagger
 * /verify:
 *   post:
 *     summary: Verify user account using OTP
 *     tags: [Authentication]
 *     description: Verifies a newly registered client or venue owner using the OTP sent to their email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: User verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */

router.post('/verify', verify)

/**
 * @swagger
 * /resendOtp:
 *   post:
 *     summary: Resend verification OTP
 *     tags: [Authentication]
 *     description: Sends a new OTP to the user's email if the previous one expired or was not received.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       404:
 *         description: User not found
 */

router.post('/resendOtp', resendOtp)

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in as Client, Venue Owner, or Admin
 *     tags: [Authentication]
 *     description: Authenticates a user and returns a JWT token for session management.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               password:
 *                 type: string
 *                 example: johndoe123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: Account not found
 */

router.post('/login', login)

/**
 * @swagger
 * /changePassword:
 *   post:
 *     summary: Change account password
 *     tags: [Authentication]
 *     description: Allows a logged-in user to change their password by providing the old and new password.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: oldPass123
 *               newPassword:
 *                 type: string
 *                 example: newPass456
 *               confirmPassword:
 *                 type: string
 *                 example: newPass456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Incorrect old password or mismatch
 *       401:
 *         description: Unauthorized, token missing or expired
 *       404:
 *         description: User not found
 */

router.post('/changePassword', authentication, changePassword)

/**
 * @swagger
 * /forgotPassword:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Authentication]
 *     description: Sends a password reset OTP to the user’s registered email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *     responses:
 *       200:
 *         description: Forgot password request sent successfully
 *       404:
 *         description: User not found
 */

router.post('/forgotPassword', forgotPassword)


/**
 * @swagger
 * /resetPassword:
 *   post:
 *     summary: Reset account password
 *     tags: [Authentication]
 *     description: Allows the user to reset their password after verifying with the OTP sent via email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               newPassword:
 *                 type: string
 *                 example: newPass123
 *               confirmPassword:
 *                 type: string
 *                 example: newPass123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Password mismatch
 *       404:
 *         description: User not found
 */

router.post('/resetPassword', resetPassword)


/**
 * @swagger
 * /update-profile:
 *   patch:
 *     summary: Update user profile (phone number or profile picture)
 *     description: >
 *       Allows a venue owner, client, or admin to update their profile picture, phone number, or both.
 *       Requires authentication and a valid JWT token.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348061234567"
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "671f43b2e1d3a8a12f6e4b92"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+2348061234567"
 *                     profilePicture:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 *                           example: "https://res.cloudinary.com/example/image/upload/v1730492342/avatar.jpg"
 *                         publicId:
 *                           type: string
 *                           example: "avatar_1730492342"
 *       400:
 *         description: Session expired or bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session expired, login to continue"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 */
router.patch('/update-profile', upload.single('profilePicture') , authentication, updateProfile);

module.exports = router