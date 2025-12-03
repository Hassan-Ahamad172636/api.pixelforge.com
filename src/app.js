import express from "express";
import cors from "cors";
import UserRoutes from "../routes/user.route.js"
import ConversationRoutes from "../routes/conversation.route.js"
import connectDB from "./database/server.js";

const app = express();
app.use(cors());
app.use(express.json());

// CALL DB once
await connectDB();  // note: top-level await is allowed in modules

app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

app.get("/debug", async (req, res) => {
  res.send({
    uri: process.env.MONGO_DB_URI,
    connected: mongoose.connection.readyState
  });
});

app.use("/user", UserRoutes);
app.use("/conversation", ConversationRoutes);

export default app;
