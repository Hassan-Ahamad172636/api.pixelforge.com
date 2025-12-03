import express from "express";
import cors from "cors";
import UserRoutes from '../src/routes/user.route.js'
import conversationRoutes from '../src/routes/conversation.route.js'

const app = express();

app.use(cors())
app.use(express.json({ limit: "10mb" }));        // JSON body limit 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true })); // form data ke liye bhi

app.use('/user', UserRoutes)
app.use("/conversation", conversationRoutes);

export default app;