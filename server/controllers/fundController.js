// controllers/fundController.js
const ShareTransaction = require("../models/ShareTransaction");
const ThriftTransaction = require("../models/ThriftTransaction");
const MtLoan = require("../models/MtLoan");
const MtLoanLog = require("../models/MtLoanLog");
const OwnLoan = require("../models/OwnLoan");
const OwnLoanLog = require("../models/OwnLoanLog");
const { calculateEMI } = require("../utils/emi");

// ---------- SHARE FUND ----------
// GET /fund/share?userId=...
async function getShareFund(req, res) {
  try {
    const { userId } = req.query;

    const match = userId ? { userId: userId } : {};

    // total (sum of amounts)
    const totalAgg = await ShareTransaction.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const total = totalAgg[0]?.total || 0;

    // monthly history: group by month, separate incoming/outgoing
    const history = await ShareTransaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$month",
          incoming: {
            $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] },
          },
          outgoing: {
            $sum: { $cond: [{ $lt: ["$amount", 0] }, "$amount", 0] },
          },
        },
      },
      { $project: { month: "$_id", incoming: 1, outgoing: 1, _id: 0 } },
      { $sort: { month: -1 } },
    ]);

    res.json({ total, history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch share fund" });
  }
}

// POST /fund/share
async function postShareTransaction(req, res) {
  try {
    const { userId, amount, type, date } = req.body;
    if (!userId || typeof amount !== "number" || !type) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const month = (date ? new Date(date) : new Date()).toISOString().slice(0,7);
    const signedAmount = type === "deposit" ? Math.abs(amount) : -Math.abs(amount);

    const tx = await ShareTransaction.create({
      userId, amount: signedAmount, type, month, date: date || new Date(),
    });

    res.json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create share transaction" });
  }
}

// ---------- THRIFT FUND ----------
async function getThriftFund(req, res) {
  try {
    const { userId } = req.query;
    const match = userId ? { userId } : {};

    const totalAgg = await ThriftTransaction.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const total = totalAgg[0]?.total || 0;

    const history = await ThriftTransaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$year",
          incoming: { $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] } },
          outgoing: { $sum: { $cond: [{ $lt: ["$amount", 0] }, "$amount", 0] } },
        },
      },
      { $project: { year: "$_id", incoming: 1, outgoing: 1, _id: 0 } },
      { $sort: { year: -1 } },
    ]);

    res.json({ total, history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch thrift fund" });
  }
}

async function postThriftTransaction(req, res) {
  try {
    const { userId, amount, type, date } = req.body;
    if (!userId || typeof amount !== "number" || !type) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const year = (date ? new Date(date) : new Date()).getFullYear().toString();
    const signedAmount = type === "deposit" ? Math.abs(amount) : -Math.abs(amount);

    const tx = await ThriftTransaction.create({
      userId, amount: signedAmount, type, year, date: date || new Date(),
    });

    res.json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create thrift transaction" });
  }
}

// ---------- MT LOAN ----------
/**
 * createMtLoan:
 * body: { userId, principal, interestRate, tenureMonths, startDate }
 * will calculate EMI, totalPayable, remainingAmount, create loan doc and create mt loan logs (monthly)
 */
