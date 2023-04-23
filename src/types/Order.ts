import { ObjectId, Document } from "mongoose";
export enum OrderStatus {
  PENDING = "PENDING",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
  ONGOING = "ONGOING",
}
export enum ShippingType {
  FREE = "FREE",
  EXPRESS = "EXPRESS",
  FLAT = "FLAT",
} 

export enum PaymentMethod {
  CASH = "CASH", //means payment on delivery
}
export interface IOrder extends Document{
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
  deliveryTime:string;
  inRejected:boolean;
  shippingType:ShippingType;
  paymentMethod:PaymentMethod
}

interface Product {
  product: ObjectId;
  quantity: number;
}
