const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, default: "" },
  // googleId : String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "BankAccount" }]
});

module.exports = mongoose.model("User", userSchema);
