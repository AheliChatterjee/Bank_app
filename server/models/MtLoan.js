// models/MtLoan.js
const mongoose = require("mongoose");

const MtLoanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  principal: { type: Number, required: true },
  interestRate: { type: Number, required: true }, // percent p.a.
  totalPayable: { type: Number, required: true }, // principal + interest (if precomputed)
  remainingAmount: { type: Number, required: true },
  tenureMonths: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  monthlyEMI: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("MtLoan", MtLoanSchema);
