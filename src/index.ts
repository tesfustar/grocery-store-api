import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoDbConnection from "./config/db.config";
import auth from "./routes/auth";
import category from "./routes/category";
import product from "./routes/product";
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
// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
