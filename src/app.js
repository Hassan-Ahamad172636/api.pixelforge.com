import express from "express";
import cors from "cors";
import UserRoutes from '../src/routes/user.route.js'

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use('/user', UserRoutes)

export default app;