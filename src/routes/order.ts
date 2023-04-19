import express, { Router } from "express";
import {
  MakeOrder,
  GetAllMainWareHouseOrders,
  DeleteMainWareHouseOrder,
  GetDetailMainWareHouseOrder,
  GetMyOrders //for customers only authorized users only and not account banned by admin
} from "../controllers/OrderController";

const router: Router = express.Router();

router.post("/create", MakeOrder); //for user
router.get("/my-orders/:userId", GetMyOrders); //for user
router.get("/admin", GetAllMainWareHouseOrders); //for main ware house store
router.get("/admin/detail/:id", GetDetailMainWareHouseOrder); //for main ware house store detail of single order
router.delete("/admin/remove/:id", DeleteMainWareHouseOrder); //for main ware house delete order
export default router;
