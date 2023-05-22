import express, { Router } from "express";
import {
  GetOrderCountForHomePage,
  GetAllPendingOrder,
  GetAllDeliveredOrder
} from "../controllers/DeliveryController";

const router: Router = express.Router();


//these is routes for only deliver man only
router.get("/dashboard/:id", GetOrderCountForHomePage);
router.get("/pending/:id", GetAllPendingOrder)
router.get("/delivered/:id", GetAllDeliveredOrder);


export default router;
