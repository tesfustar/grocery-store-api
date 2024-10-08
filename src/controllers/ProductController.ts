import { Request, Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import Product from "../models/Product";
import SearchHistory from "../models/SearchHistory";
import Category from "../models/Category";
import Store from "../models/Store";
import Order from "../models/Order";
//create new product

export const CreateNewProduct = async (req: Request, res: Response) => {
  try {
    const productSchema = z.object({
      category: z.string(),
      name: z.string(),
      nameAm: z.string(),
      image: z.string().array(),
      description: z.string(),
      descriptionAm: z.string(),
      price: z.number(),
      priceType: z.string(),
      hasSpecialOffer: z.boolean().optional(),
    });
    const productData = productSchema.parse(req.body);
    //validate the category is exist
    const category = await Category.findById(req.body.category);
    if (!category)
      return res.status(400).json({ message: "category does not exist!" });
    const createProduct = await Product.create(productData);
    res
      .status(201)
      .json({ message: "product created successfully", data: createProduct });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: `Internal server error ${error}` });
  }
};

//update product
export const UpdateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res
      .status(201)
      .json({ message: "product updated successfully", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
//get single product
export const GetSingleProductForAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate("category")
    res
      .status(200)
      .json({ message: "product updated successfully", data: product });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
//delete product
export const DeleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    //delete all products also in the branches
    await Store.deleteMany({ product: id });
    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//get products

export const GetProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json({ message: "success", data: products });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//for branches only
export const GetProductsForBranches = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json({ message: "success", data: products });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
//send paginated products to users no auth required
export const GetProductsForCustomers = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 3;

    const products = await Product.find() //sure before it is out of stock {isOutOfStock:false}
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / perPage);
    res.json({
      pagination: {
        products,
        page,
        perPage,
        totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//get products by category for customer no auth required

export const GetProductsByCategory = async (req: Request, res: Response) => {
  const { cat } = req.query;
  try {
    const products = await Product.find({ category: cat });
    res.status(200).json({ message: "success", data: products });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//search products
export const GetProductsBySearch = async (req: Request, res: Response) => {
  const query = req.query.q as string;
  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });
    const searchHistory = await SearchHistory.findOne({
      query: { $regex: query, $options: "i" },
    });
    if (products?.length > 0) {
      if (searchHistory) {
        await SearchHistory.findOneAndUpdate(
          { query: { $regex: query, $options: "i" } },
          { $inc: { count: 1 } },
          { upsert: true }
        );
      } else {
        SearchHistory.create({ query: query, count: 1 });
      }
    }
    res.status(200).json({ message: "success", data: products });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//get top searched Products
export const GetTopSearchProducts = async (req: Request, res: Response) => {
  try {
    // find the  single query that has large count
    const topSearchQuery = await SearchHistory.aggregate([
      {
        $group: {
          _id: "$query",
          count: { $sum: "$count" },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 0,
          query: "$_id",
          count: 1,
        },
      },
    ]);
    const topSearchProducts = await Product.find({
      $or: [
        { name: { $regex: topSearchQuery[0]?.query, $options: "i" } },
        { description: { $regex: topSearchQuery[0]?.query, $options: "i" } },
      ],
    });

    res.status(200).json({ message: "success", data: topSearchProducts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};
//get single product detail
export const GetSingleProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const productId = new mongoose.Types.ObjectId(id); // convert id to ObjectId
    const product = await Product.findById(id).populate("category");
    if (!product)
      return res.status(404).json({ message: "product  not found!" });
    //increase view
    product.view++;
    //  find related products on the same product
    const products = await Product.find();
    // const randomizeProducts = products
    //   .filter((product) => product._id == id)
    //   .map((value) => ({ value, sort: Math.random() }))
    //   .sort((a, b) => a.sort - b.sort)
    //   .map(({ value }) => value);

    //then save the product to increase the view count
    const savedProduct = await product.save();
    res.status(200).json({
      message: "success",
      product: savedProduct,
      relatedProducts: products,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//get mostly viewed products

export const GetMostlyViewedProducts = async (req: Request, res: Response) => {
  try {
    const mostlyViewedProducts = await Product.find()
      .populate("category")
      .sort({ view: -1 });
    res.status(200).json({ success: true, data: mostlyViewedProducts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//get today pick products for user no auth featured
export const GetTodaysPickProducts = async (req: Request, res: Response) => {
  try {
    const todayDealProducts = await Product.find({
      isTodaysPick: true,
    }).populate("category");
    res.status(200).json({ success: true, data: todayDealProducts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//get today pick products for user no auth
export const GetTodaysPickProductsForAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const todayDealProducts = await Product.find({
      isTodaysPick: true,
    }).populate("category");
    res.status(200).json({ success: true, data: todayDealProducts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//check the cart items of product

//update stock type out of stock
export const MakeProductOutOfStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    //check first the user product or not
    if (!product)
      return res.status(400).json({ message: "product not found !" });
    const isAlreadyOutOfStock = await Product.findOne({
      _id: id,
      isOutOfStock: true,
    });
    if (isAlreadyOutOfStock)
      return res
        .status(400)
        .json({ message: "product is already out of stock !" });
    const makeItInStock = await Product.findByIdAndUpdate(
      id,
      { $set: { isOutOfStock: true } },
      { new: true }
    );

    res.status(200).json({
      message: "success",
      data: makeItInStock,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//make it in stock
export const MakeProductInStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    //check first the user product or not
    if (!product)
      return res.status(400).json({ message: "product not found !" });
    const isAlreadyInStock = await Product.findOne({
      _id: id,
      isOutOfStock: false,
    });
    if (isAlreadyInStock)
      return res.status(400).json({ message: "product is already in stock !" });

    const makeItOutOfStockStock = await Product.findByIdAndUpdate(
      id,
      { $set: { isOutOfStock: false } },
      { new: true }
    );

    res.status(200).json({
      message: "success",
      data: makeItOutOfStockStock,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//for dashboard view get top sell products
export const GetTopSellProducts = async (req: Request, res: Response) => {
  try {
    const topProducts = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.product",
          soldQuantity: { $sum: "$products.quantity" },
        },
      },
      {
        $sort: { soldQuantity: -1 },
      },
      {
        $limit: 10,
      },
    ]);
    const topProductsDetails = await Product.find({
      _id: { $in: topProducts.map((p) => p._id) },
    });

    // Merge the soldQuantity field from the aggregate result with the product details
    // const topSellingProducts = topProductsDetails.map((p) => {
    //   const soldProduct = topProducts.find((sp) => sp._id.toString() === p._id.toString());
    //   return {
    //     ...p.toObject(),
    //     soldQuantity: soldProduct ? soldProduct.soldQuantity : 0,
    //   };
    // });
    res.status(200).json({ message: "success", data: topProductsDetails });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
//make it featured product todays deal
export const MakeProductFeatured = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    //check first the user product or not
    if (!product)
      return res.status(400).json({ message: "product not found !" });
    const isAlreadyFeatured = await Product.findOne({
      _id: id,
      isTodaysPick: true,
    });
    if (isAlreadyFeatured)
      return res
        .status(400)
        .json({ message: "product is already featured !" });
    const makeItFeatured = await Product.findByIdAndUpdate(
      id,
      { $set: { isTodaysPick: true } },
      { new: true }
    );

    res.status(200).json({
      message: "success",
      data: makeItFeatured,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//remove product from featured
export const RemoveProductFeatured = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    //check first the user product or not
    if (!product)
      return res.status(400).json({ message: "product not found !" });
    const isAlreadyNotFeatured = await Product.findOne({
      _id: id,
      isTodaysPick: false,
    });
    if (isAlreadyNotFeatured)
      return res
        .status(400)
        .json({ message: "product is already not featured!" });
    const removeFromFeatured = await Product.findByIdAndUpdate(
      id,
      { $set: { isTodaysPick: false } },
      { new: true }
    );

    res.status(200).json({
      message: "success",
      data: removeFromFeatured,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};