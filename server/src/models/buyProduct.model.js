import mongoose from "mongoose";

const buyProductSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
    },
    payment_gateway: {
      type: String,
      required: true,
      enum: ["esewa", "khalti", "Cash"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const BuyProducts = mongoose.model("BuyProduct", buyProductSchema);
export default BuyProducts;
