const admin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Only admins are allowed to carry out this operation',
      })
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = admin
