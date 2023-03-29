import Product from "../models/Product";
import { Request, Response } from "express";
import { z } from "zod";
import Category from "../models/Category";
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
      wholeSalePrice: z.number(),
      availableQuantity: z.number(),
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

//delete product
export const DeleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//get products

export const GetProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json({ message: "success", data: products });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//send paginated products to users no auth required
export const GetProductsForCustomers = async (req: Request, res: Response) => {
  const options = {
    page: req.query.page,
    limit: 10,
    collation: {
      locale: "en",
    },
  };
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 2;

    const products = await Product.find()
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
    res.status(200).json({ message: "success", data: products });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};
