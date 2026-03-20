import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true
  },

  fullName: {
    type: String,
    required: true
  },

  course: {
    type: String,
    required: true
  },

  checkIn: {
    type: Date
  },

  checkOut: {
    type: Date
  },

  date: {
    type: String
  }

}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);