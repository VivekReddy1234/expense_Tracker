const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({  
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',    
        required: true
    },
    icon:{
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String
    }
}, { timestamps: true });


const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;