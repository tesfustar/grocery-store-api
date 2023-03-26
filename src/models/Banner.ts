import mongoose from "mongoose";
import { IBanner } from "../types/Banner";

const bannerSchema = new mongoose.Schema<IBanner>(
  {
    products: { type: [mongoose.SchemaTypes.ObjectId], ref: "Product" },
    name: { type: String, unique: true },
    image: { type: String },
  },
  { timestamps: true }
);

const Banner = mongoose.model<IBanner>("Banner", bannerSchema);

export default Banner;
