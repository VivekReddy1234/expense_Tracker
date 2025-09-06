const express = require('express');

const router = express.Router();

const { protect } = require('../middlewares/authMiddleWare');

const {
    addExpense,
    getAllExpenses,
    deleteExpense,
    downloadExpenseExcel
} = require('../controllers/expenseController');


router.post('/add', protect, addExpense);
 router.get('/get', protect, getAllExpenses);
router.delete('/delete/:id', protect, deleteExpense);
router.get('/downloadexcel', protect, downloadExpenseExcel);






module.exports = router;