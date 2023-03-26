import  { ObjectId } from "mongoose";
export interface IProduct {
  category: ObjectId;
  name: string;
  nameAm: string;
  image: Array<string>;
  description: string;
  descriptionAm: string;
  wholeSalePrice: number;
  availableQuantity: number;
  hasSpecialOffer: boolean;
}