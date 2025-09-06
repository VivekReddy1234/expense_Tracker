const express = require('express');
const router = express.Router();

const {
    addIncome,
    getAllIncome,
    deleteIncome,
    downloadIncomeExcel
} = require('../controllers/incomeController');

const { protect } = require('../middlewares/authMiddleWare');


 router.post('/add', protect, addIncome);
 router.get('/get', protect, getAllIncome);
router.delete('/delete/:id', protect, deleteIncome);
router.get('/downloadexcel', protect, downloadIncomeExcel);


 module.exports = router;









module.exports = router;