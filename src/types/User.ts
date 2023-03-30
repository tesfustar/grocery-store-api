import { ObjectId } from "mongoose";
export enum UserRole {
  USER = "USER",
  DELIVERY = "DELIVERY",
  ADMIN = "ADMIN",
  STORE_ADMIN = "STORE_ADMIN",
}

export interface IUser {
  phone: number;
  email?: string;
  password: string;
  firstName: string;
  lastName: string;
  profile?: string;
  address?: string;
  location?: Number[];
  otpVerified: boolean;
  isRegistered: boolean;
  // role:"USER" | "DELIVERY" | "ADMIN";
  role: UserRole;
  branch: ObjectId | null;
}
