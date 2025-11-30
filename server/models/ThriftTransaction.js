// models/ThriftTransaction.js
const mongoose = require("mongoose");

const ThriftTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["deposit", "withdrawal"], required: true },
  year: { type: String, required: true }, // e.g., "2025"
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("ThriftTransaction", ThriftTransactionSchema);
