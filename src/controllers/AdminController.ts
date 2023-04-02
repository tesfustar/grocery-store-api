import User from "../models/User";
import { Request, Response } from "express";
import Product from "../models/Product";
import Category from "../models/Category";
import order from "../models/Order";
import bcrypt from "bcryptjs";
import { z } from "zod";
import Branch from "../models/Branch";
//for dashboard view
export const GetAllCountInfo = async (req: Request, res: Response) => {
  try {
    const getAllCustomers = await User.countDocuments({ role: "USER" })
    const getAllDelIveries = await User.countDocuments({ role: "DELIVERY" })
    const getAllBranchAdmins = await User.countDocuments({ role: "STORE_ADMIN", branch: { $ne: null } });
    const getAllProducts = await Product.countDocuments()
    const getAllCategories = await Category.countDocuments()
    const getAllBranches = await Branch.countDocuments()
    const getAllOrders = await order.countDocuments()
    res.status(200).json({
      message: "success",
      data: {
        customers: getAllCustomers,
        deliveries: getAllDelIveries,
        branchAdmins: getAllBranchAdmins,
        products: getAllProducts,
        categories: getAllCategories,
        branches: getAllBranches,
        orders: getAllOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};
//get all customers

export const GetAllCustomers = async (req: Request, res: Response) => {
  try {
    const getCustomers = await User.find({ role: "USER" });
    res.status(201).json({ message: "success", data: getCustomers });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//get all branch admins
export const GetAllBranchAdmin = async (req: Request, res: Response) => {
  try {
    const getBranchAdmins = await User.find({ role: "STORE_ADMIN" }).populate(
      "branch"
    );
    res.status(201).json({ message: "success", data: getBranchAdmins });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};
//get all orders
export const GetAllDeliveries = async (req: Request, res: Response) => {
  try {
    const getDeliveries = await User.find({ role: "DELIVERY" });
    res.status(200).json({ message: "success", data: getDeliveries });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//create account for delivery man by default (with out phone verification)

export const CreateDeliveryMan = async (req: Request, res: Response) => {
  try {
    const deliverySchema = z.object({
      phone: z.number(),
      email: z.string().email(),
      password: z.string().min(6),
      firstName: z.string(),
      lastName: z.string(),
      location: z.number().array().optional(),
      address: z.string(),
      role: z.string(),
    });
    const deliveryData = deliverySchema.parse(req.body);
    //check if the phone number of email is already taken
    const phoneExist = await User.findOne({
      phone: deliveryData.phone,
      otpVerified: true,
      isRegistered: true,
    });
    if (phoneExist)
      return res.status(400).json({ message: "user already exist!" });
    const emailExist = await User.findOne({
      email: deliveryData.email,
      otpVerified: true,
      isRegistered: true,
    });
    if (emailExist)
      return res.status(400).json({ message: "emailExist already exist!" });
    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(deliveryData.password, salt);
    const createDeliveryMan = await User.create({
      ...deliveryData,
      password: hashedPassword,
      otpVerified: true,
      isRegistered: true,
    });
    res.status(201).json({ message: "success", data: createDeliveryMan });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//create account for branch manager admin man and assign branch to it (with out phone verification)

export const CreateBranchAdminMan = async (req: Request, res: Response) => {
  try {
    const branchManagerSchema = z.object({
      phone: z.number(),
      email: z.string().email(),
      password: z.string().min(6),
      firstName: z.string(),
      lastName: z.string(),
      location: z.number().array().optional(),
      address: z.string(),
      role: z.string(),
      branch: z.string().optional(),
    });
    const branchData = branchManagerSchema.parse(req.body);
    //check if the phone number of email is already taken
    const phoneExist = await User.findOne({
      phone: branchData.phone,
      otpVerified: true,
      isRegistered: true,
    });
    if (phoneExist)
      return res.status(400).json({ message: "user already exist!" });
    const emailExist = await User.findOne({
      email: branchData.email,
      otpVerified: true,
      isRegistered: true,
    });
    if (emailExist)
      return res.status(400).json({ message: "emailExist already exist!" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(branchData.password, salt);
    const createBranchManagerAdmin = await User.create({
      ...branchData,
      password: hashedPassword,
      otpVerified: true,
      isRegistered: true,
    });
    res
      .status(201)
      .json({ message: "success", data: createBranchManagerAdmin });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" + error });
  }
};
