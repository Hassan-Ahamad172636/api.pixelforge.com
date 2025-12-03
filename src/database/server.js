import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constant.js";
dotenv.config();
console.log('dotenv =====================', process.env.MONGO_DB_URI)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export default connectDB;
