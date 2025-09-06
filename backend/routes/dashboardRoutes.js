const express = require('express');
const { getDashboardData } = require('../controllers/dashboardController');


const router = express.Router();
const { protect } = require('../middlewares/authMiddleWare');


router.get('/', protect, getDashboardData);


module.exports = router;