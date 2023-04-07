import { ObjectId } from "mongoose";
export interface IOrder {
  branch: ObjectId;
  user: ObjectId;
  phoneNo: string;
  name: string;
  products: Product[];
  totalPrice: number;
  address: Number[];
  status: string;
}

interface Product {
  product: ObjectId;
  quantity: number;
}
