import {  Document } from "mongoose";
export enum DiscountType {
  PERCENT = "PERCENT",
  FIXED = "FIXED",
}

export interface ICoupon extends Document{
  code: string;
  discount: number;
  discountType: DiscountType;
  description: string;
  expiresAt: Date;
  enabled: boolean;
}
