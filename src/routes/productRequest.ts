import express, { Router } from "express";
import {
  SendProductRequest,
  GetProductRequests,
  GetProductRequestDetail,
  GetBranchProductRequest,
  AcceptProductRequest,
  MarkAsDeliveredProductRequest
} from "../controllers/ProductRequestController";

import {
  VerifyTokenAndAdmin,
  verifyTokenAndBranchAdmin,
} from "../middlewares/Authorization";
const router: Router = express.Router();

router.post("/send", SendProductRequest); //by branches for main ware house
router.get("/all", VerifyTokenAndAdmin, GetProductRequests); //for main house
router.get("/detail/:id", VerifyTokenAndAdmin, GetProductRequestDetail); //for main house
router.put("/accept/:id", VerifyTokenAndAdmin, AcceptProductRequest); //for main house
router.put("/delivered/:id", verifyTokenAndBranchAdmin, MarkAsDeliveredProductRequest); //for main house

//branch managers route
router.get("/branch/:branchId", verifyTokenAndBranchAdmin, GetBranchProductRequest);
export default router;
