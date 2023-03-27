import mongoose, { ObjectId } from "mongoose";
import { IPayment } from "../types/Payment";
const paymentSchema = new mongoose.Schema<IPayment>(
  {
    order: { type: mongoose.SchemaTypes.ObjectId, ref: "Order" },
    name: { type: String, unique: true },
    nameAm: { type: String, unique: true },
    image: { type: [String] },
    description: { type: String },
    descriptionAm: { type: String },
    wholeSalePrice: { type: Number },
    availableQuantity: { type: Number },
    hasSpecialOffer: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;
