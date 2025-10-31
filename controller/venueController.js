const venueModel = require('../models/venueModel')
const venueOwnerModel = require('../models/venueOwnerModel')
const cloudinary = require('../config/cloudinary')
const fs = require('fs')

exports.createVenue = async (req, res, next) => {

  try {
    const {
      venuename,
      description,
      capacity,
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

exports.uploadDoc = async (req, res, next) => {
  const { images, cac, doc } = req.files || []

  const cleanupLocalFiles = (files) => {
    for (const file of files) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }
    }
  }

  try {
    const { id } = req.user
    const venueOwner = await venueOwnerModel.findById(id)

    if (!venueOwner) {
      fs.unlinkSync(file.path)
      return res.status(404).json({
        message: 'Venue owner not found',
      })
    }

    const venue = await venueModel.findOne({ venueOwnerId: venueOwner._id })

    if (!venue) {
      return res.status(404).json({
        message: 'Venue not found',
      })
    }

    if (!images?.length || !cac?.length || !doc?.length) {
      return res.status(400).json({
        message: 'All required files (images, CAC, doc) must be provided',
      });
    }

    const uploadedImages = await Promise.all(
      images.map(async (file) => {
        const uploadRes = await cloudinary.uploader.upload(file.path, {
          folder: 'Event/Venues',
          use_filename: true,
          transformation: [{ width: 500, height: 250, crop: 'fill', gravity: 'auto' }],
        });
        return { url: uploadRes.secure_url, publicId: uploadRes.public_id };
      })
    );

    const uploadCAC = await cloudinary.uploader.upload(cac[0].path, {
      folder: 'Event/Venues',
      use_filename: true,
      transformation: [{ width: 500, height: 250, crop: 'fill', gravity: 'auto' }],
    });

    const uploadDoc = await cloudinary.uploader.upload(doc[0].path, {
      folder: 'Event/Venues',
      use_filename: true,
      transformation: [{ width: 500, height: 250, crop: 'fill', gravity: 'auto' }],
    });

    cleanupLocalFiles(images);
    fs.unlinkSync(cac[0].path)
    fs.unlinkSync(doc[0].path)
    Object.assign(venue, {
      documents: {
        images: uploadedImages,
        cac: { url: uploadCAC.secure_url, publicId: uploadCAC.public_id },
        doc: { url: uploadDoc.secure_url, publicId: uploadDoc.public_id },
      },
    })
    await venue.save()
    res.status(201).json({
      message: 'Documents uploaded successfully ',
    })
  } catch (error) {
    if (files && Array.isArray(files)) cleanupLocalFiles(files)
    next(error)
  }
}


exports.getAllVenues = async (req, res, next) => {
  try {
    const venues = await venueModel.find()

    res.status(200).json({
      message: 'All venues retrieved successfully',
      data: venues,
    })
  } catch (error) {
    next(error)
  }
}
exports.getOnevenue = async (req, res, next) => {
  try {
    const { id } = req.params
    const venue = await venueModel.findById(id).populate('venueOwnerId', 'fullname email phoneNumber')
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
    let newUploadedImage;

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
        console.log(path);

        await cloudinary.uploader.destroy(path.publicId)
      }
    }

    res.status(200).json({ message: 'Venue deleted successfully' })
  } catch (error) {
    next(error)
  }
}
