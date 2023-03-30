import express, { Router } from "express";
import {
  GetAllCustomers,
  GetAllCountInfo,
  GetAllDeliveries,
  CreateDeliveryMan,
  CreateBranchAdminMan,
} from "../controllers/AdminController";

const router: Router = express.Router();

router.get("/dashboard", GetAllCountInfo); //for super admin
router.get("/customers", GetAllCustomers); //for super admin
router.get("/deliveries", GetAllDeliveries); //for super admin
router.post("/delivery/create", CreateDeliveryMan); //for super admin
router.post("/branch-manager/create", CreateBranchAdminMan); //for super admin
export default router;
