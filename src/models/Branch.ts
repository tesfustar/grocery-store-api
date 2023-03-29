import mongoose from "mongoose";
import { IBranch } from "../types/Branch";

const branchSchema = new mongoose.Schema<IBranch>(
  {
    name: { type: String, unique: true },
    address: { type: String },
    location: { type: [Number] },
  },
  { timestamps: true }
);

const Branch = mongoose.model<IBranch>("Branch", branchSchema);

export default Branch;
