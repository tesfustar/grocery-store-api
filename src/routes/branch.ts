import express, { Router } from "express";
import {
  GetBranches,
  CreateBranch,
  DeleteBranch,
} from "../controllers/BranchController";

const router: Router = express.Router();

router.post("/create", CreateBranch); //for super admin
router.delete("/remove/:id", DeleteBranch); //for super admin
router.get("/", GetBranches); //for super admin
export default router;
