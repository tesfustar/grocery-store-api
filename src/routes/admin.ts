import express, { Router } from "express";
import {
  GetAllCustomers,
  GetAllBranchAdmin,
  GetAllCountInfo,
  GetAllDeliveries,
  CreateDeliveryMan,
  CreateBranchAdminMan,
  GetDetailAboutBranches,
  GetDetailAboutCustomer,
  GetDeliveryDetail,
} from "../controllers/AdminController";
import { VerifyTokenAndAdmin } from "../middlewares/Authorization";

const router: Router = express.Router();

router.get("/dashboard", VerifyTokenAndAdmin, GetAllCountInfo); //for  admin
router.get("/customers", VerifyTokenAndAdmin, GetAllCustomers); //for  admin
router.get("/branch-admins", VerifyTokenAndAdmin, GetAllBranchAdmin); //for  admin
router.get("/deliveries", VerifyTokenAndAdmin, GetAllDeliveries); //for  admin
router.get("/deliveries/:id", VerifyTokenAndAdmin, GetDeliveryDetail); //for  admin
router.post("/delivery/create", VerifyTokenAndAdmin, CreateDeliveryMan); //for  admin
router.post(
  "/branch-manager/create",
  VerifyTokenAndAdmin,
  CreateBranchAdminMan
); //for  admin
router.get(
  "/branch/detail/:branchId",
  VerifyTokenAndAdmin,
  GetDetailAboutBranches
); //for  admin
router.get(
  "/customer/detail/:userId",
  VerifyTokenAndAdmin,
  GetDetailAboutCustomer
); //for  admin

export default router;
