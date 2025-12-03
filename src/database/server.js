import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const connection = await mongoose.connect(process.env.MONGO_DB_URI, {
      dbName: process.env.DB_NAME,
    });

    isConnected = connection.connections[0].readyState;
    console.log("Database Connected");
  } catch (error) {
    console.error("MongoDB Error:", error);
  }
};
