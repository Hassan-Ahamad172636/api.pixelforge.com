import express from "express";
import { userController } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/tokenmiddleware.js";

const router = express.Router();

router.post("/register", userController.register);

router.post("/login",  userController.login);

router.get("/profile", verifyJWT, userController.profile);

export default router;
