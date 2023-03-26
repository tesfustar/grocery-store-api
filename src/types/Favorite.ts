import  { ObjectId } from "mongoose";
export interface IFavorite {
    user: ObjectId;
    products: Array<ObjectId>;
  }