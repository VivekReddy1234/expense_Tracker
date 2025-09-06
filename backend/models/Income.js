const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({  
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
    source: {
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

const Income = mongoose.model('Income', incomeSchema);
module.exports = Income;
