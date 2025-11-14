const venueModel = require('../models/venueModel')
const venueOwnerModel = require('../models/venueOwnerModel')
const clientModel = require('../models/clientModel')
const adminModel = require('../models/adminModel')
const cloudinary = require('../config/cloudinary')
const fs = require('fs')

exports.createVenue = async (req, res, next) => {
  const { images, cac, doc } = req.files || []

  const cleanupLocalFiles = (files) => {
    for (const file of files) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }
    }
  }

  try {
    const {
      venuename,
      description,
      price,
      type,
      amenities,
      cautionfee,
      openingtime,
      closingtime,
      hallsize,
      street,
      city,
      state,
      minimum,
      maximum,
    } = req.body

    const id = req.user.id

    const venueOwner = await venueOwnerModel.findById(id)

    if (!venueOwner) {
      return res.status(404).json({
        message: "Venue owner not found, can't create venue",
      })
    }

    const existingVenue = await venueModel.findOne({
      venuenamename: venuename?.trim(),
      'location.street': street?.trim(),
    })

    if (existingVenue) {
      if (files && Array.isArray(files)) cleanupLocalFiles(files)
      return res.status(400).json({
        message: 'Venue already exists in this city',
      })
    }

    const location = {
      street: street ? street.trim() : '',
      city: city ? city.trim() : '',
      state: state ? state.trim() : '',
    }

    if (!images?.length || !cac?.length || !doc?.length) {
      return res.status(400).json({
        message: 'All required files (images, CAC, doc) must be provided',
      })
    }

    const uploadedImages = await Promise.all(
      images.map(async (file) => {
        const uploadRes = await cloudinary.uploader.upload(file.path, {
          folder: 'Event/Venues',
          use_filename: true,
          transformation: [{ width: 500, height: 250, crop: 'fill', gravity: 'auto' }],
        })
        return { url: uploadRes.secure_url, publicId: uploadRes.public_id }
      })
    )

    const uploadCAC = await Promise.all(
      cac.map(async (file) => {
        const uploadRes = await cloudinary.uploader.upload(file.path, {
          folder: 'Event/Venues',
          use_filename: true,
          transformation: [{ width: 500, height: 250, crop: 'fill', gravity: 'auto' }],
        })
        return { url: uploadRes.secure_url, publicId: uploadRes.public_id }
      })
    )

    const uploadDoc = await Promise.all(
      doc.map(async (file) => {
        const uploadRes = await cloudinary.uploader.upload(file.path, {
          folder: 'Event/Venues',
          use_filename: true,
          transformation: [{ width: 500, height: 250, crop: 'fill', gravity: 'auto' }],
        })
        return { url: uploadRes.secure_url, publicId: uploadRes.public_id }
      })
    )

    cleanupLocalFiles(images)
    cleanupLocalFiles(uploadCAC)
    cleanupLocalFiles(uploadDoc)

    const documents = {
      images: uploadedImages,
      cac: uploadCAC,
      doc: uploadDoc,
    }

    const capacity = {
      minimum: minimum,
      maximum: maximum,
    }

    const newVenue = new venueModel({
      venueOwnerId: venueOwner._id,
      venuename,
      description,
      location,
      price,
      openingtime,
      closingtime,
      hallsize,
      type,
      cautionfee,
      amenities,
      capacity,
      documents,
    })

    await newVenue.save()
    res.status(201).json({
      message: 'Venue uploaded successfully ',
      data: newVenue,
    })
  } catch (error) {
    next(error)
  }
}

exports.getOnevenue = async (req, res, next) => {
  try {
    const { id } = req.params
    const venue = await venueModel.findById(id)
    if (!venue) {
      return res.status(404).json({
        message: 'Venue not found',
      })
    }
    res.status(200).json({
      message: 'Venue retrieved successfully',
      data: venue,
    })
  } catch (error) {
    next(error)
  }
}

exports.updateVenue = async (req, res, next) => {
  const files = req.files || []

  const cleanupLocalFiles = (files) => {
    for (const file of files) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }
    }
  }

  try {
    const { id } = req.params
    const userId = req.user.id
    const { description, price, openhours, type, cautionfee, amenities } = req.body

    const venueOwner = await venueOwnerModel.findById(userId)
    const venue = await venueModel.findById(id)
    if (!venueOwner) {
      if (files && Array.isArray(files)) cleanupLocalFiles(files)
      return res.status(404).json({
        message: 'Venue owner not found',
      })
    }
    if (!venue) {
      if (files && Array.isArray(files)) cleanupLocalFiles(files)
      return res.status(404).json({
        message: 'Venue not found',
      })
    }

    let uploadedImages = venue.image
    let newUploadedImage

    if (files.length === 0) {
      newUploadedImage = uploadedImages
    } else {
      newUploadedImage = []

      for (const path of uploadedImages) {
        await cloudinary.uploader.destroy(path.publicId)
      }

      for (const file of files) {
        const cloudImage = await cloudinary.uploader.upload(file.path, {
          folder: 'Event/Venues',
          use_filename: true,
          transformation: [{ width: 500, height: 250, crop: 'fill', gravity: 'auto' }],
        })

        newUploadedImage.push({
          url: cloudImage.secure_url,
          publicId: cloudImage.public_id,
        })

        fs.existsSync(file.path) && fs.unlinkSync(file.path)
      }
    }

    const data = {
      description: description ?? venue.description,
      price: price ?? venue.price,
      openhours: openhours ?? venue.openhours,
      type: type ?? venue.type,
      cautionfee: cautionfee ?? venue.cautionfee,
      amenities: amenities ?? venue.amenities,
      image: newUploadedImage,
    }

    const updatedVenue = await venueModel.findByIdAndUpdate(venue._id, data, { new: true })

    res.status(200).json({
      message: 'Venue updated successfully',
      data: updatedVenue,
    })
  } catch (error) {
    if (files && Array.isArray(files)) cleanupLocalFiles(files)
    next(error)
  }
}

exports.deleteVenue = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const venueOwner = await venueOwnerModel.findById(userId)
    const venue = await venueModel.findById(id)

    if (!venueOwner) {
      return res.status(404).json({ message: 'Venue owner not found' })
    }

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' })
    }

    const deleted = await venueModel.findByIdAndDelete(venue._id)

    if (deleted) {
      for (path of venue.image) {
        await cloudinary.uploader.destroy(path.publicId)
      }
    }

    res.status(200).json({ message: 'Venue deleted successfully' })
  } catch (error) {
    next(error)
  }
}
