import express, { Router } from "express";
import {
  GetBranchProducts,StoreAdminDashboard
} from "../controllers/StoreAdminController";
import { verifyTokenAndBranchAdmin } from "../middlewares/Authorization";
const router: Router = express.Router();

// router.post("/create", CreateBranch); //for super admin
router.get("/dashboard/:branchId",verifyTokenAndBranchAdmin, StoreAdminDashboard); //for branch admin
router.get("/products/:branchId",verifyTokenAndBranchAdmin, GetBranchProducts); //for branch admin
export default router;
