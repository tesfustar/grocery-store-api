import express, { Router } from "express";
import { MakeOrder } from "../controllers/OrderController";

const router: Router = express.Router();

router.post("/create", MakeOrder); //for user

export default router;
