import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoDbConnection from "./config/db.config";

//routes
import auth from "./routes/auth";
import category from "./routes/category";
import product from "./routes/product";
import admin from "./routes/admin";
import banner from "./routes/banner";
import branch from "./routes/branch";
import store from "./routes/store";
import branchAdmin from "./routes/branchAdmin";
import searchHistory from "./routes/searchHistory";
import favorite from "./routes/favorite";
import order from "./routes/order";
const app: Application = express();

//default middleware
dotenv.config();
app.use(express.json());
app.use(cors());

//mongoose connection
mongoDbConnection;
// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Grocery Store Management System API!");
});

//routes
app.use("/api/auth", auth);
app.use("/api/category", category);
app.use("/api/product", product);
app.use("/api/admin", admin);
app.use("/api/banner", banner);
app.use("/api/branch", branch);
app.use("/api/store", store);
app.use("/api/branch-admin", branchAdmin);
app.use("/api/search-history", searchHistory);
app.use("/api/favorite", favorite);
app.use("/api/order", order);
// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
