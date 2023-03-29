enum UserRole {
  USER = "USER",
  DELIVERY = "DELIVERY",
  ADMIN = "ADMIN",
}

export interface IUser {
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
  role:"USER" | "DELIVERY" | "ADMIN";
  // role: UserRole;
}

//   interface Role {
//     _id: ObjectId;
//     name: string;
//   }
