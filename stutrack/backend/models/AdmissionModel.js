import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    college: {
      type: String,
    },

    course: {
      type: String,
    },

    duration: {
      type: String,
    },

    address: {
      type: String,
    },

    dob: { type: String },
    marks: { type: String },
    passingYear: { type: String },
    fees: { type: String },

    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Admission", admissionSchema);