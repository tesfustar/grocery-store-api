import { Request, Response } from "express";
import User from "../models/User";
import Otp from "../models/Otp";
import { z } from "zod";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

//registration endpoint
export const SignUp = async (req: Request, res: Response) => {
  try {
    const userSchema = z.object({
      phone: z.number(),
    });
    const userData = userSchema.parse(req.body);
    //check if user already exist

    const userExist = await User.findOne({
      phone: userData.phone,
      otpVerified: true,
      isRegistered: true,
    });
    if (userExist)
      return res.status(400).json({ message: "user already exist!" });
    //check if the user try to register before
    const unVerifiedUserExist = await User.findOne({
      phone: userData.phone,
      isRegistered: false,
    });
    var config = {
      method: "get",
      url: `https://api.geezsms.com/api/v1/sms/otp?token=${process.env.GEEZ_SMS_TOKEN}&phone=${req.body.phone}`,
      headers: {},
    };
    axios(config)
      .then(async function (response) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedOtp = await bcrypt.hash(
            JSON.stringify(response.data?.code),
            salt
          );

          await Otp.create({
            phone: userData.phone,
            code: hashedOtp,
          });
          //send otp code
          res.status(200).json({
            message: "OTP sent to your phone",
          });
        } catch (error) {
          res.status(400).json({ error: `error ${error}` });
        }
      })
      .catch(function (error) {
        res.status(403).json({ geezError: `error ${error}` });
      });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" });
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
    //find the otp first
    const userOtp = await Otp.findOne({
      phone: otpData.phone,
      isUsed: false,
      isForForget: false,
    }).sort({
      createdAt: -1,
    });
    //check if the otp exist and compare with user otp
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
        phone: req.body.phone,
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
    res.status(500).json({ message: "Internal server error" });
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
      location: z.number().optional(),
      address: z.string().array(),
    });
    const userData = userSchema.parse(req.body);
    const oldUser = await User.findOne({
      phone: userData.phone,
      otpVerified: true,
    });
    if (!oldUser)
      return res.status(400).json({ message: "you are not verified user!" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const address: any = await axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userData.address[1]},${userData.address[0]}&key=${process.env.GOOGLE_MAP_API_KEY}`
        // `https://maps.googleapis.com/maps/api/geocode/json?latlng=38.76486078990507,8.995699507506966&key=AIzaSyDd81MpJcxjNdICQeKRg3Emywp4e_29Sfc`
      )
      .then(async (response) => {
        const address =
          response.data.results[0].address_components[2].long_name;
        // console.log(address)
        const registeredUser = await User.findByIdAndUpdate(
          oldUser.id,
          {
            $set: {
              ...userData,
              password: hashedPassword,
              isRegistered: true,
              address:
                response.data.results[0]?.address_components[2]?.long_name,
            },
          },
          { new: true }
        );
        const token = jwt.sign(
          { phone: registeredUser?.phone, isAdmin: registeredUser?.role },
          process.env.JWT_KEY as Secret,
          {
            expiresIn: "24h",
          }
        );
        res.status(201).json({ result: registeredUser, token });
      })
      .catch((error) => {
        console.log(error);
      });
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

    const token = jwt.sign(
      {
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
    const oldUser = await User.findOne({
      phone: userData.phone,
      isRegistered: true,
    });
    if (!oldUser) return res.status(404).json({ message: "user not found!" });
    var config = {
      method: "get",
      url: `https://api.geezsms.com/api/v1/sms/otp?token=${process.env.GEEZ_SMS_TOKEN}&phone=${req.body.phone}`,
      headers: {},
    };

    axios(config)
      .then(async function (response) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedOtp = await bcrypt.hash(
            JSON.stringify(response.data?.code),
            salt
          );
          await Otp.create({
            phone: userData.phone,
            code: hashedOtp,
            isForForget: true,
          });
          res.status(200).json({
            message: "otp sent to your phone",
          });
        } catch (error) {
          res.status(400).json({ error: `error ${error}` });
        }
      })
      .catch(function (error) {
        res.status(400).json({ geezError: `error ${error}` });
      });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" });
  }
};

//then verify the otp for the forget password
export const VerifyOtpForForgetPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const otpSchema = z.object({
      phone: z.number(),
      code: z.string(),
    });
    const otpData = otpSchema.parse(req.body);
    const userOtp = await Otp.findOne({
      phone: otpData.phone,
      isUsed: false,
      isForForget: true,
    }).sort({
      createdAt: -1,
    });
    if (!userOtp) return res.status(403).json({ message: "Invalid gateway" });
    const isOtpCorrect = await bcrypt.compare(otpData.code, userOtp.code);
    if (!isOtpCorrect)
      return res.status(400).json({ message: "Invalid Otp code" });
    //then update the otp to be expired
    await Otp.findByIdAndUpdate(userOtp._id, { isUsed: true }, { new: true });
    res.status(200).json({
      message: "successfully verified",
    });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" });
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
