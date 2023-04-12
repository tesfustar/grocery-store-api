import express, { Router } from "express";
import {
  MakeOrder,
  GetAllMainWareHouseOrders,
  GetDetailMainWareHouseOrder
} from "../controllers/OrderController";

const router: Router = express.Router();

router.post("/create", MakeOrder); //for user
router.get("/admin", GetAllMainWareHouseOrders); //for main ware house store
router.get("/admin/detail/:id", GetDetailMainWareHouseOrder); //for main ware house store detail of single order
export default router;
