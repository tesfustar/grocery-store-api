import mongoose from "mongoose";

interface RoleSchema {
  name: string;
  code: string;
  isUsed: boolean;
  isForForget: boolean;
}
const roleSchema = new mongoose.Schema<RoleSchema>(
  {
    name: { type: String },
  },
  { timestamps: true }
);
roleSchema.pre("save", function (next) {
  this.name = this.name.toUpperCase();
  next();
});

const Otp = mongoose.model<RoleSchema>("Role", roleSchema);

export default Otp;
