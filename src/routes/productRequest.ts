import express, { Router } from "express";
import {
  SendProductRequest,
  GetProductRequests,
  GetProductRequestDetail
} from "../controllers/ProductRequestController";

import { VerifyTokenAndAdmin } from "../middlewares/Authorization";
const router: Router = express.Router();

router.post("/send", SendProductRequest);//by branches for main ware house
router.get("/all", VerifyTokenAndAdmin, GetProductRequests); //for main house
router.get("/detail/:id", VerifyTokenAndAdmin, GetProductRequestDetail); //for main house
export default router;
