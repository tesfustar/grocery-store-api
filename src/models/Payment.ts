import mongoose, { ObjectId } from "mongoose";
import { IPayment } from "../types/Payment";
const paymentSchema = new mongoose.Schema<IPayment>(
  {
    type: { type: String, unique: true },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;
