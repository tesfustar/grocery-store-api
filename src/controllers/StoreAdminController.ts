import order from "../models/Order";
import Store from "../models/Store";
import { Request, Response } from "express";

//dashboard

export const StoreAdminDashboard = async (req: Request, res: Response) => {
  const { branchId } = req.params;
  try {
    const storeProducts = await Store.find().countDocuments({
      branch: branchId,
    });
    const orders = await order.find().countDocuments({ branch: branchId });
    res.status(200).json({
      message: "success",
      data: {
        products: storeProducts,
        orders: orders,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//get products
export const GetBranchProducts = async (req: Request, res: Response) => {
  const { branchId } = req.params;
  try {
    const storeProducts = await Store.find({ branch: branchId }).populate(
      "product"
    );
    res.status(200).json({ message: "success", data: storeProducts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};
