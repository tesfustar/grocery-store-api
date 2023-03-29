import mongoose from "mongoose";
import { IStore } from "../types/Store";

const storeSchema = new mongoose.Schema<IStore>(
  {
    product: { type: mongoose.SchemaTypes.ObjectId, ref: "Product" },
    branch: { type: mongoose.SchemaTypes.ObjectId, ref: "Branch" },
    availableQuantity: { type: Number },
  },
  { timestamps: true }
);

const Store = mongoose.model<IStore>("Store", storeSchema);

export default Store;
