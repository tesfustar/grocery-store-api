import { ObjectId } from "mongoose";
export enum OrderStatus {
  PENDING = "PENDING",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
  ONGOING = "ONGOING",
}

export interface IOrder {
  branch: ObjectId;
  inMainWareHouse:boolean;
  user: ObjectId;
  phoneNo: string;
  name: string;
  products: Product[];
  totalPrice: number;
  address: Number[];
  status: OrderStatus;
  deliveryMan: ObjectId;
  inRejected:boolean;
}

interface Product {
  product: ObjectId;
  quantity: number;
}
