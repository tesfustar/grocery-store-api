import mongoose, { ObjectId } from "mongoose";

interface Role {
  _id: ObjectId;
  name: string;
}
interface User {
  phone: number;
  email?: string;
  password: string;
  firstName: string;
  lastName: string;
  profile?: string;
  location?: string;
  address: Number[];
  otpVerified: boolean;
  isRegistered: boolean;
  role:"USER" | "DELIVERY";
}
const userSchema = new mongoose.Schema<User>(
  {
    phone: { type: Number, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    profile: {
      type: String,
      default:
        "https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
    },
    location: { type: [Number] },
    address: { type: [Number] },
    otpVerified: { type: Boolean, default: false },
    isRegistered: { type: Boolean, default: false },
    role: { type: String, default:"USER" },
  },
  { timestamps: true }
);

const User = mongoose.model<User>("User", userSchema);

export default User;


// role: { type: mongoose.SchemaTypes.ObjectId, ref: "Role", default: {name:"USER"} },