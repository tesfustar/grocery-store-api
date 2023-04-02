import express, { Router } from "express";
import {
  CreateCategory,
  updateCategory,
  DeleteCategory,
  GetCategories,
  GetCategoriesForAdmin
} from "../controllers/CategoryController";

const router: Router = express.Router();

router.post("/create", CreateCategory);
router.put("/find/:id", updateCategory);
router.delete("/find/remove/:id", DeleteCategory);
router.get("/", GetCategories); //for user not auth required
router.get("/admin", GetCategoriesForAdmin); //for super admin auth required
export default router;
