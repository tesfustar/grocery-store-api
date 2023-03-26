import { Request, Response } from "express";
import { z } from "zod";
import Banner from "../models/Banner";
//create Banner
export const CreateBanner = async (req: Request, res: Response) => {
  try {
    const bannerSchema = z.object({
      name: z.string(),
      products: z.string().array().optional(),
      image: z.string(),
    });
    //first validate the user request before create
    const banner = bannerSchema.parse(req.body);
    const createBanner = await Banner.create(banner);
    res.status(201).json({ message: "success", data: createBanner });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//get banners for user require no  auth
export const GetBannerForCustomer = async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find();
    res.status(200).json({ message: "success", data: banners });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};
//get banners for user require no auth
export const GetBannerForAdmin = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.find();
    res.status(200).json({ message: "success", data: banner });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//update banner
export const UpdateBanner = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    //first find the Banner
    const banner = await Banner.findById(id);
    if (!banner) return res.status(404).json({ message: "Banner not found!" });
    //then update the Banner
    const updateBanner = await Banner.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ message: "success", data: updateBanner });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

//delete Banner
export const DeleteBanner = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    //first find the Banner
    const banner = await Banner.findById(id);
    if (!banner) return res.status(404).json({ message: "banner not found!" });
    await Banner.findByIdAndDelete(id);
    res.status(500).json({ message: "banner deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
