import mongoose from "mongoose";

mongoose.set("strictQuery", true);
// 'mongodb://0.0.0.0:27017/grocery'
// mongodb+srv://abdi:abdi9503@cluster0.idduthi.mongodb.net/?retryWrites=true&w=majority
const mongoUrl: string = process.env.MONGO_URL as string;
const mongoDbConnection = mongoose
  .connect("mongodb+srv://abdi:abdi9503@cluster0.idduthi.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("db connected"))
  .catch((err) => console.log(`error ${err}`));

export default mongoDbConnection;
