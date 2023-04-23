import {  Document } from "mongoose";
export interface ICategory extends Document {
    name: string;
    nameAm: string;
    image: string;
  }