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
      default: 20000,
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

/* ================= AUTO CALCULATION ================= */
feesSchema.pre("save", function () {
  this.totalFees = Number(this.totalFees || 0);
  this.paidFees = Number(this.paidFees || 0);

  this.remainingFees = this.totalFees - this.paidFees;

  if (this.remainingFees < 0) this.remainingFees = 0;
});

export default mongoose.model("Fees", feesSchema);