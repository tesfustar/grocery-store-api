import  { ObjectId,Document } from "mongoose";
export interface INotification extends Document{
    user: ObjectId;
    title: string;
    message: string;
    readAt: Date;
  }