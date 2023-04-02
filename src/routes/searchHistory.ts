import express, { Router } from "express";
import { GetSearchHistory } from "../controllers/SearchHistoryController";

const router: Router = express.Router();

router.get("/all", GetSearchHistory); //for user

export default router;
