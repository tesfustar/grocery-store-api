import express, { Router } from "express";
import {
  GetOrderCountForHomePage
} from "../controllers/DeliveryController";

const router: Router = express.Router();


//these is routes for only deliver man only
router.get("/dashboard/:id", GetOrderCountForHomePage);


export default router;
