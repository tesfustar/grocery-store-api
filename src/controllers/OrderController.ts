import User from "../models/User";
import { Request, Response } from "express";
import Product from "../models/Product";
import order from "../models/Order";
import { z } from "zod";
import Branch from "../models/Branch";
import Store from "../models/Store";
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
    });
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
        // await createOrderInBranch(branch._id, order);
        console.log(orderedBranchName);
        isOrderCreated = true;
        break;
      }
    }

    if (isOrderCreated) {
      res
        .status(200)
        .json({ message: `Order created in branch ${orderedBranchName}` });
    } else {
      //make the order in the main warehouse
      res
        .status(404)
        .json({
          message:
            "Requested products are not available in the nearest branches",
        });
    }

    //    res.status(200).json({message:"success",data:nearestBranches})
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: `Internal server error ${error}` });
  }
};

//    const nearestBranch = await Branch.find({
//     location: {
//         $near: {
//           $geometry: {
//             type: 'Point',
//             coordinates: [orderBody.address[0], orderBody.address[1]]
//           },
//           $maxDistance: 100000000000 // max distance in meters
//         }
//       }
//    }).exec()
