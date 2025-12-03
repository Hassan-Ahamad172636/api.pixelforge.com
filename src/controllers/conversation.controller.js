import { ConversationModel } from "../models/conversaction.model.js";
import { generateApiResponse } from "../utils/apirespnose.js";
import { asyncHandler } from "../utils/asynchandler.js";

export const conversationController = {
    // Load or Create Conversation
    getConversation: asyncHandler(async (req, res) => {
        const { conversationId } = req.params;
        const userId = req.user.userId;

        let conversation;
        if (conversationId === "new") {
            conversation = await ConversationModel.create({ userId, title: "New Chat" });
        } else {
            conversation = await ConversationModel.findOne({ _id: conversationId, userId });
            if (!conversation) return res.status(404).json({ success: false, message: "Not found" });
        }

        return generateApiResponse(res, 200, true, "Loaded", conversation);
    }),

    // Save user message
    saveMessage: asyncHandler(async (req, res) => {
        const { conversationId, text } = req.body;
        const userId = req.user.userId;

        let convId = conversationId;
        if (!convId) {
            const newConv = await ConversationModel.create({ userId, title: "New Chat" });
            convId = newConv._id;
        }

        await ConversationModel.updateOne(
            { _id: convId },
            { $push: { messages: { text, fromUser: true, timestamp: new Date() } } }
        );

        res.json({ success: true, conversationId: convId });
    }),

    // Save AI image
    saveImage: asyncHandler(async (req, res) => {
        const { conversationId, imageUrl, prompt } = req.body;
        let convId = conversationId;

        if (!convId) {
            const newConv = await ConversationModel.create({ userId: req.user.userId, title: prompt.slice(0, 40) });
            convId = newConv._id;
        }

        const shortTitle = prompt.length > 40 ? prompt.slice(0, 37) + "..." : prompt;

        await ConversationModel.updateOne(
            { _id: convId },
            {
                $push: { messages: { text: prompt, image: imageUrl, fromUser: false, timestamp: new Date() } },
                $set: { title: shortTitle }
            }
        );

        res.json({ success: true, conversationId: convId, title: shortTitle });
    }),

    // Delete message by index
    deleteMessage: asyncHandler(async (req, res) => {
        const { conversationId } = req.body;
        const { index } = req.params;

        await ConversationModel.updateOne(
            { _id: conversationId },
            { $unset: { [`messages.${index}`]: 1 } }
        );
        await ConversationModel.updateOne(
            { _id: conversationId },
            { $pull: { messages: null } }
        );

        res.json({ success: true });
    }),

    // Get all conversations list
    getConversationsList: asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        console.log(req.user)

        const conversations = await ConversationModel.find({ userId })
            .sort({ createdAt: -1 })
            .select("title createdAt")
            .lean();

        const list = conversations.map(c => ({
            id: c._id,
            title: c.title,
            createdAt: c.createdAt
        }));

        return generateApiResponse(res, 200, true, "Conversations fetched", { conversations: list });
    }),

    // Delete entire conversation
    deleteConversation: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const userId = req.user.userId;

        const result = await ConversationModel.findOneAndDelete({ _id: id, userId });

        if (!result) {
            return generateApiResponse(res, 404, false, "Conversation not found");
        }

        return generateApiResponse(res, 200, true, "Conversation deleted");
    }),
};