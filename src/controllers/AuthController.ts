import { Request, Response } from "express";
import User from "../models/User";
import Otp from "../models/Otp";
import { z } from "zod";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import {
  generateOTP,
  generateSalt,
  hashedOtpOrPassword,
} from "../utils/auth.config";
//registration endpoint
export const SignUp = async (req: Request, res: Response) => {
  try {
    const userSchema = z.object({
      phone: z.number(),
    });
    const userData = userSchema.parse(req.body);
    //check user is already exist
    let oldPhone = await User.findOne({
      phone: userData.phone,
      otpVerified: true,
      isRegistered: true,
    });
    if (oldPhone)
      return res.status(400).json({ message: "phone already exist" });
    //send sms
    const generatedOtp = generateOTP();
    const payload = {
      username: "Dama70314",
      password: `B/Y.w9.Ec:W_3Qh]Og^'D=2vfO94VB`,
      to: userData.phone,
      text: `Your Dama Verification code is ${generatedOtp}`,
    };
    const sms_otp = await axios.post(process.env.SMS_URL!, payload);
    const hashedOtp = await hashedOtpOrPassword(generatedOtp.toString());
    //hash and store otp
    await Otp.create({
      phone: userData.phone,
      code: hashedOtp,
    });
    res.status(200).json({ message: "otp sent to your phone" });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//verify otp

export const VerifyOtp = async (req: Request, res: Response) => {
  try {
    const otpSchema = z.object({
      phone: z.number(),
      code: z.string(),
    });
    const otpData = otpSchema.parse(req.body);

    //first find the otp
    const userOtp = await Otp.findOne({
      phone: otpData.phone,
      isUsed: false,
      isForForget: false,
    }).sort({
      createdAt: -1,
    });
    if (!userOtp) return res.status(403).json({ message: "Invalid gateway" });
    const isOtpCorrect = await bcrypt.compare(otpData.code, userOtp.code);

    if (!isOtpCorrect)
      return res.status(400).json({ message: "Invalid Otp code" });
    let oldPhone = await User.findOne({
      phone: otpData.phone,
      otpVerified: true,
      isRegistered: false,
    });
    if (!oldPhone) {
      const newUser = await User.create({
        phone: otpData.phone,
        otpVerified: true,
      });
      await Otp.findByIdAndUpdate(userOtp._id, { isUsed: true }, { new: true });
      res.status(200).json({
        message: "successfully verified",
        data: newUser._id,
      });
    } else {
      await Otp.findByIdAndUpdate(userOtp._id, { isUsed: true }, { new: true });
      res.status(200).json({
        message: "successfully verified",
        data: oldPhone._id,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//finish register
// //register user with full information
export const RegisterUser = async (req: Request, res: Response) => {
  try {
    const userSchema = z.object({
      phone: z.number(),
      email: z.string().email(),
      password: z.string().min(6),
      firstName: z.string(),
      lastName: z.string(),
    });
    const userData = userSchema.parse(req.body);
    const oldUser = await User.findOne({
      phone: userData.phone,
      otpVerified: true,
    });
    if (!oldUser)
      return res.status(400).json({ message: "you are not verified user!" });
    //check if the email is exist
    const isEmailExist = await User.findOne({
      email: userData.email,
    });
    if (isEmailExist)
      return res.status(400).json({ message: "email already exist!" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const registeredUser = await User.findByIdAndUpdate(
      oldUser.id,
      {
        $set: {
          ...userData,
          password: hashedPassword,
          isRegistered: true,
        },
      },
      { new: true }
    );
    const token = jwt.sign(
      {
        _id: oldUser._id,
        phone: oldUser.phone,
        role: oldUser.role,
      },
      process.env.JWT_KEY as Secret,
      {
        expiresIn: "30d",
      }
    );
    res.status(201).json({ result: registeredUser, token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong please try later!", error });
  }
};
//sign in for customers only
export const SignInForCustomer = async (req: Request, res: Response) => {
  try {
    const userSchema = z.object({
      phone: z.number(),
      password: z.string(),
    });
    const userData = userSchema.parse(req.body);

    const oldUser = await User.findOne({ phone: userData.phone });

    if (!oldUser)
      return res.status(403).json({ message: "User doesn't exist" });
    const isPasswordCorrect = await bcrypt.compare(
      userData.password,
      oldUser.password as string
    );

    if (!isPasswordCorrect)
      return res.status(403).json({ message: "Invalid password" });

    const token = jwt.sign(
      {
        _id: oldUser._id,
        phone: oldUser.phone,
        role: oldUser.role,
      },
      process.env.JWT_KEY as Secret,
      {
        expiresIn: "24h",
      }
    );

    res.status(200).json({ user: oldUser, token });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" });
  }
};

//sign in for delivery man
export const SignInForDelivery = async (req: Request, res: Response) => {
  try {
    const userSchema = z.object({
      phone: z.number(),
      password: z.string(),
    });
    const userData = userSchema.parse(req.body);

    const oldUser = await User.findOne({ phone: userData.phone });

    if (!oldUser)
      return res.status(403).json({ message: "User doesn't exist" });
    const isPasswordCorrect = await bcrypt.compare(
      userData.password,
      oldUser.password as string
    );

    if (!isPasswordCorrect)
      return res.status(403).json({ message: "Invalid password" });
    //check if the user is delivery
    if (oldUser.role !== "DELIVERY")
      return res
        .status(403)
        .json({ message: "You are not authorized to use this app!" });

        //check if the account is deactivated
        const isAccountDeActivated = await User.findOne({ phone: userData.phone,isAccountHidden:true });
        if (isAccountDeActivated)
        return res.status(403).json({ message: "you account is suspended please contact the admin" });
        const token = jwt.sign(
      {
        _id: oldUser._id,
        phone: oldUser.phone,
        role: oldUser.role,
      },
      process.env.JWT_KEY as Secret,
      {
        expiresIn: "24h",
      }
    );

    res.status(200).json({ user: oldUser, token });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" });
  }
};

//sign in for admin dashboard required to be admin or branch manager
export const SignInForDashboard = async (req: Request, res: Response) => {
  try {
    const userSchema = z.object({
      phone: z.number(),
      password: z.string(),
    });
    const userData = userSchema.parse(req.body);

    const oldUser = await User.findOne({
      phone: userData.phone,
      // isRegistered: true,
      // otpVerified: true,
    });

    if (!oldUser)
      return res.status(403).json({ message: "User doesn't exist" });
    const isPasswordCorrect = await bcrypt.compare(
      userData.password,
      oldUser.password as string
    );

    if (!isPasswordCorrect)
      return res.status(403).json({ message: "Invalid password" });
    //check if the user is delivery
    if (oldUser.role !== "ADMIN" && oldUser.role !== "STORE_ADMIN")
      return res
        .status(403)
        .json({ message: "You are not authorized to use this app!" });
    if (oldUser.role == "STORE_ADMIN" && !oldUser.branch)
      return res
        .status(403)
        .json({ message: "You are not assigned to any branch yet!" });
    //
    const token = jwt.sign(
      {
        _id: oldUser._id,
        phone: oldUser.phone,
        role: oldUser.role,
      },
      process.env.JWT_KEY as Secret,
      {
        expiresIn: "24h",
      }
    );

    res.status(200).json({ user: oldUser, token });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" });
  }
};

//forgot password
// first send phone number
export const ForgotPassword = async (req: Request, res: Response) => {
  try {
    const userSchema = z.object({
      phone: z.number(),
    });
    const userData = userSchema.parse(req.body);
    //check if user is exist or not
    const oldUser = await User.findOne({
      phone: userData.phone,
      otpVerified: true,
      isRegistered: true,
    });
    if (!oldUser) return res.status(404).json({ message: "user not found!" });
    //send otp sms
    const generatedOtp = generateOTP();
    const payload = {
      username: "Dama70314",
      password: `B/Y.w9.Ec:W_3Qh]Og^'D=2vfO94VB`,
      to: userData.phone,
      text: `${generatedOtp} is your Dama password reset code`,
    };
    const sms_otp = await axios.post(process.env.SMS_URL!, payload);
    const hashedOtp = await hashedOtpOrPassword(generatedOtp.toString());
    //hash and store otp
    await Otp.create({
      phone: userData.phone,
      code: hashedOtp,
      isForForget: true,
    });
    res.status(200).json({
      message: "otp sent to your phone",
    });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//then verify the otp for the forget password
export const VerifyOtpForForgetPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const userSchema = z.object({
      phone: z.number(),
      code: z.string(),
    });
    const userData = userSchema.parse(req.body);
    //find user otp
    const userOtp = await Otp.findOne({
      phone: userData.phone,
      isUsed: false,
      isForForget: true,
    }).sort({
      createdAt: -1,
    });
    if (!userOtp) return res.status(403).json({ message: "Invalid gateway" });
    //check if ot is correct
    const isOtpCorrect = await bcrypt.compare(userData.code, userOtp.code);

    if (!isOtpCorrect)
      return res.status(400).json({ message: "Invalid Otp code" });
    //update otp
    const updateOtp = await Otp.findByIdAndUpdate(
      userOtp._id,
      { isUsed: true },
      { new: true }
    );
    res.status(200).json({
      message: "successfully verified",
    });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//set new password after verify otp
export const SetNewPassword = async (req: Request, res: Response) => {
  try {
    const userSchema = z.object({
      phone: z.number(),
      password: z.string(),
    });
    const userData = userSchema.parse(req.body);
    const oldUser = await User.findOne({
      phone: userData.phone,
      isRegistered: true,
    });
    if (!oldUser)
      return res.status(400).json({ message: "you are not verified user!" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const updateUserPassword = await User.findByIdAndUpdate(
      oldUser.id,
      {
        $set: { password: hashedPassword },
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "your password is changed!", data: updateUserPassword });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" });
  }
};
