import mongoose, { ObjectId } from "mongoose";

interface productSchema {
  category: ObjectId;
  name: string;
  nameAm: string;
  image: Array<string>;
  description: string;
  wholeSalePrice: number;
  availableQuantity: number;
  hasSpecialOffer: boolean;
}
const productSchema = new mongoose.Schema<productSchema>(
  {
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "Category" },
    name: { type: String },
    nameAm: { type: String },
    image: { type: [String] },
    description: { type: String },
    wholeSalePrice: { type: Number },
    availableQuantity: { type: Number },
    hasSpecialOffer: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model<productSchema>("Product", productSchema);

export default Product;
