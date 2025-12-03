import express from "express";
import cors from "cors";
import UserRoutes from "../src/routes/user.route.js"
import ConversationRoutes from "../src/routes/conversation.route.js"
import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";
import connectDB from "./database/server.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✨ FIX: call the database connection BEFORE routes
connectDB();

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

app.get("/debug", async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);

    res.send({
      uri: process.env.MONGO_DB_URI,
      connected: mongoose.connection.readyState,
      error: null
    });
  } catch (err) {
    res.send({
      uri: process.env.MONGO_DB_URI,
      connected: mongoose.connection.readyState,
      error: err.message
    });
  }
});


app.use("/user", UserRoutes);
app.use("/conversation", ConversationRoutes);

export default app;
