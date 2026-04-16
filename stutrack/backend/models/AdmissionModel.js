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

    college: String,
    course: String,
    duration: String,
    address: String,

    // ✅ BLOOD GROUP
    bloodGroup: {
      type: String,
    },

    photo: {
      type: String,
      default: "",
    },

    dob: String,
    marks: String,
    passingYear: String,
    fees: String,

    otp: String,
    otpExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Admission", admissionSchema);