const BankAccount = require("../models/BankAccount");
const User = require("../models/user");
const FundTransaction = require("../models/BankAccount");

// Get account details for logged-in user
exports.getAccountDetails = async (req, res) => {
  try {
    const account = await BankAccount.findOne({ user: req.userId }).populate("user");
    if (!account) return res.status(404).json({ error: "Account not found" });
    res.json(account);
  } catch (err) {
    console.error("Error fetching account:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new bank account for the user
exports.createAccount = async (req, res) => {
  try {
    const { accountNumber, balance } = req.body;

    const existing = await BankAccount.findOne({ user: req.userId });
    if (existing) return res.status(400).json({ error: "Account already exists" });

    const account = new BankAccount({
      user: req.userId,
      accountNumber,
      balance,
      transactions: [],
      mandates: []
    });

    await account.save();

// Optional: Link account to user if needed
    await User.findByIdAndUpdate(req.userId, {
      $push: { accounts: account._id },
    });

    res.json({ message: "Account created", account });
  } catch (err) {
    console.error("Account creation failed:", err.message);
    res.status(500).json({ error: "Failed to create account" });
  }
};

// Dashboard Summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.userId;

    const allTransactions = await FundTransaction.find({ user: userId });

    const summary = {
      SHARE: 0,
      THRIFT: 0,
      MTLOAN: 0,
      OWNLOAN: 0,
    };

    allTransactions.forEach((tx) => {
      if (summary.hasOwnProperty(tx.fundType)) {
        summary[tx.fundType] += tx.amount;
      }
    });

    res.json(summary);
  } catch (err) {
    console.error("Dashboard fetch error:", err.message);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
};

// GET: Transactions by Fund Type
exports.getFundHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { type } = req.params;

    const validTypes = ["SHARE", "THRIFT", "MTLOAN", "OWNLOAN"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid fund type" });
    }

    const transactions = await FundTransaction.find({
      user: userId,
      fundType: type,
    }).sort({ date: -1 });

    res.json(transactions);
  } catch (err) {
    console.error("Fund history fetch error:", err.message);
    res.status(500).json({ error: "Failed to load fund history" });
  }
};

