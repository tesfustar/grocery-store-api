import mongoose, { ObjectId } from "mongoose";
import { DiscountType, ICoupon } from "../types/Coupon";

const couponSchema = new mongoose.Schema<ICoupon>(
  {
    code: { type: String,unique:true },
    discount: { type: Number },
    discountType: {
      type: String,
      default: DiscountType.FIXED,
      enum: Object.values(DiscountType),
    },
    description: { type: String },
    expiresAt: { type: Date },
    enabled: { type: Boolean },
  },
  { timestamps: true }
);

const Coupon = mongoose.model<ICoupon>("Coupon", couponSchema);

export default Coupon;
