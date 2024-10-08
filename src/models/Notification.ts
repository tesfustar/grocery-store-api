import mongoose, { ObjectId } from "mongoose";
import { INotification } from "../types/Notification";
// import paginate from "mongoose-paginate-v2";

const notificationSchema = new mongoose.Schema<INotification>(
  {
    order: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Order",
      default: null,
    },
    productRequest: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "ProductRequest",
      default: null,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      default: null,
    },
    branch: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Branch",
      default: null,
    },
    isAdminNotification: { type: Boolean, default: false },
    title: { type: String },
    message: { type: String },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);
// notificationSchema.plugin(paginate);
const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default Notification;
