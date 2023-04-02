import { Request, Response } from "express";
import { z } from "zod";
import Branch from "../models/Branch";
import Store from "../models/Store";

//create branch by super admin

export const CreateBranch = async (req: Request, res: Response) => {
  try {
    const branchSchema = z.object({
      name: z.string(),
      address: z.string(),
      location: z.object({
        type:z.string(),
        coordinates:z.number().array()
      }),
    });
    const branch = branchSchema.parse(req.body);
    const createBranch = await Branch.create(branch);
    res.status(201).json({ message: "success", data: createBranch });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//delete Branch for super admin only
export const DeleteBranch = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    //first find the branch first
    const branch = await Branch.findById(id);
    if (!branch) return res.status(404).json({ message: "branch not found!" });
    await Branch.findByIdAndDelete(id);
    await Store.deleteMany({ branch: id });
    res.status(500).json({ message: "banner deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//get branches for super admin
export const GetBranches = async (req: Request, res: Response) => {
  try {
    const branch = await Branch.find();
    res.status(200).json({ message: "success", data: branch });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};
