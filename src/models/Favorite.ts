import mongoose, { ObjectId } from "mongoose";

interface FavoriteSchema {
  user: ObjectId;
  products: Array<ObjectId>;
}
const favoriteSchema = new mongoose.Schema<FavoriteSchema>(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    products: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const Favorite = mongoose.model<FavoriteSchema>("Favorite", favoriteSchema);

export default Favorite;
