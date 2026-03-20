// backend/models/LeaveModel.js
import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  seenByStudent: { type: Boolean, default: false }, // for bell dot
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Leave", leaveSchema);