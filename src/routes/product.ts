import express, { Router } from "express";
import {
  CreateNewProduct,
  UpdateProduct,
  GetSingleProductForAdmin,
  DeleteProduct,
  GetProducts,
  GetProductsForBranches, 
  GetProductsForCustomers,
  GetProductsByCategory,
  GetProductsBySearch,
  GetSingleProduct,
  GetMostlyViewedProducts,
  GetTodaysPickProducts,
  GetTopSellProducts,
  GetTodaysPickProductsForAdmin,
  GetTopSearchProducts,
  MakeProductInStock,
  MakeProductOutOfStock,
  MakeProductFeatured,
  RemoveProductFeatured
} from "../controllers/ProductController";


import { VerifyTokenAndAdmin,verifyTokenAndBranchAdmin } from "../middlewares/Authorization";
const router: Router = express.Router();


//admin only
router.post("/create",VerifyTokenAndAdmin, CreateNewProduct); //for admin only
router.put("/find/:id",VerifyTokenAndAdmin, UpdateProduct);
router.get("/find/:id",VerifyTokenAndAdmin, GetSingleProductForAdmin)
router.get("/admin",VerifyTokenAndAdmin, GetProducts); //for admin admin
router.delete("/find/remove/:id",VerifyTokenAndAdmin, DeleteProduct);
router.put("/in-stock/:id",VerifyTokenAndAdmin, MakeProductInStock);
router.put("/out-of-stock/:id",VerifyTokenAndAdmin, MakeProductOutOfStock);
router.get("/top-sell",VerifyTokenAndAdmin, GetTopSellProducts); 
router.get("/todays-deal/admin", GetTodaysPickProductsForAdmin); //todays deal products for super admin
router.put("/featured/:id", MakeProductFeatured);
router.put("/featured-remove/:id", RemoveProductFeatured); 
//for branch admins
router.get("/branches", GetProductsForBranches); //for branches
//user only
router.get("/detail/:id", GetSingleProduct); //detail product for user no auth required
router.get("/mostly-viewed", GetMostlyViewedProducts); //mostly product for user no auth required
router.get("/top-searched", GetTopSearchProducts); //top searched  product for user no auth required
router.get("/todays-deal", GetTodaysPickProducts); //todays deal products for user no auth required
router.get("/user", GetProductsForCustomers); //for user not auth required
router.get("/user/category", GetProductsByCategory); //for user not auth required
router.get("/search", GetProductsBySearch); //for user not auth required
export default router;
