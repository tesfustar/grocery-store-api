import mongoose from "mongoose";

interface OtpSchema {
  phone: number;
  code: string;
  isUsed: boolean;
  isForForget: boolean;
}
const otpSchema = new mongoose.Schema<OtpSchema>(
  {
    phone: { type: Number },
    code: { type: String },
    isUsed: { type: Boolean, default: false },
    isForForget: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Otp = mongoose.model<OtpSchema>("Otp", otpSchema);

export default Otp;
