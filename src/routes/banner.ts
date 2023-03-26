import express, { Router } from "express";
import {
  CreateBanner,
  UpdateBanner,
  DeleteBanner,
  GetBannerForCustomer,
  GetBannerForAdmin,
} from "../controllers/BannerController";

const router: Router = express.Router();

router.post("/create", CreateBanner);
router.put("/find/:id", UpdateBanner);
router.delete("/find/remove/:id", DeleteBanner);
router.get("/", GetBannerForCustomer); //for user not auth required
router.get("/admin", GetBannerForAdmin); //for admin auth required

export default router;
