import { ObjectId,Document } from "mongoose";
export interface IStore extends Document {
  product: ObjectId;
  branch: ObjectId;
  availableQuantity: number;
}
