import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },

    college: String,
    course: String,
    duration: String,
    address: String,

    bloodGroup: String,
    photo: { type: String, default: "" },

    dob: String,
    marks: String,
    passingYear: String,

    otp: String,
    otpExpiry: Date,

    /* ================= FEES FIX (IMPORTANT) ================= */
    totalFees: { type: Number, default: 0 },
    paidFees: { type: Number, default: 0 },
    remainingFees: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Admission", admissionSchema);