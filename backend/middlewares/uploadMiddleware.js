const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only 
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {      
    const error = new Error("Incorrect file");
    error.code = "INCORRECT_FILETYPE";
    return cb(error, false);
  }
    cb(null, true);
}

const upload = multer({storage,fileFilter});
module.exports = upload;
// module.exports = upload.single('file');
// module.exports = upload.array('files', 10); // For multiple files, max 10
// module.exports = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]); // For multiple fields
// Usage in routes:
// const upload = require('../middlewares/uploadMiddleware');
// router.post('/upload', upload.single('file'), (req, res) => { ... });
// router.post('/upload-multiple', upload.array('files', 10), (req, res) => { ... });
// router.post('/upload-fields', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]), (req, res) => { ... });
// In the route handler, access files via req.file or req.files depending on the method used.
// Example for single file: req.file            
// Example for multiple files: req.files
// Example for multiple fields: req.files['avatar'], req.files['gallery']
// Make sure to handle errors and validate file types/sizes as needed.
// Note: This is a basic setup. For production, consider using cloud storage solutions.