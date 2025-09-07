const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const cookieParser = require('cookie-parser');
const dashboardRoutes = require('./routes/dashboardRoutes');



 

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../frontend/build')));

 app.use(express.urlencoded({ extended: true }));
app.use(express.json());





app.get('/', (req, res) => {
  res.send('Hello World!');
});

connectDB();

app.use('/api/v1/auth' , authRoutes);
app.use('/api/v1/income', incomeRoutes);
app.use('/api/v1/expense', expenseRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;



app.get("/*",(req,res)=>{
  res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
