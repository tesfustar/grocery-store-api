import Product from "../models/Product";
import { Request, Response } from "express";
import { z } from "zod";
//create new product

export const CreateNewProduct = async (req: Request, res: Response) => {
  try {
    const productSchema = z.object({
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

    const createProduct = await Product.create(productData);
    res
      .status(201)
      .json({ message: "product created successfully", data: createProduct });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" });
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
    res.status(201).json({ message: "product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//get
