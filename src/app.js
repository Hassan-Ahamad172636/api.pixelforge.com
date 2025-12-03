import express from "express";
import cors from "cors";
import UserRoutes from "../src/routes/user.route.js"
import ConversationRoutes from "../src/routes/conversation.route.js"
import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";

const app = express();
app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

app.get("/debug", (req, res) => {
  res.send({
    uri: process.env.MONGO_DB_URI,
    name: DB_NAME,
    connected: mongoose.connection.readyState
  });
});


app.use('/user', UserRoutes)
app.use('/conversation', ConversationRoutes)

export default app;
