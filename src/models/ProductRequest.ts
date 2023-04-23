import mongoose from "mongoose";
import {
  IProductRequest,
  ProductRequestStatus,
  RequestedProduct,
} from "../types/ProductRequest";

const requestedProductSchema = new mongoose.Schema<RequestedProduct>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const productRequestSchema = new mongoose.Schema<IProductRequest>({
  product: {
    type: [requestedProductSchema],
    required: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  status: {
    type: String,
    default: ProductRequestStatus.PENDING,
    enum: Object.values(ProductRequestStatus),
  },
  isDelivered: { type: Boolean, default: false },
  deliveredDate: { type: Date },
});

const ProductRequest = mongoose.model<IProductRequest>(
  "ProductRequest",
  productRequestSchema
);

export default ProductRequest;
