import { Request, Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import Product from "../models/Product";
import ProductRequest from "../models/ProductRequest";
import Branch from "../models/Branch";
import Notification from "../models/Notification";
import { ProductRequestStatus } from "../types/ProductRequest";
import Store from "../models/Store";

//request for product for main ware house store by branches

export const SendProductRequest = async (req: Request, res: Response) => {
  try {
    const productSchema = z.object({
      product: z.string(),
      quantity: z.number(),
    });
    const requestSchema = z.object({
      product: z.array(productSchema),
      branch: z.string(),
      deliveredDate: z.string(),
    });
    const productData = requestSchema.parse(req.body);
    //validate if the branch is exist or not
    const isBranchExist = await Branch.findById(productData.branch);
    if (!isBranchExist)
      return res.status(404).json({ message: "the branch does not exist!" });
    //then create the request after validating user request
    const requestProduct = await ProductRequest.create(productData);
    await Notification.create({
      isAdminNotification: true,
      productRequest: requestProduct._id,
      title: `Product Request`,
      message: `you have new product request from ${isBranchExist?.name}`,
    });
    res.status(201).json({ message: "success", data: requestProduct });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: `Internal server error ${error}` });
  }
};

//get requested product by branches for main ware house
export const GetProductRequests = async (req: Request, res: Response) => {
  try {
    const requestedProduct = await ProductRequest.find()
      .populate("product.product")
      .populate("branch");
    res.status(200).json({ message: "success", data: requestedProduct });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//get detail of single request for main store house
export const GetProductRequestDetail = async (req: Request, res: Response) => {
  const { id } = req.params; //request id
  try {
    const request = await ProductRequest.findById(id);
    if (!request)
      return res.status(404).json({ message: "request does not exist!" });
    const requestedDetail = await ProductRequest.findById(id)
      .populate("product.product")
      .populate("branch");
    res.status(200).json({ message: "success", data: requestedDetail });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//get own branch request for branches only
export const GetBranchProductRequest = async (req: Request, res: Response) => {
  const { branchId } = req.params; //request id
  try {
    //check if the branch exist or not
    const isBranchExist = await Branch.findById(branchId);
    if (!isBranchExist)
      return res.status(404).json({ message: "the branch does not exist!" });
    const request = await ProductRequest.find({ branch: branchId });
    if (request?.length < 1)
      return res
        .status(200)
        .json({ message: "you didn't made  any request yet", data: [] });
    const requests = await ProductRequest.find({ branch: branchId }).populate(
      "product.product"
    );
    res.status(200).json({ message: "success", data: requests });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//accept product request by admin
export const AcceptProductRequest = async (req: Request, res: Response) => {
  const { id } = req.params; // Request id
  try {
    // First, find the request
    const isRequestExist = await ProductRequest.findOne({
      _id: id,
      status: ProductRequestStatus.PENDING,
    });
    if (!isRequestExist)
      return res.status(400).json({ message: "Request not found" });

    // Iterate over each requested product and update the store's available quantity
    for (const requestedProduct of isRequestExist.product) {
      const store = await Store.findOne({ product: requestedProduct.product });
      // Increase the store's available quantity by the requested product's quantity
      if (store) {
        store.availableQuantity =
          (store.availableQuantity || 0) + requestedProduct.quantity;
        await store.save();
      } else {
        // create the product
        await Store.create({
          product: requestedProduct.product,
          branch: isRequestExist.branch,
          availableQuantity: requestedProduct.quantity,
        });
      }
    }
    //send the notification to the branch about the request status
    await Notification.create({
      branch: isRequestExist.branch,
      productRequest: id,
      title: `Product Request accepted`,
      message: `your product request is accepted by admin and its in the way.`,
    });
    //update the request
    const updateRequest = await ProductRequest.findByIdAndUpdate(
      id,
      { $set: { status: ProductRequestStatus.ONGOING } },
      { new: true }
    );

    res.status(200).json({ message: "Success", request: updateRequest });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//mark as delivered request
//accept product request by admin
export const MarkAsDeliveredProductRequest = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params; // Request id
  try {
    // First, find the request
    const isRequestExist = await ProductRequest.findOne({
      _id: id,
      status: ProductRequestStatus.PENDING,
    });
    if (!isRequestExist)
      return res.status(400).json({ message: "Request not found" });

    await Notification.create({
      isAdminNotification: true,
      productRequest: id,
      title: `Product Request`,
      message: `product request #${id} has been delivered`,
    });
    //update the request
    const updateRequest = await ProductRequest.findByIdAndUpdate(
      id,
      { $set: { status: ProductRequestStatus.DELIVERED } },
      { new: true }
    );

    res.status(200).json({ message: "Success", request: updateRequest });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
