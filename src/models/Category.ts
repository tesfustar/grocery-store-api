import mongoose from "mongoose";
import { ICategory } from "../types/Category";

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: { type: String, unique: true },
    nameAm: { type: String, unique: true },
    image: { type: String },
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
