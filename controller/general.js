const venueOwnerModel = require('../models/venueOwnerModel')
const clientModel = require('../models/clientModel')
const adminModel = require('../models/adminModel')
const jwt = require('jsonwebtoken')
const { signUpTemplate } = require('../utils/emailTemplate')
const { emailSender } = require('../middleware/nodemalier')
const bcrypt = require('bcrypt')


exports.verify = async (req, res, next) => {
  const { email, otp } = req.body
  try {
    const user =
      (await venueOwnerModel.findOne({ email: email.toLowerCase() })) ||
      (await clientModel.findOne({ email: email.toLowerCase() }))

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (Date.now() >= user.otpExpiredat) {
      return res.status(400).json({
        message: 'Otp expired',
      })
    }

    if (otp !== user.otp) {
      return res.status(404).json({
        message: 'Incorrect Otp',
      })
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: 'User already verified, please proceed to login',
      })
    }

    Object.assign(user, {
      isVerified: true,
      otp: null,
      otpExpiredat: null,
    })

    await user.save()
    res.status(200).json({
      message: 'User verified Successfully',
    })
  } catch (error) {
    next(error)
  }
}

exports.resendOtp = async (req, res, next) => {
  const { email } = req.body
  try {
    const user =
      (await venueOwnerModel.findOne({ email: email.toLowerCase() })) ||
      (await clientModel.findOne({ email: email.toLowerCase() }))

    if (!user) {
      return res.status(404).json({
        message: 'user not found',
      })
    }

    const newOtp = Math.floor(1000 + Math.random() * 1e6)
      .toString()
      .padStart(6, '0')
    user.otp = newOtp
    user.otpExpiredat = Date.now() + 2 * 60 * 1000
    await user.save()

    if (`${req.protocol}://${req.get('host')}`.startsWith('http://localhost')) {
      const emailOptions = {
        email: user.email,
        subject: 'Verify Email',
        html: signUpTemplate(newOtp, user.firstName),
      }

      emailSender(emailOptions)
    } else {
    }

    res.status(200).json({
      message: 'OTP resent successfully',
    })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await venueOwnerModel.findOne({ email: email.toLowerCase() }) || await clientModel.findOne({ email: email.toLowerCase() }) || await adminModel.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (user.isVerified === false) {
      return res.status(404).json({
        message: 'Account not verified',
      })
    }

    const correctPassword = await bcrypt.compare(password, user.password)

    if (!correctPassword) {
      return res.status(400).json({
        message: 'Invaild Credentials',
      })
    }

    user.isLoggedIn = true
    const token = jwt.sign(
      { id: user._id, isLoggedIn: user.isLoggedIn, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )

    await user.save()
    res.status(200).json({
      message: 'Logged in  successfully',
      data: user,
      token,
    })
  } catch (error) {
    console.log(error);
    
    next(error)
  }
}


exports.logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await clientModel.findById(id) || await venueOwnerModel.findById(id) || await adminModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    };

    if (user.isLoggedIn === false) {
      return res.status(400).json({
        message: 'User is already logged out'
      })
    };

    user.isLoggedIn = false;
    await user.save();
    res.status(200).json({
      message: 'Logged out successful'
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue'
      })
    }
    next(error)
  }
}


exports.changePassword = async (req, res, next) => {
  const { id } = req.user
  const { oldPassword, newPassword, confirmPassword } = req.body

  try {
    const user =
      (await venueOwnerModel.findById(id)) ||
      (await clientModel.findById(id)) ||
      (await adminModel.findById(id))

    if (!user) {
      return res.status(404).json({
        message: 'user not found',
      })
    }

    const checkOldPassword = await bcrypt.compare(oldPassword, user.password)
    if (!checkOldPassword) {
      return res.status(400).json({
        message: 'Oldpassword Incorrect',
      })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'newPassword mismatch',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedPassword
    await user.save()
    return res.status(200).json({
      message: 'Password changed successfully',
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue'
      })
    }
    next(error)
  }
}

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body
  try {
    const user =
      (await venueOwnerModel.findOne({ email: email.toLowerCase() })) ||
      (await adminModel.findOne({ email: email.toLowerCase() })) ||
      (await clientModel.findOne({ email: email.toLowerCase() }))

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const newOtp = Math.floor(1000 + Math.random() * 1e6)
      .toString()
      .padStart(6, '0')
    user.otp = newOtp
    user.otpExpiredat = Date.now() + 2 * 60 * 1000
    await user.save()

    console.log("Hosted url", `${req.protocol}://${req.get('host')}`);


    if (`${req.protocol}://${req.get('host')}`.startsWith('http://localhost')) {
      const emailOptions = {
        email: user.email,
        subject: 'Reset Password',
        html: signUpTemplate(newOtp, user.firstName),
      }

      emailSender(emailOptions)
    } else {
    }

    return res.status(200).json({
      message: 'forgot password request sent',
    })
  } catch (error) {
    next(error)
  }
}

exports.resetPassword = async (req, res, next) => {
  const { email, newPassword, confirmPassword } = req.body
  try {
    const user =
      (await venueOwnerModel.findOne({ email: email.toLowerCase() })) ||
      (await adminModel.findOne({ email: email.toLowerCase() })) ||
      (await clientModel.findOne({ email: email.toLowerCase() }))

    if (!user) {
      return res.status(404).json({
        message: 'user not found',
      })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Password mismatch',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    user.password = hashedPassword
    await user.save()
    return res.status(200).json({
      message: 'Password reset successfully',
    })
  } catch (error) {
    next(error)
  }
}


exports.updatePhoneNumber = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user =
      (await venueOwnerModel.findById(id)) ||
      (await clientModel.findById(id)) ||
      (await adminModel.findById(id))
    const { phoneNumber } = req.body;

    if (!user) {
      return res.status(404).json({
        message: 'Venue owner not found',
      });
    };

    user.phoneNumber = phoneNumber ?? user.phoneNumber;
    await user.save();
    res.status(200).json({
      message: 'Phone number updated successfully',
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue'
      })
    }
    next(error);
  }
};


exports.updateProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user =
      (await venueOwnerModel.findById(id)) ||
      (await clientModel.findById(id)) ||
      (await adminModel.findById(id))
    const file = req.file;

    if (!user) {
      return res.status(404).json({
        message: 'Venue owner not found',
      });
    };

    let profilePicture = user.profilePicture;

    if (file && file.path) {
      const response = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path)
      profilePicture = {
        url: response.secure_url,
        publicId: response.public_id
      }
    }

    Object.assign(user, {
      profilePicture
    });
    await user.save();
    res.status(200).json({
      message: 'Profile picture updated successfully',
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue'
      })
    }
    next(error);
  }
};
