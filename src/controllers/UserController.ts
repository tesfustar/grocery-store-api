import { Request, Response } from "express";
import User from "../models/User";
import Favorite from "../models/Favorite";
import _ from "lodash";
import Order from "../models/Order";

//get user profile
export const GetUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    //first find the user
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "user not found!" });
    const selectedProp = _.pick(user, [
      "_id",
      "firstName",
      "lastName",
      "profile",
      "email",
      "phone",
      "location",
      "address",
      "createdAt",
      "updatedAt",
    ]);
    const totalOrder = await Order.find().countDocuments({ user: id });
    const deliveredOrders = await Order.find().countDocuments({ user: id ,status:"DELIVERED"});
    const favorites = await Favorite.find().countDocuments({ user: id });
    res
      .status(200)
      .json({
        message: "success",
        data: { profile: selectedProp, orders: totalOrder, favorites,deliveredOrders },
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
