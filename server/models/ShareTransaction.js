// models/ShareTransaction.js
const mongoose = require("mongoose");

const ShareTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true }, // positive deposit, negative withdrawal
  type: { type: String, enum: ["deposit", "withdrawal"], required: true },
  month: { type: String, required: true }, // e.g., "2025-01"
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("ShareTransaction", ShareTransactionSchema);
