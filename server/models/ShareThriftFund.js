import mongoose from "mongoose";
import user from "./user";
 const fundSchema = new mongoose.Schema({
    userId : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ['share',"thrift"], required: true },
    amount: { type: Number, required: true },
    date : { type: Date, default: Date.now },
 });

 export default mongoose.model("ShareThriftFund", fundSchema);

 