import express, { Router } from "express";
import {
  GetUserProfile
} from "../controllers/UserController";

const router: Router = express.Router();

router.get("/profile/:id", GetUserProfile); //for user auth required

export default router;
