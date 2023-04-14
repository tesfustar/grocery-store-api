import express, { Router } from "express";
import {
  GetUserProfile,
  DeActivateDeliveryOrBranchAdminManAccount,
  ActivateDeliveryOrBranchAdminAccount,
  DeleteDeliveryOrBranchAdminAccount,
} from "../controllers/UserController";
import { VerifyTokenAndAdmin } from "../middlewares/Authorization";
const router: Router = express.Router();

//admin

router.put(
  "/deactivate/:id",
  VerifyTokenAndAdmin,
  DeActivateDeliveryOrBranchAdminManAccount
); //for user auth required
router.put(
  "/activate/:id",
  VerifyTokenAndAdmin,
  ActivateDeliveryOrBranchAdminAccount
); //for user auth required
router.delete(
  "/remove/:id",
  VerifyTokenAndAdmin,
  DeleteDeliveryOrBranchAdminAccount
); //for user auth required
//user

router.get("/profile/:id", GetUserProfile); //for user auth required

export default router;
