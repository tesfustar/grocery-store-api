import express, { Router } from "express";
import {
  MakeOrder,
  GetAllMainWareHouseOrders,
} from "../controllers/OrderController";

const router: Router = express.Router();

router.post("/create", MakeOrder); //for user
router.get("/admin", GetAllMainWareHouseOrders); //for main ware house store
export default router;
