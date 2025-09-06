const Expense = require('../models/Expense');
const mongoose= require("mongoose");

const excelJS = require('exceljs');

const addExpense = async (req, res) => { 
    try {
        const { amount, category, date, description,icon } = req.body;
        if (!amount || !category || !date) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const expense = new Expense({
            userId: req.user._id,
            icon,
            amount,
            category,
            date : new Date(date),
            description
        });
        await expense.save();
        res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
const getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(expenseId)) {
            return res.status(400).json({ message: 'Invalid expense ID' });
        }
        const expense = await Expense.findOneAndDelete({ _id: expenseId, userId: req.user._id });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
const downloadExpenseExcel = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
        if (expenses.length === 0) {
            return res.status(404).json({ message: 'No expense data to export' });
        }

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Expenses');

        // Define columns
        worksheet.columns = [
            { header: 'ID', key: '_id', width: 30 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Description', key: 'description', width: 30 },
        ];

        // Add rows
        expenses.forEach(expense => {
            worksheet.addRow({
                _id: expense._id.toString(),
                amount: expense.amount,
                category: expense.category,
                date: expense.date.toISOString().split('T')[0],
                description: expense.description || '',
            });
        });

        // Set response headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'expenses.xlsx'
        );

        // Write to response
        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    addExpense,
    getAllExpenses,
    deleteExpense,
    downloadExpenseExcel
};