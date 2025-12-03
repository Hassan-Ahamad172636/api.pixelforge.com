import express from "express";
import cors from "cors";
import UserRoutes from "../routes/user.route.js"
import ConversationRoutes from "../routes/conversation.route.js"
import mongoose from "mongoose";
import connectDB from "./database/server.js";  // <- FIX
import { DB_NAME } from "./constant.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✨ FIX: call the database connection BEFORE routes
connectDB();

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

app.get("/debug", (req, res) => {
  res.send({
    uri: process.env.MONGO_DB_URI,
    name: DB_NAME,
    connected: mongoose.connection.readyState  // 1 = connected
  });
});

app.use("/user", UserRoutes);
app.use("/conversation", ConversationRoutes);

export default app;
