import { Request, Response } from "express";
import User from "../models/User";
import { UserRole } from "../types/User";
import Order from "../models/Order";
import { OrderStatus } from "../types/Order";

//delivery app home page
export const GetOrderCountForHomePage = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id, role: UserRole.DELIVERY });
    //check if the user is driver or not
    if (!user) return res.status(404).json({ message: "user not found" });
    const completedOrders = await Order.find().countDocuments({
      status: OrderStatus.DELIVERED,
      deliveryMan: id,
    });
    const pendingOrders = await Order.find().countDocuments({
      status: OrderStatus.PENDING,
      deliveryMan: id,
    });

    res
      .status(200)
      .json({ message: "success", data: { completedOrders, pendingOrders } });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//get all pending orders
export const GetAllPendingOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id, role: UserRole.DELIVERY });
    //check if the user is driver or not
    if (!user) return res.status(404).json({ message: "user not found" });
    const pendingOrders = await Order.find({
      status: OrderStatus.PENDING,
      deliveryMan: id,
    });
    res.status(200).json({ message: "success", data: pendingOrders });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//get all delivered orders
export const GetAllDeliveredOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id, role: UserRole.DELIVERY });
    //check if the user is driver or not
    if (!user) return res.status(404).json({ message: "user not found" });
    const deliveredOrders = await Order.find({
      status: OrderStatus.DELIVERED,
      deliveryMan: id,
    });
    res.status(200).json({ message: "success", data: deliveredOrders });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};
