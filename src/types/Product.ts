import  { ObjectId ,Document} from "mongoose";
export interface IProduct extends Document {
  category: ObjectId;
  name: string;
  nameAm: string;
  image: Array<string>;
  description: string;
  descriptionAm: string;
  price: number;
  priceType:string;
  hasSpecialOffer: boolean;
  isTodaysPick:boolean;
  view:number,
  isOutOfStock:boolean;
}