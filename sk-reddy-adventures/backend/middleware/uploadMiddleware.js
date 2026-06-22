const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const makeDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = 'uploads/';
    
    // Choose destination based on fieldname or query
    if (file.fieldname === 'coverImage' || file.fieldname === 'galleryImages') {
      dest = 'uploads/tours/';
    } else if (file.fieldname === 'image' || file.fieldname === 'galleryImage') {
      dest = 'uploads/gallery/';
    }
    
    makeDir(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Keep original file extension and prefix with timestamp to ensure uniqueness
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (Only images allowed)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpg, jpeg, png, webp, gif) are allowed!'));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;
