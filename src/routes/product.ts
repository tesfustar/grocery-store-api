import express, { Router } from "express";
import {
  CreateNewProduct,
  UpdateProduct,
  DeleteProduct,
  GetProducts,
  GetProductsForCustomers,
  GetProductsByCategory,
  GetProductsBySearch,
  GetSingleProduct,
  GetMostlyViewedProducts,
  GetTodaysPickProducts
} from "../controllers/ProductController";

const router: Router = express.Router();

router.post("/create", CreateNewProduct);
router.put("/find/:id", UpdateProduct);
router.get("/detail/:id", GetSingleProduct); //detail product for user no auth required
router.get("/mostly-viewed", GetMostlyViewedProducts); //detail product for user no auth required
router.get("/todays-deal", GetTodaysPickProducts); //detail product for user no auth required
router.delete("/find/remove/:id", DeleteProduct);
router.get("/", GetProducts); //for super admin admin
router.get("/user", GetProductsForCustomers); //for user not auth required
router.get("/user/category", GetProductsByCategory); //for user not auth required
router.get("/search", GetProductsBySearch); //for user not auth required
export default router;
