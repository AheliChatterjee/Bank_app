// models/MtLoanLog.js
const mongoose = require("mongoose");

const MtLoanLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: "MtLoan", required: true },
  month: { type: String, required: true }, // e.g., "2025-01"
  emiAmount: { type: Number, required: true },
  status: { type: String, enum: ["paid", "pending"], default: "pending" },
  paidDate: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("MtLoanLog", MtLoanLogSchema);
