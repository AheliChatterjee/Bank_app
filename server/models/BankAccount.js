

// models/FundTransaction.js
const mongoose = require("mongoose");

const fundTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fundType: { type: String, enum: ["SHARE", "THRIFT", "MTLOAN", "OWNLOAN"] },
  amount: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FundTransaction", fundTransactionSchema);


