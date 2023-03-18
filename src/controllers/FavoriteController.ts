import { Request, Response } from "express";
import User from "../models/User";
import Favorite from "../models/Favorite";
import * as z from "zod";

export const AddToFavorite = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { product } = req.body;
  try {
    const favoriteSchema = z.object({
      product: z.string(),
    });
    const productData = favoriteSchema.parse(req.body);
    const oldUser = await User.findById(id);
    if (!oldUser)
      return res.status(400).json({ message: "you are not verified user!" });
    //first find user favorite products
    const userFavorite = await Favorite.findById(id);
    if (userFavorite) {
      //then find if it is already exist or not
      const productId = userFavorite.products?.some((item) => item == product);
      if (productId)
        return res
          .status(400)
          .json({ message: "product is already in favorite" });
      //if not exist push it to the array
      userFavorite.products.push(product);
      const updatedUserFavorite = await Favorite.findByIdAndUpdate(
        id,
        userFavorite,
        { new: true }
      );
      res.status(200).json({
        success: true,
        data: updatedUserFavorite,
        message: "product added to favorite",
      });
    } else {
      //create the user favorite
      const createUserFavorite = new Favorite({
        _id: id,
        userId: id,
        properties: product,
      });
      const saveUserFavorite = await createUserFavorite.save();
      res.status(200).json({
        success: true,
        data: saveUserFavorite,
        message: "product added to favorite",
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" });
  }
};

//remove product from user favorite

export const removeUserFavorite = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { product } = req.body;
  try {
    const favoriteSchema = z.object({
      product: z.string(),
    });
    const productData = favoriteSchema.parse(req.body);
    const oldUser = await User.findById(id);
    if (!oldUser)
      return res.status(400).json({ message: "you are not verified user!" });
    const userFavorite = await Favorite.findById(id);
    if (!userFavorite)
      return res.status(400).json({ message: "you have no favorite at all!" });
    const productId = userFavorite.products?.some((item) => item == product);
    //check if it exist before remove it
    if (!productId)
      return res.status(400).json({ message: "product not found" });
    //the find the removed id
    const indexProperty = userFavorite.products.indexOf(product);
    userFavorite.products.splice(indexProperty, 1);
    const updatedUserFavorite = await Favorite.findByIdAndUpdate(
      id,
      userFavorite,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedUserFavorite });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" });
  }
};

//get user favorite
export const getUserFavorite = async (req: Request, res: Response) => {
  try {
    const userFavorite = await Favorite.findById(req.params.id).populate(
      "products"
    );
    if (!userFavorite)
      return res.status(400).json({ message: "you have no favorite at all!" });
    res.status(200).json({ success: true, data: userFavorite });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
