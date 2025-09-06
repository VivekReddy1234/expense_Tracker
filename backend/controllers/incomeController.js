const Income = require('../models/Income');
const excelJS = require('exceljs');
const mongoose = require('mongoose');

const addIncome = async (req, res) => { 
    try {
        const { amount, source, date, description,icon } = req.body;
        if (!amount || !source || !date) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const income = new Income({
            userId: req.user._id,
            icon,
            amount,
            source,
            date : new Date(date),
            description
        });
        await income.save();
        res.status(201).json({ message: 'Income added successfully', income });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllIncome = async (req, res) => {
    try {
        const incomes = await Income.find({ userId: req.user._id }).sort({ date: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteIncome = async (req, res) => {
    try {
        const incomeId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(incomeId)) {
            return res.status(400).json({ message: 'Invalid income ID' });
        }
        const income = await Income.findOneAndDelete({ _id: incomeId, userId: req.user._id });
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        res.status(200).json({ message: 'Income deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
const downloadIncomeExcel = async (req, res) => {
    try {
        const incomes = await Income.find({ userId: req.user._id }).sort({ date: -1 });
        if (incomes.length === 0) {
            return res.status(404).json({ message: 'No income data to export' });
        }

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Incomes');

        worksheet.columns = [
            { header: 'ID', key: '_id', width: 30 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Source', key: 'source', width: 25 },
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Description', key: 'description', width: 30 },
            { header: 'Created At', key: 'createdAt', width: 20 },
            { header: 'Updated At', key: 'updatedAt', width: 20 },
        ];

        incomes.forEach((income) => {
            worksheet.addRow(income.toObject());
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'incomes.xlsx'
        );

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};  

module.exports = {
    addIncome,  
    getAllIncome,
    deleteIncome,
    downloadIncomeExcel
};