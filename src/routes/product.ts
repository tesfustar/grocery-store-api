import express, { Router } from "express";
import {
  CreateNewProduct,
  UpdateProduct,
  DeleteProduct,
  GetProducts,
  GetProductsForCustomers,
  GetProductsByCategory
} from "../controllers/ProductController";

const router: Router = express.Router();

router.post("/create", CreateNewProduct);
router.put("/find/:id", UpdateProduct);
router.delete("/find/remove/:id", DeleteProduct);
router.get("/", GetProducts); //for admin
router.get("/user", GetProductsForCustomers); //for user not auth required
router.get("/user/category", GetProductsByCategory); //for user not auth required
export default router;
