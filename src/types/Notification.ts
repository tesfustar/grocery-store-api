import  { ObjectId } from "mongoose";
export interface INotification {
    user: ObjectId;
    title: string;
    message: string;
    readAt: Date;
  }