import {  Document,objectId } from "mongoose";
export interface ICanceledOrder extends Document {
    order: objectId;
    user:objectId
  }