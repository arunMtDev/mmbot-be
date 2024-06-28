import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  getJWTToken(): string;
  comparePassword(password: string): Promise<boolean>;
}

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minlength: [8, "Password should be greater than 8 characters"],
      select: false,
    },
  },
  { timestamps: true }
);

adminSchema.pre<IAdmin>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
adminSchema.methods.getJWTToken = function (this: IAdmin): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRE || "1d",
  });
};

// Compare Password
adminSchema.methods.comparePassword = async function (
  this: IAdmin,
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
