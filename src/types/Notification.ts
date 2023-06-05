import { ObjectId, Document } from "mongoose";
export interface INotification extends Document {
  order?: ObjectId;
  productRequest?: ObjectId;
  branch?: ObjectId;
  user: ObjectId;
  title: string;
  message: string;
  isAdminNotification?:boolean;
  readAt: Date;
}
