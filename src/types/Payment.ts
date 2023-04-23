import  { ObjectId,Document } from "mongoose";
export interface IPayment extends Document {
  type: string;

}