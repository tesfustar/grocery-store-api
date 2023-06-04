import mongoose from "mongoose";
import { ICanceledOrder } from "../types/CancelOrders";

const canceledOrderSchema = new mongoose.Schema<ICanceledOrder>(
  {
    order: { type: mongoose.SchemaTypes.ObjectId, ref: "Order" },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const CancelOrders = mongoose.model<ICanceledOrder>("CancelOrders", canceledOrderSchema);

export default CancelOrders;
