import User from "../models/User";
import { Request, Response } from "express";

//get all customers

export const GetAllCustomers = async (req: Request, res: Response) => {
  try {
    const getCustomers = await User.find({ role: "USER" });
    res.status(201).json({ message: "success", data: getCustomers });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};
