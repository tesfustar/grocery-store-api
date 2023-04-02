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
  GetTodaysPickProducts,
  GetTodaysPickProductsForAdmin,
  GetTopSearchProducts
} from "../controllers/ProductController";

const router: Router = express.Router();

router.post("/create", CreateNewProduct);
router.put("/find/:id", UpdateProduct);
router.get("/detail/:id", GetSingleProduct); //detail product for user no auth required
router.get("/mostly-viewed", GetMostlyViewedProducts); //mostly product for user no auth required
router.get("/top-searched", GetTopSearchProducts); //top searched  product for user no auth required
router.get("/todays-deal", GetTodaysPickProducts); //todays deal products for user no auth required
router.get("/todays-deal/admin", GetTodaysPickProductsForAdmin); //todays deal products for super admin
router.delete("/find/remove/:id", DeleteProduct);
router.get("/admin", GetProducts); //for super admin admin
router.get("/user", GetProductsForCustomers); //for user not auth required
router.get("/user/category", GetProductsByCategory); //for user not auth required
router.get("/search", GetProductsBySearch); //for user not auth required
export default router;
