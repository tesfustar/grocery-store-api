import mongoose, { ObjectId } from "mongoose";
import { IFavorite } from "../types/Favorite";

const favoriteSchema = new mongoose.Schema<IFavorite>(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    products: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema);

export default Favorite;
