const express = require('express');

 const router = express.Router();
   const { protect } = require('../middlewares/authMiddleWare');
   const upload = require('../middlewares/uploadMiddleware'); 
 const {
    registerUser,
    loginUser,
    logoutUser,
    getUserInfo,
    
 } = require('../controllers/authController');


 router.post('/signup', registerUser);
 router.post('/login', loginUser);
  router.get('/logout', logoutUser);

    router.get('/getuser',protect,getUserInfo);

    router.post('/upload',upload.single("image"), (req, res) => {
  if(!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
   }
   const imageUrl = `/uploads/${req.file.filename}`;
   res.status(200).json({ imageUrl });
    });


 module.exports = router;