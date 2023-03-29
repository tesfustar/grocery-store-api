import express, { Router } from "express";
import { CreateStore, DeleteStoreItem } from "../controllers/StoreController";

const router: Router = express.Router();

router.post("/create", CreateStore); //for branch admin
router.delete("/remove/:id", DeleteStoreItem); //for branch admin

export default router;
