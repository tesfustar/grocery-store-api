import mongoose, { ObjectId } from "mongoose";
// import paginate from "mongoose-paginate-v2";

interface NotificationSchema {
  user: ObjectId;
  title: string;
  message: string;
  readAt: Date;
}
const notificationSchema = new mongoose.Schema<NotificationSchema>(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String },
    message: { type: String },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);
// notificationSchema.plugin(paginate);
const Notification = mongoose.model<NotificationSchema>(
  "Notification",
  notificationSchema
);

export default Notification;
