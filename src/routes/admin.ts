import express, { Router } from "express";
import {
  GetAllCustomers,
  GetAllCountInfo,
  GetAllDeliveries,
  CreateDeliveryMan
} from "../controllers/AdminController";

const router: Router = express.Router();


router.get("/dashboard", GetAllCountInfo); //for admin
router.get("/customers", GetAllCustomers); //for admin
router.get("/deliveries", GetAllDeliveries); //for admin
router.post("/delivery/create", CreateDeliveryMan); //for admin
export default router;
