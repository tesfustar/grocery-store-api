import { Request, Response } from "express";
import { z } from "zod";
import Coupon from "../models/Coupon";
//create Coupon
export const CreateCoupon = async (req: Request, res: Response) => {
  try {
    const couponSchema = z.object({
      code: z.string(),
      discount: z.number(),
      discountType: z.string(),
      description: z.string(),
      expiresAt: z.string(),
      enabled: z.boolean(),
    });
    //first validate the  request before create
    const coupon = couponSchema.parse(req.body);
    const oldCoupon = await Coupon.findOne({ code: coupon.code });
    if (oldCoupon)
      return res
        .status(404)
        .json({ message: "coupon with the same code already exist" });
    const createCoupon = await Coupon.create(coupon);
    res.status(201).json({ message: "success", data: createCoupon });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//get banners for user require no auth
export const GetCouponForAdmin = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.find();
    res.status(200).json({ message: "success", data: coupon });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//update Coupon
export const UpdateCoupon = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    //first find the Coupon
    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ message: "coupon not found!" });
    //then update the coupon
    const updateCoupon = await Coupon.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ message: "success", data: updateCoupon });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//delete Coupon
export const DeleteCoupon = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    //first find the Coupon
    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ message: "coupon not found!" });
    await Coupon.findByIdAndDelete(id);
    res.status(500).json({ message: "Coupon deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};
