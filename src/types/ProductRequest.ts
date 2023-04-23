import { ObjectId ,Document} from "mongoose";

export enum ProductRequestStatus {
  PENDING = "PENDING",
  DELIVERED = "DELIVERED",
  ONGOING = "ONGOING",
}
export interface RequestedProduct {
  product: ObjectId;
  quantity: number;
}
export interface IProductRequest extends Document {
  product: RequestedProduct[];
  branch: ObjectId;
  status:ProductRequestStatus;
  isDelivered:boolean;
  deliveredDate:Date;
}
