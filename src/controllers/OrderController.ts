import User from "../models/User";
import { Request, Response } from "express";
import Product from "../models/Product";
import order from "../models/Order";
import { z } from "zod";
import Branch from "../models/Branch";
import Store from "../models/Store";
import Order from "../models/Order";
import { ObjectId } from "mongoose";
import { ShippingType, PaymentMethod } from "../types/Order";
import { OrderStatus } from "../types/Order";
//make order

export const MakeOrder = async (req: Request, res: Response) => {
  try {
    const products = z.object({ product: z.string(), quantity: z.number() });
    const orderSchema = z.object({
      user: z.string(),
      phoneNo: z.number(),
      products: products.array().min(1),
      address: z.number().array().max(2),
      totalPrice: z.number(),
      deliveryTime: z.string(),
      shippingType: z.nativeEnum(ShippingType),
      paymentMethod: z.nativeEnum(PaymentMethod),
    });
    const orderBody = orderSchema.parse(req.body);
    //first check if user is verified and exist and not banned by admin
    const user = await User.findOne({
      _id: orderBody.user,
      isRegistered: true,
    });
    if (!user)
      return res.status(200).json({ message: "you are not verified user" });
    //check if user account is hidden
    const isAccountBanned = await User.findOne({
      _id: orderBody.user,
      isAccountHidden: true,
    });
    if (isAccountBanned)
      return res
        .status(200)
        .json({ message: "you can't order now! your account is banned!" });
    //then find each product exist or not
    // for (const product of orderBody.products) {
    // }
    const isProductExist = orderBody.products.some(async ({ product }) => {
      return await Product.findById(product);
    });
    console.log(isProductExist);
    //find near branch from user location
    const nearestBranches = await Branch.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [orderBody.address[0], orderBody.address[1]],
          },
          distanceField: "distance",
          spherical: true,
        },
      },
    ]).exec();
    let isOrderCreated = false;
    let orderedBranchName = "";
    for (const branch of nearestBranches) {
      const branchStores = await Store.find({ branch: branch._id }).exec();
      let isBranchSuitable = true;
      for (const orderItem of req.body.products) {
        const storeItem = branchStores.find(
          (store) => store.product == orderItem.product
        );
        if (!storeItem || storeItem.availableQuantity < orderItem.quantity) {
          isBranchSuitable = false;
          break;
        }
      }
      if (isBranchSuitable) {
        orderedBranchName = branch.name;
        //create the order in that branch
        await Order.create({
          ...orderBody,
          branch: branch._id,
        });
        // console.log(branch);
        isOrderCreated = true;
        break;
      }
    }

    if (isOrderCreated) {
      //means product found in nearest branch
      res
        .status(200)
        .json({ message: `Order created in branch ${orderedBranchName}` });
    } else {
      //make the order in the main warehouse
      await Order.create(orderBody);
      res.status(200).json({
        message: "Order created in main warehouse",
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: `Internal server error ${error}` });
  }
};

//get all orders for main warehouse admin
export const GetAllMainWareHouseOrders = async (
  req: Request,
  res: Response
) => {
  try {
    const getAllOrders = await Order.find({ inMainWareHouse: true }).populate(
      "user"
    );
    res.status(200).json({ message: "success", data: getAllOrders });
  } catch (error) {
    res.status(500).json({ message: `Internal server error ${error}` });
  }
};

//get detail for main warehouse admin
export const GetDetailMainWareHouseOrder = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const order = await Order.findOne({ _id: id, inMainWareHouse: true });
    if (!order) return res.status(400).json({ message: "order not found" });
    const singleOrder = await Order.findOne({
      _id: id,
      inMainWareHouse: true,
    })
      .populate("products.product")
      .populate("user");
    res.status(200).json({ message: "success", data: singleOrder });
  } catch (error) {
    res.status(500).json({ message: `Internal server error ${error}` });
  }
};

//delete order

export const DeleteMainWareHouseOrder = async (req: Request, res: Response) => {
  //first check order exist or not
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: "order not found!" });
  await Order.findByIdAndDelete(id);
  res.status(200).json({ message: "order deleted successfully" });
  try {
  } catch (error) {
    res.status(500).json({ message: `Internal server error ${error}` });
  }
};

//get list of orders for customer
export const GetMyOrders = async (req: Request, res: Response) => {
  //first check order exist or not
  const { userId } = req.params;
  const order = await Order.findOne({ user: userId });
  if (!order)
    return res.status(404).json({ message: "you have't any order yet!'" });
  const pendingOrders = await Order.find({
    user: userId,
    status: OrderStatus.PENDING,
  });
  const canceledOrders = await Order.find({
    user: userId,
    status: OrderStatus.CANCELED,
  });
  const deliveredOrders = await Order.find({
    user: userId,
    status: OrderStatus.DELIVERED,
  });
  res.status(200).json({
    message: "success",
    data: {
      pending: pendingOrders,
      canceled: canceledOrders,
      delivered: deliveredOrders,
    },
  });
  try {
  } catch (error) {
    res.status(500).json({ message: `Internal server error ${error}` });
  }
};

//get branches order only for branches
export const GetAllBranchOrders = async (req: Request, res: Response) => {
  const { branchId } = req.params;
  try {
    const isBranchExist = await Branch.findById(branchId);
    if (!isBranchExist)
      return res.status(404).json({ message: "branch not found!" });
    const getAllBranchOrders = await Order.find({
      inMainWareHouse: false,
      branch: branchId,
    }).populate("user");
    res.status(200).json({ message: "success", data: getAllBranchOrders });
  } catch (error) {
    res.status(500).json({ message: `Internal server error ${error}` });
  }
};

//update order status for main house order
export const UpdateMainHouseOrderStatus = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    //first find the order
    const order = await Order.findById(id);
    if (!order || !order.inMainWareHouse)
      return res.status(404).json({ message: "order not found!" });
    //

    const updateOrderStatus = Order.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ message: "success", data: updateOrderStatus });
  } catch (error) {
    res.status(500).json({ message: `Internal server error ${error}` });
  }
};

//update branch order
export const UpdateBranchOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    //first find the order
    const order = await Order.findById(id);
    if (!order || order.inMainWareHouse)
      return res.status(404).json({ message: "order not found!" });
    //update it
    const updateOrderStatus = Order.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ message: "success", data: updateOrderStatus });
  } catch (error) {
    res.status(500).json({ message: `Internal server error ${error}` });
  }
};
