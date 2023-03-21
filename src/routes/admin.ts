import express, { Router } from "express";
import {
  GetAllCustomers
} from "../controllers/AdminController";

const router: Router = express.Router();


router.get("/customers", GetAllCustomers); //for admin
export default router;
