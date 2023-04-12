import mongoose, { ObjectId } from "mongoose";
import {
  IOrder,
  OrderStatus,
  PaymentMethod,
  ShippingType,
} from "../types/Order";

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    branch: { type: mongoose.SchemaTypes.ObjectId, ref: "Branch" },
    inMainWareHouse: { type: Boolean, default: false },
    phoneNo: { type: String },
    products: [
      {
        product: { type: mongoose.SchemaTypes.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalPrice: { type: Number, required: true },
    address: { type: [Number], required: true },
    deliveryTime: { type: String, required: true },
    status: {
      type: String,
      default: OrderStatus.PENDING,
      enum: Object.values(OrderStatus),
    },
    deliveryMan: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    shippingType: {
      type: String,
      default: ShippingType.FLAT,
      enum: Object.values(ShippingType),
    },
    paymentMethod: {
      type: String,
      default: PaymentMethod.CASH,
      enum: Object.values(PaymentMethod),
    },
  },
  { timestamps: true }
);

OrderSchema.pre("validate", function (next) {
  if (!this.branch) {
    this.inMainWareHouse = true;
  }
  next();
});

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
