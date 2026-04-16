import mongoose from "mongoose";

const feesSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
      required: true,
      unique: true,
    },
    totalFees: {
      type: Number,
      default: 50000,
      required: true,
    },
    paidFees: {
      type: Number,
      default: 0,
    },
    remainingFees: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/* ================= AUTO CALCULATE REMAINING FEES ================= */
feesSchema.pre("save", function () {
  this.remainingFees =
    Number(this.totalFees || 0) - Number(this.paidFees || 0);

  if (this.remainingFees < 0) {
    this.remainingFees = 0;
  }
});

export default mongoose.model("Fees", feesSchema);