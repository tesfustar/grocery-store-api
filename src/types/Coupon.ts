export enum DiscountType {
  PERCENT = "PERCENT",
  FIXED = "FIXED",
}

export interface ICoupon {
  code: string;
  discount: number;
  discountType: DiscountType;
  description: string;
  expiresAt: Date;
  enabled: boolean;
}
