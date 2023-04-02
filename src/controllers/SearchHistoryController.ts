import { Request, Response } from "express";
import SearchHistory from "../models/SearchHistory";

//get all search queries
export const GetSearchHistory = async (req: Request, res: Response) => {
    try {
      const branch = await SearchHistory.find().sort({count:-1});
      res.status(200).json({ message: "success", data: branch });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" + error });
    }
  };
  