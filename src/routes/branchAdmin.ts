import express, { Router } from "express";
import {
  GetBranchProducts,StoreAdminDashboard
} from "../controllers/StoreAdminController";

const router: Router = express.Router();

// router.post("/create", CreateBranch); //for super admin
router.get("/dashboard/:branchId", StoreAdminDashboard); //for branch admin
router.get("/products/:branchId", GetBranchProducts); //for branch admin
export default router;
