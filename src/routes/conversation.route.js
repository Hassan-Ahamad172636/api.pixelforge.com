import express from "express";
import { verifyJWT } from "../middlewares/tokenmiddleware.js";
import { conversationController } from "../controllers/conversation.controller.js";

const router = express.Router();

router.use(verifyJWT);

// YE SABSE UPAR HONA CHAHIYE!!!
router.get("/list", conversationController.getConversationsList);        // ← Pehle
router.get("/new", conversationController.getConversation);              // ← Special case
router.get("/:conversationId", conversationController.getConversation);   // ← Last mein

router.post("/message", conversationController.saveMessage);
router.post("/image", conversationController.saveImage);
router.delete("/message/:index", conversationController.deleteMessage);
router.delete("/:id", conversationController.deleteConversation);         // ← Delete full chat

export default router;