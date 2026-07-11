const express = require('express');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const { protect } = require('../middleware/auth');
const { staffOrAdmin } = require('../middleware/roles');

const router = express.Router();

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// POST /api/upload
// Expects a multipart form-data field named "image"
router.post(
  '/',
  protect,
  staffOrAdmin,
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image file.' });
      }

      // Upload to Cloudinary using buffer stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'himtrail',
        },
        (error, result) => {
          if (error) {
            return next(error);
          }
          res.json({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      uploadStream.end(req.file.buffer);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
