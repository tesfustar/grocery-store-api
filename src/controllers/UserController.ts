import { Request, Response } from "express";
import User from "../models/User";
import Favorite from "../models/Favorite";
import _ from "lodash";
import Order from "../models/Order";
import z from "zod";
import axios from "axios";
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
    const deliveredOrders = await Order.find().countDocuments({
      user: id,
      status: "DELIVERED",
    });
    const favorites = await Favorite.find().countDocuments({ user: id });
    res.status(200).json({
      message: "success",
      data: {
        profile: selectedProp,
        orders: totalOrder,
        favorites,
        deliveredOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//add new address for customers
export const AddNewAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const address = z.object({
      location: z.number().array(),
      phone:z.number()
    });
    const addressData = address.parse(req.body);
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "user not found" });
    //find the add in google
    const userAddress = await axios
      .get(
        // `https://maps.googleapis.com/maps/api/geocode/json?latlng=${addressData.location[1]},${addressData.location[0]}&key=${process.env.GOOGLE_MAP_API_KEY}`
        // `https://nominatim.openstreetmap.org/reverse?format=json&lat=${addressData.location[1]}&lon=${addressData.location[0]}`
        "https://nominatim.openstreetmap.org/reverse?format=json&lat=9.0348&lon=38.7632"
      )
      .then(async (response) => {
        const updateUserAddress = await User.findByIdAndUpdate(
          id,
          {
            $push: {
              address: {
                location: addressData.location,
                address: response?.data?.display_name,
                phone:addressData.phone
              },
            },
          },
          { new: true }
        );
        res.status(200).json({ message: "success", data: updateUserAddress });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const RemoveUserAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const address = z.object({
      addressId: z.string(),
    });
    const addressData = address.parse(req.body);
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "user not found" });

    //remove the address
    const updateUser = await User.findByIdAndUpdate(
      id,
      { $pull: { address: { _id: addressData.addressId } } },
      { new: true }
    );
    res.status(200).json({ message: "success", data: updateUser });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" });
  }
};
//hide or deactivate delivery account for admin only
export const DeActivateDeliveryOrBranchAdminManAccount = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      _id: id,
      $or: [{ role: "DELIVERY" }, { role: "STORE_ADMIN" }],
    });
    //check first the user exist or not
    if (!user) return res.status(400).json({ message: "user not found !" });
    const isHidden = await User.findOne({
      _id: id,
      $or: [{ role: "DELIVERY" }, { role: "STORE_ADMIN" }],
      isAccountHidden: true,
    });
    if (isHidden)
      return res.status(400).json({ message: "account already deactivated !" });
    const deactivateAccount = await User.findByIdAndUpdate(
      id,
      { $set: { isAccountHidden: true } },
      { new: true }
    );

    res.status(200).json({
      message: "success",
      data: deactivateAccount,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//activate delivery or branch admin account
export const ActivateDeliveryOrBranchAdminAccount = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      _id: id,
      $or: [{ role: "DELIVERY" }, { role: "STORE_ADMIN" }],
    });
    //check first the user exist or not
    if (!user) return res.status(400).json({ message: "user not found !" });
    const isHidden = await User.findOne({
      _id: id,
      $or: [{ role: "DELIVERY" }, { role: "STORE_ADMIN" }],
      isAccountHidden: false,
    });
    if (isHidden)
      return res.status(400).json({ message: "account is already active!" });
    const activateAccount = await User.findByIdAndUpdate(
      id,
      { $set: { isAccountHidden: false } },
      { new: true }
    );

    res.status(200).json({
      message: "success",
      data: activateAccount,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//delete account of delivery or branch admin user
export const DeleteDeliveryOrBranchAdminAccount = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      _id: id,
      $or: [{ role: "DELIVERY" }, { role: "STORE_ADMIN" }],
    });
    //check first the user exist or not
    if (!user) return res.status(400).json({ message: "user not found !" });
    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "account deleted successfully! ",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};


//get user address
export const GetUserAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    //first find the user
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "user not found!" });
  
    res.status(200).json({
      message: "success",
      data:user.address,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};