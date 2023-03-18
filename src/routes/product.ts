import express, { Router } from "express";
import {
  CreateNewProduct,
  UpdateProduct,
  DeleteProduct,
  GetProducts
} from "../controllers/ProductController";

const router: Router = express.Router();

router.post("/create", CreateNewProduct);
router.put("/find/:id", UpdateProduct);
router.delete("/find/remove/:id", DeleteProduct);
router.get("/", GetProducts); //for user not auth required

export default router;
