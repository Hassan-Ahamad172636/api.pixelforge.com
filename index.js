import app from "./src/app.js";
import connectDB from "./src/database/server.js";

const start = async () => {
  await connectDB();     // Mongoose connect
};

start();

export default app;
