const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Define storage for the files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/profile-pictures'; // Directory for profile pictures

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory recursively
    }

    cb(null, uploadPath); // Folder to save the uploaded files
  },
  filename: (req, file, cb) => {
    // Use Date.now() to prevent name collisions and retain file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/; // Allow only images
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('image/');

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error('Unsupported file type. Only jpeg, jpg, and png are allowed.'));
  }
};

// Multer upload middleware for profile pictures
const uploadProfilePicture = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: fileFilter,
  }).single('profilePicture');
  

module.exports = uploadProfilePicture;
