import { Request, Response } from "express";
import { z } from "zod";
import Category from "../models/Category";
import Product from "../models/Product";
//create category
export const CreateCategory = async (req: Request, res: Response) => {
  try {
    const categorySchema = z.object({
      name: z.string(),
      nameAm: z.string(),
      image: z.string(),
    });
    //first validate the user request before create
    const category = categorySchema.parse(req.body);
    const createCategory = await Category.create(category);
    res.status(201).json({ message: "success", data: createCategory });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//update category

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    //first find the category
    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found!" });
    //then update the category
    const updateCategory = await Category.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ message: "success", data: updateCategory });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete category
export const DeleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    //first find the category
    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found!" });
    //then delete also all the products in that category also
    await Category.findByIdAndDelete(id);
    await Product.deleteMany({ category: id });
    res.status(200).json({ message: "category deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all category for the user
export const GetCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ message: "success", data: categories });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


//get all category for the super admin
export const GetCategoriesForAdmin = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ message: "success", data: categories });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};