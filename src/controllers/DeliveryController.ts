import { Request, Response } from "express";
import User from "../models/User";
import Notification from "../models/Notification";
import { UserRole } from "../types/User";
import Order from "../models/Order";
import CanceledOrders from "../models/CanceledOrders";
import { OrderStatus } from "../types/Order";
import { z } from "zod";
import mongoose from "mongoose";
import Branch from "../models/Branch";
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
    const ongoingOrders = await Order.find().countDocuments({
      status: OrderStatus.ONGOING,
      deliveryMan: id,
    });
    const canceledOrders = await CanceledOrders.find().countDocuments({
      user: id,
    });

    res.status(200).json({
      message: "success",
      data: { completedOrders, pendingOrders, ongoingOrders, canceledOrders },
    });
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

//get all ongoing orders
export const GetAllOngoingOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id, role: UserRole.DELIVERY });
    //check if the user is driver or not
    if (!user) return res.status(404).json({ message: "user not found" });
    const onTheWayOrders = await Order.find({
      status: OrderStatus.ONGOING,
      deliveryMan: id,
    });
    res.status(200).json({ message: "success", data: onTheWayOrders });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//get all canceled orders
export const GetAllCanceledOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id, role: UserRole.DELIVERY });
    //check if the user is driver or not
    if (!user) return res.status(404).json({ message: "user not found" });
    const canceledOrders = await CanceledOrders.find({
      user: id,
    }).populate("order");
    res.status(200).json({ message: "success", data: canceledOrders });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//accept order
export const AcceptOrderByDeliveryMan = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const orderSchema = z.object({
      order: z.string(),
    });
    const orderData = orderSchema.parse(req.body);
    const user = await User.findOne({ _id: id, role: UserRole.DELIVERY });
    //check if the user is driver or not
    if (!user) return res.status(404).json({ message: "user not found" });
    //check if the order is exist and is status is pending
    const isOrderExist = await Order.findById(orderData.order);
    if (!isOrderExist)
      return res.status(404).json({ message: "order not found" });
    const isOrderNotAccepted = await Order.findOne({
      status: OrderStatus.PENDING,
      deliveryMan: isOrderExist.deliveryMan,
    });

    if (!isOrderNotAccepted)
      return res
        .status(404)
        .json({ message: "order not found or order is already accepted" });

    // //assign to the delivery man
    const updateOrder = await Order.findByIdAndUpdate(
      orderData.order,
      { $set: { status: OrderStatus.ONGOING } },
      { new: true }
    );
    await Notification.create({
      isAdminNotification: true,
      order: orderData.order,
      title: `Order accepted`,
      message: `Delivery ${user?.firstName + user?.lastName} has accept #${
        orderData.order
      } order`,
    });

    //send notification to user
    await Notification.create({
      user: isOrderExist?.user,
      order: orderData.order,
      title: `Notification`,
      message: `Dear valued customer, we're excited to inform you that your order #${orderData.order} is on its way!`,
    });
    res.status(200).json({ message: "success", data: updateOrder });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//reject or cancel order
export const CancelOrderByDeliveryMan = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const orderSchema = z.object({
      order: z.string(),
    });
    const orderData = orderSchema.parse(req.body);
    const user = await User.findOne({ _id: id, role: UserRole.DELIVERY });
    //check if the user is driver or not
    if (!user) return res.status(404).json({ message: "user not found" });
    //check if the order is exist and is status is pending
    const isOrderExist = await Order.findById(orderData.order);
    if (!isOrderExist)
      return res.status(404).json({ message: "order not found" });
    const isOrderNotAccepted = await Order.findOne({
      status: OrderStatus.PENDING,
      deliveryMan: isOrderExist.deliveryMan,
    });
    if (!isOrderNotAccepted)
      return res
        .status(404)
        .json({ message: "order not found or order is already canceled" });

    //assign to the delivery man
    const updateOrder = await Order.findByIdAndUpdate(
      orderData.order,
      { $set: { deliveryMan: null } },
      { new: true }
    );
    //add to canceled order table
    const canceledOrder = await CanceledOrders.create({
      user: req.params.id,
      order: orderData.order,
    });
    //send to admin about order cancel
    await Notification.create({
      isAdminNotification: true,
      order: orderData.order,
      title: `Order Canceled`,
      message: `Delivery ${user?.firstName + user?.lastName} has canceled #${
        orderData.order
      } order`,
    });

    res
      .status(200)
      .json({ message: "success", data: updateOrder, canceledOrder });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//mark as delivered order
export const MarkUsDeliveredByDeliveryMan = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const orderSchema = z.object({
      order: z.string(),
    });
    const orderData = orderSchema.parse(req.body);
    const user = await User.findOne({ _id: id, role: UserRole.DELIVERY });
    //check if the user is driver or not
    if (!user) return res.status(404).json({ message: "user not found" });
    //check if the order is exist and is status is pending
    const isOrderExist = await Order.findById(orderData.order);
    if (!isOrderExist)
      return res.status(404).json({ message: "order not found" });
    const isOrderNotAccepted = await Order.findOne({
      status: OrderStatus.ONGOING,
      deliveryMan: isOrderExist.deliveryMan,
    });
    if (!isOrderNotAccepted)
      return res
        .status(404)
        .json({ message: "order not found or order is already canceled" });

    //assign to the delivery man
    const updateOrder = await Order.findByIdAndUpdate(
      orderData.order,
      { $set: { status: OrderStatus.DELIVERED } },
      { new: true }
    );
    //send notification to admin
    await Notification.create({
      isAdminNotification: true,
      order: orderData.order,
      title: `Order Delivered`,
      message: `order #${orderData.order} has been delivered by Delivery ${
        user?.firstName + user?.lastName
      } `,
    });

    //send notification to user
    await Notification.create({
      user: updateOrder?.user,
      order: orderData.order,
      title: `Notification`,
      message: `Dear valued customer, we're excited to inform you that your order #${orderData.order} is delivered !`,
    });
    res.status(200).json({ message: "success", data: updateOrder });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//get order detail
export const GetOrderDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id)
      .populate("products.product")
      .populate("user");
    if (!order) return res.status(400).json({ message: "order not found" });

    if (order.inMainWareHouse) {
      res.status(200).json({
        message: "success",
        data: order,
        location: {
          type: "Point",
          coordinates: [38.74720165804809, 9.022075072468796],
        },
      });
    } else {
      // find branch address
      const branch = await Branch.findOne({ branch: order.branch });
      res.status(200).json({
        message: "success",
        data: order,
        location: branch?.location,
      });
    }
  } catch (error) {
    res.status(500).json({ message: `Internal server error ${error}` });
  }
};
