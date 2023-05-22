import { ObjectId,Document } from "mongoose";
export enum UserRole {
  USER = "USER",
  DELIVERY = "DELIVERY",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  STORE_ADMIN = "STORE_ADMIN",
}


export interface IUserAddress{
  address?: string;
  location?: Number[];
}
export interface IUser extends Document {
  phone: number;
  email?: string;
  password: string;
  firstName: string;
  lastName: string;
  profile?: string;
  address?: IUserAddress[];
  otpVerified: boolean;
  isRegistered: boolean;
  role: UserRole;
  branch: ObjectId | null;
  isAccountHidden: boolean;  //active or deactivate account
}
