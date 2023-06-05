import { ObjectId, Document } from "mongoose";
export interface INotification extends Document {
  order: ObjectId;
  user: ObjectId;
  title: string;
  message: string;
  readAt: Date;
}
