import mongoose, { ObjectId } from "mongoose";

interface Product {
  product: ObjectId;
  quantity: number;
}

interface OrderSchema {
  user: ObjectId;
  phoneNo: string;
  name: string;
  products: Product[];
  amount: number;
  address: string;
  status: string;
}

const OrderSchema = new mongoose.Schema<OrderSchema>(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    phoneNo: { type: String },
    name: { type: String, required: true },
    products: [
      {
        product: { type: mongoose.SchemaTypes.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const order = mongoose.model<OrderSchema>("Order", OrderSchema);

export default order;
