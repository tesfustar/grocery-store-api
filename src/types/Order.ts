import  { ObjectId } from "mongoose";
export interface IOrder {
    user: ObjectId;
    phoneNo: string;
    name: string;
    products: Product[];
    amount: number;
    address: string;
    status: string;
  }

  interface Product {
    product: ObjectId;
    quantity: number;
  }
  