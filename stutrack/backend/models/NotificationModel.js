// backend/models/NotificationModel.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["leave", "attendance", "general"], default: "general" },
  emails: { type: [String], required: true },
  seenBy: { type: [String], default: [] }, // track which students have seen it
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);