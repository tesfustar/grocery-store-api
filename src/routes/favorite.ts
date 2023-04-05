import express, { Router } from "express";
import { AddToFavorite,RemoveUserFavorite,GetUserFavorite } from "../controllers/FavoriteController";

const router: Router = express.Router();

router.get("/user/:id", GetUserFavorite); //for my favorites
router.put("/add/:id", AddToFavorite);
router.put("/remove/:id", RemoveUserFavorite);
export default router;
