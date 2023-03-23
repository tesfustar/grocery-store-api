import User from "../models/User";
import { Request, Response } from "express";
import Product from "../models/Product";
import Category from "../models/Category";
import order from "../models/Order";

//for dashboard view
export const GetAllCountInfo = async (req: Request, res: Response) => {
  try {
    const getAllCustomers = await User.find({ role: "USER" }).count();
    const getAllDelIveries = await User.find({ role: "DELIVERY" }).count();
    const getAllProducts = await Product.find().count();
    const getAllCategories = await Category.find().count();
    const getAllOrders = await order.find().count();
    res.status(200).json({
      message: "success",
      data: {
        customers: getAllCustomers,
        deliveries: getAllDelIveries,
        products: getAllProducts,
        categories: getAllCategories,
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

//get all orders
export const GetAllDeliveries = async (req: Request, res: Response) => {
  try {
    const getDeliveries = await User.find({ role: "DELIVERY" });
    res.status(201).json({ message: "success", data: getDeliveries });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};
