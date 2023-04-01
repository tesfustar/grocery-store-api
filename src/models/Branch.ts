import mongoose from "mongoose";
import { IBranch } from "../types/Branch";

const branchSchema = new mongoose.Schema<IBranch>(
  {
    name: { type: String, unique: true },
    address: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true }
);

branchSchema.index({ location: '2dsphere' });
const Branch = mongoose.model<IBranch>("Branch", branchSchema);

export default Branch;
