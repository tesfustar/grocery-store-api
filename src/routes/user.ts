import express, { Router } from "express";
import {
  GetUserProfile,
  AddNewAddress,
  RemoveUserAddress,
  DeActivateDeliveryOrBranchAdminManAccount,
  ActivateDeliveryOrBranchAdminAccount,
  DeleteDeliveryOrBranchAdminAccount,
  GetUserAddress,
  UpdateUserProfile
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
router.get("/address/:id", GetUserAddress);  //get own address
router.put("/address/add/:id", AddNewAddress); //add new address for customers
router.put("/address/remove/:id", RemoveUserAddress); //add new address for customers
router.put("/profile/update/:id", UpdateUserProfile); //add new address for customers
export default router;