async function createMtLoan(req, res) {
  try {
    const { userId, principal, interestRate, tenureMonths, startDate } = req.body;
    if (!userId || !principal || !interestRate || !tenureMonths) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const parsedStart = startDate ? new Date(startDate) : new Date();
    const monthlyEMI = calculateEMI(principal, interestRate, tenureMonths);

    // approximate total payable as EMI * months
    const totalPayable = +(monthlyEMI * tenureMonths).toFixed(2);
    const endDate = new Date(parsedStart);
    endDate.setMonth(endDate.getMonth() + tenureMonths - 1);

    const loan = await MtLoan.create({
      userId, principal, interestRate, totalPayable, remainingAmount: totalPayable,
      tenureMonths, startDate: parsedStart, endDate, monthlyEMI
    });

    // create monthly logs
    const logs = [];
    for (let i = 0; i < tenureMonths; i++) {
      const dt = new Date(parsedStart);
      dt.setMonth(dt.getMonth() + i);
      const monthStr = dt.toISOString().slice(0,7);
      logs.push({
        userId,
        loanId: loan._id,
        month: monthStr,
        emiAmount: monthlyEMI,
        status: "pending",
      });
    }
    await MtLoanLog.insertMany(logs);

    res.json({ loan, createdLogs: logs.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create MT loan" });
  }
}

// GET /fund/mtloan?userId=&loanId=
async function getMtLoanSummary(req, res) {
  try {
    const { userId, loanId } = req.query;
    const filter = loanId ? { _id: loanId } : (userId ? { userId } : {});
    const loans = await MtLoan.find(filter).lean();
    const loanIds = loans.map(l => l._id);

    const logs = await MtLoanLog.find({ loanId: { $in: loanIds } }).sort({ month: -1 }).lean();
    res.json({ loans, logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch MT loan summary" });
  }
}

// POST /fund/mtloan/:loanId/pay  body { paidAmount, month }
async function payMtLoanEmi(req, res) {
  try {
    const { loanId } = req.params;
    const { paidAmount, month } = req.body;
    if (!loanId || !paidAmount || !month) return res.status(400).json({ error: "Missing fields" });

    const loan = await MtLoan.findById(loanId);
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    // find log
    const log = await MtLoanLog.findOne({ loanId, month });
    if (!log) return res.status(404).json({ error: "EMI log not found" });

    if (log.status === "paid") return res.status(400).json({ error: "EMI already paid" });

    // mark paid
    log.status = "paid";
    log.paidDate = new Date();
    await log.save();

    // decrement loan remaining amount
    loan.remainingAmount = +(loan.remainingAmount - paidAmount).toFixed(2);
    if (loan.remainingAmount < 0) loan.remainingAmount = 0;
    await loan.save();

    res.json({ loan, paidLog: log });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to apply EMI payment" });
  }
}

// ---------- OWN LOAN (mirror of MT loan) ----------
async function createOwnLoan(req, res) {
  try {
    const { userId, principal, interestRate, tenureMonths, startDate } = req.body;
    if (!userId || !principal || !interestRate || !tenureMonths) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const parsedStart = startDate ? new Date(startDate) : new Date();
    const monthlyEMI = calculateEMI(principal, interestRate, tenureMonths);

    const totalPayable = +(monthlyEMI * tenureMonths).toFixed(2);
    const endDate = new Date(parsedStart);
    endDate.setMonth(endDate.getMonth() + tenureMonths - 1);

    const loan = await OwnLoan.create({
      userId, principal, interestRate, remainingAmount: totalPayable,
      tenureMonths, startDate: parsedStart, endDate, monthlyEMI
    });

    const logs = [];
    for (let i = 0; i < tenureMonths; i++) {
      const dt = new Date(parsedStart);
      dt.setMonth(dt.getMonth() + i);
      const monthStr = dt.toISOString().slice(0,7);
      logs.push({
        userId,
        loanId: loan._id,
        month: monthStr,
        emiAmount: monthlyEMI,
        status: "pending",
      });
    }
    await OwnLoanLog.insertMany(logs);

    res.json({ loan, createdLogs: logs.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create Own loan" });
  }
}

async function getOwnLoanSummary(req, res) {
  try {
    const { userId, loanId } = req.query;
    const filter = loanId ? { _id: loanId } : (userId ? { userId } : {});
    const loans = await OwnLoan.find(filter).lean();
    const loanIds = loans.map(l => l._id);

    const logs = await OwnLoanLog.find({ loanId: { $in: loanIds } }).sort({ month: -1 }).lean();
    res.json({ loans, logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Own loan summary" });
  }
}

async function payOwnLoanEmi(req, res) {
  try {
    const { loanId } = req.params;
    const { paidAmount, month } = req.body;
    if (!loanId || !paidAmount || !month) return res.status(400).json({ error: "Missing fields" });

    const loan = await OwnLoan.findById(loanId);
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    const log = await OwnLoanLog.findOne({ loanId, month });
    if (!log) return res.status(404).json({ error: "EMI log not found" });
    if (log.status === "paid") return res.status(400).json({ error: "EMI already paid" });

    log.status = "paid";
    log.paidDate = new Date();
    await log.save();

    loan.remainingAmount = +(loan.remainingAmount - paidAmount).toFixed(2);
    if (loan.remainingAmount < 0) loan.remainingAmount = 0;
    await loan.save();

    res.json({ loan, paidLog: log });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to apply Own EMI payment" });
  }
}

module.exports = {
  getShareFund, postShareTransaction,
  getThriftFund, postThriftTransaction,
  createMtLoan, getMtLoanSummary, payMtLoanEmi,
  createOwnLoan, getOwnLoanSummary, payOwnLoanEmi
};
