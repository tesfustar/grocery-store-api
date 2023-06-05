import express, { Router } from "express";
import {
  GetOrderCountForHomePage,
  GetAllPendingOrder,
  GetAllDeliveredOrder,
  GetAllOngoingOrder,
  GetAllCanceledOrder,
  AcceptOrderByDeliveryMan,
  CancelOrderByDeliveryMan,
  MarkUsDeliveredByDeliveryMan,
  GetOrderDetail
} from "../controllers/DeliveryController";

const router: Router = express.Router()


//these is routes for only deliver man only
router.get("/dashboard/:id", GetOrderCountForHomePage);
router.get("/pending/:id", GetAllPendingOrder);
router.get("/delivered/:id", GetAllDeliveredOrder);
router.get("/on-the-way/:id", GetAllOngoingOrder)
router.get("/canceled/:id", GetAllCanceledOrder);
router.get("/order-detail/:id", GetOrderDetail);
router.put("/accept/:id", AcceptOrderByDeliveryMan);
router.put("/cancel/:id", CancelOrderByDeliveryMan);
router.put("/delivered/:id", MarkUsDeliveredByDeliveryMan);
export default router;
