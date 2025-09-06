const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { isValidObjectId, Types } = require('mongoose');

const getDashboardData = async (req, res) => {
  try {
    // Use string ID directly; Mongoose casts it automatically
    const userId = req.user._id;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Total income & expense
    const [totalIncomeAgg] = await Income.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const [totalExpenseAgg] = await Expense.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalIncome = totalIncomeAgg ? totalIncomeAgg.total : 0;
    const totalExpense = totalExpenseAgg ? totalExpenseAgg.total : 0;
    const balance = totalIncome - totalExpense;

   const last60Days = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 60 days in milliseconds


    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: last60Days }
    }).sort({ date: -1 });

    const last60DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: last60Days }
    }).sort({ date: -1 });

    const incomeLast60Days = last60DaysIncomeTransactions.reduce((acc, t) => acc + t.amount, 0);
    const expenseLast60Days = last60DaysExpenseTransactions.reduce((acc, t) => acc + t.amount, 0);

    // Recent transactions (last 5)
    const lastTransactions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(txn => ({ ...txn.toObject(), type: 'income' })),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(txn => ({ ...txn.toObject(), type: 'expense' }))
    ].sort((a, b) => b.date - a.date).slice(0, 5);

    // Send single response
    res.status(200).json({
      totalIncome,
      totalExpense,
      balance,
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions
      },
      last60DaysExpense: {
        total: expenseLast60Days,
        transactions: last60DaysExpenseTransactions
      },
      recentTransactions: lastTransactions
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getDashboardData };
