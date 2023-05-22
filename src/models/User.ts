import mongoose, { ObjectId } from "mongoose";
import { IUser, IUserAddress, UserRole } from "../types/User";

const AddressSchema = new mongoose.Schema<IUserAddress>({
  location: { type: [Number] },
  address: { type: String },
});
const userSchema = new mongoose.Schema<IUser>(
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
    address: [AddressSchema],
    otpVerified: { type: Boolean, default: false },
    isRegistered: { type: Boolean, default: false },
    isAccountHidden: { type: Boolean, default: false },
    role: { type: String, default: UserRole.USER, enum: Object.keys(UserRole) },
    branch: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Branch",
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;

// role: { type: mongoose.SchemaTypes.ObjectId, ref: "Role", default: {name:"USER"} },
