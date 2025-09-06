const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const db = process.env.DATABASE_URL || 'mongodb://localhost:27017/finance';
    await mongoose.connect(db,{});
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;