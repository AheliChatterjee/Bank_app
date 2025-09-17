import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ['mt','own'], required: true },
    principal : { type: Number, required: true },
    interestRate: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    durationMonths: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
});

export default mongoose.model("Loan", loanSchema);