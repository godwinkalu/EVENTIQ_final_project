const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
    const ext = file.mimetype.split('/')[1];
    cb(null, `File_${uniqueSuffix}.${ext}`)
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('application/') || file.mimetype.startsWith('video/')) {
    cb(null, true)
  } else {
    throw new Error('Invalid file format: images, videos, pdfs, docs files only')
  }
};

const limits = {
  fileSize: 1024 * 1024 * 20
};

const uploads = multer({
  storage,
  fileFilter,
  limits
})


module.exports = uploads