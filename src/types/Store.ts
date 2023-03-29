import { ObjectId } from "mongoose";
export interface IStore {
  product: ObjectId;
  branch: ObjectId;
  availableQuantity: number;
}
