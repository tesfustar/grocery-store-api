import  { ObjectId,Document } from "mongoose";
export interface IFavorite extends Document{
    user: ObjectId;
    products: Array<ObjectId>;
  }