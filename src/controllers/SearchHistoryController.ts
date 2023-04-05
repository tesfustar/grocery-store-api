import { Request, Response } from "express";
import SearchHistory from "../models/SearchHistory";

//get all search query
export const GetSearchHistory = async (req: Request, res: Response) => {
    try {
      const searches = await SearchHistory.find().sort({count:-1});
      const searchStrings = searches.map((search)=>search.query);
      res.status(200).json({ message: "success", data: searchStrings });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" + error });
    }
  };
  