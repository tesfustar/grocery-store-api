import express, { Router } from "express";
import {
  GetOrderCountForHomePage
} from "../controllers/DeliveryController";

const router: Router = express.Router();

router.get("/dashboard/:id", GetOrderCountForHomePage);


export default router;
