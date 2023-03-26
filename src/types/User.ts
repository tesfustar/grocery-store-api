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
  }

//   interface Role {
//     _id: ObjectId;
//     name: string;
//   }
  