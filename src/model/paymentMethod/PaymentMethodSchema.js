import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },

    name: {
      type: String,
      required: true,
      maxLength: 100,
      unique: true,
      index: 1,
    },
    description: {
      type: String,
      default: " ",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment-method", paymentSchema);
