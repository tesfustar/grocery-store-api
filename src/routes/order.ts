import express, { Router } from "express";
import {
  MakeOrder,
  GetAllMainWareHouseOrders,
  GetAllBranchOrders,
  DeleteMainWareHouseOrder,
  GetDetailMainWareHouseOrder,
  GetMyOrders, //for customers only authorized users only and not account banned by admin
  UpdateMainHouseOrderStatus,
  AssignDeliveryBoy,
  GetOrderDetailForCustomer,
  GetDetailBranchOrder,
  GetOrderStatusForAdmin
} from "../controllers/OrderController";

const router: Router = express.Router();

router.post("/create", MakeOrder); //for user
router.get("/my-orders/:userId", GetMyOrders); //for user
router.get("/my-orders/detail/:id", GetOrderDetailForCustomer); //for user
router.get("/admin", GetAllMainWareHouseOrders); //for main ware house store
router.get("/branch/:branchId", GetAllBranchOrders); //for branches branch admin only
router.get("/branch/detail/:id", GetDetailBranchOrder); //for branches branch admin only
router.get("/admin/detail/:id", GetDetailMainWareHouseOrder); //for main ware house store detail of single order
router.delete("/admin/remove/:id", DeleteMainWareHouseOrder); //for main ware house delete order
router.put("/admin/assign/:id", AssignDeliveryBoy); 
router.get("/admin/order-stat", GetOrderStatusForAdmin);  //for admin
export default router;
