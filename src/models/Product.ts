import mongoose, { ObjectId } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { IProduct } from "../types/Product";
const productSchema = new mongoose.Schema<IProduct>(
  {
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "Category"},
    name: { type: String , unique: true },
    nameAm: { type: String, unique: true  },
    image: { type: [String] },
    description: { type: String },
    descriptionAm: { type: String },
    wholeSalePrice: { type: Number },
    hasSpecialOffer: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.plugin(paginate)
const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
