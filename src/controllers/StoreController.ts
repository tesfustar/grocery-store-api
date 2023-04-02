import { Request, Response } from "express";
import { z } from "zod";
import Branch from "../models/Branch";
import Store from "../models/Store";

//create store product by branch admin manager
export const CreateStore = async (req: Request, res: Response) => {
  try {
    const storeSchema = z.object({
      product: z.string(),
      branch: z.string(),
      availableQuantity: z.number()
    });
    //user input validation
    const storeData = storeSchema.parse(req.body);
    //first check if the store is already exist in that branch
    const storeItem = await Store.findOne({ product: storeData.product });
    //if it is exist update the available quantity
    if (storeItem) {
      const updateStoreItem = await Store.findOneAndUpdate(
        { product: storeData.product },
        { $set: storeData },
        { new: true }
      );
      res.status(200).json({ message: "success", data: updateStoreItem });
    } else {
      //it is not exist so create the product at that branch
      const createStoreItem = await Store.create(storeData);
      res.status(201).json({ message: "success", data: createStoreItem });
    }
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//delete store item by the store admin manager only

export const DeleteStoreItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const storeItem = await Store.findById(id);
    //check if the product exist
    if (!storeItem)
      return res.status(400).json({ message: "store product does no exist!" });
    //if it is exist delete it
    await Store.findByIdAndDelete(id);
    res.status(200).json({ message: "store product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};
