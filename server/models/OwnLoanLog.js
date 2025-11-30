// models/OwnLoanLog.js
const mongoose = require("mongoose");

const OwnLoanLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: "OwnLoan", required: true },
  month: { type: String, required: true },
  emiAmount: { type: Number, required: true },
  status: { type: String, enum: ["paid", "pending"], default: "pending" },
  paidDate: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("OwnLoanLog", OwnLoanLogSchema);
