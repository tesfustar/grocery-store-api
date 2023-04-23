import { ObjectId, Document } from "mongoose";
export interface IBanner extends Document{
    products?:ObjectId[],
    name:string;
    description:string;
    image:string;
}