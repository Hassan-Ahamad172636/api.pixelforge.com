import express from "express";
import cors from "cors";
import UserRoutes from "../src/routes/user.route.js"
import ConversationRoutes from "../src/routes/conversation.route.js"

const app = express();
app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

app.use('/user', UserRoutes)
app.use('/conversation', ConversationRoutes)

export default app;
