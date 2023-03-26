import mongoose, { ObjectId } from "mongoose";
import { IOrder } from "../types/Order";




const OrderSchema = new mongoose.Schema<IOrder>(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    phoneNo: { type: String },
    products: [
      {
        product: { type: mongoose.SchemaTypes.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, default: "PENDING" },
  },
  { timestamps: true }
);

const order = mongoose.model<IOrder>("Order", OrderSchema);

export default order;
