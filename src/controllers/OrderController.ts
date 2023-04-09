import User from "../models/User";
import { Request, Response } from "express";
import Product from "../models/Product";
import order from "../models/Order";
import { z } from "zod";
import Branch from "../models/Branch";
import Store from "../models/Store";
import Order from "../models/Order";
import { ObjectId } from "mongoose";
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
    });
    console.log(req.body)
    const orderBody = orderSchema.parse(req.body);
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
export const GetAllMainWareHouseOrders=async (req: Request, res: Response)=>{
try {
  const getAllOrders = await Order.find().populate("user")
  res.status(200).json({message:"success",data:getAllOrders})
} catch (error) {
  res.status(500).json({ message: `Internal server error ${error}` });
}
}
