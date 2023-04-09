import express, { Router } from "express";
import {
  CreateCoupon,
  UpdateCoupon,
  DeleteCoupon,
  GetCouponForAdmin,
} from "../controllers/CouponController";

const router: Router = express.Router();

router.post("/create", CreateCoupon);
router.put("/find/:id", UpdateCoupon);
router.delete("/find/remove/:id", DeleteCoupon);
router.get("/", GetCouponForAdmin); //for user not auth required

export default router;
