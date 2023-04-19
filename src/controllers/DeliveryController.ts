import { Request, Response } from "express";
import User from "../models/User";
import { UserRole } from "../types/User";

//delivery app home page
export const GetOrderCountForHomePage = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id, role: UserRole.DELIVERY });
    if (!user) return res.status(404).json({ message: "user not found" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};
