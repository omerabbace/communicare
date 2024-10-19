const multer = require('multer');
const path = require('path');

// Define storage for the files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Folder to save the uploaded files
  },
  filename: (req, file, cb) => {
    // Use Date.now() to prevent name collisions and retain file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to allow certain file types (including .mov with video/quicktime MIME type)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|mp4|mov/; // Allow .mov
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  // MIME types corresponding to the allowed extensions
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'video/mp4',
    'video/quicktime',  // Allow .mov files
  ];

  const mimetype = allowedMimeTypes.includes(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error('Unsupported file type. Only jpeg, jpg, png, mp4, and mov are allowed.'));
  }
};

// Multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit files to 50MB
  fileFilter: fileFilter,
}).array('media', 10); // Allow up to 10 files

module.exports = upload;
