import mongoose from "mongoose";

interface categorySchema {
  name: string;
  nameAm: string;
  image: string;
}
const categorySchema = new mongoose.Schema<categorySchema>(
  {
    name: { type: String, unique: true  },
    nameAm: { type: String, unique: true  },
    image: { type: String },
  },
  { timestamps: true }
);

const Category = mongoose.model<categorySchema>("Category", categorySchema);

export default Category;
