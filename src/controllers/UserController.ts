import { Request, Response } from "express";
import User from "../models/User";
import _ from 'lodash'

//get user profile
export const GetUserProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      //first find the user
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "user not found!" });
      const selectedProp = _.pick(user,['_id','firstName','lastName','profile','email','phone','location','address','createdAt','updatedAt'])
      res.status(500).json({ message: "success",data:selectedProp });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
  