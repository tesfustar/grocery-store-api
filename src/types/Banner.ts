import  { ObjectId } from "mongoose";
export interface IBanner{
    products?:ObjectId[],
    name:string;
    description:string;
    image:string;
}