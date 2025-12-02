// socket.js
import { Server } from "socket.io";
import { ConversationModel } from "../models/conversaction.model.js";

let io = null;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: { origin: "*" }
    });

    // Socket ke saath user ka conversation ID track karne ke liye
    const userToConversationMap = new Map(); // socket.id → conversation._id

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // Jab user apna userId bhejta hai (login ke baad)
        // socket.js (sirf important changes)

        socket.on("join", async ({ userId, conversationId }) => {
            try {
                let conversation;

                if (conversationId) {
                    conversation = await ConversationModel.findOne({
                        _id: conversationId,
                        userId
                    });
                    if (!conversation) throw new Error("Conversation not found");
                } else {
                    // Naya conversation banao
                    conversation = await ConversationModel.create({
                        userId,
                        title: "New Chat"
                    });
                }

                socket.conversationId = conversation._id;
                socket.userId = userId;

                // History bhejo
                socket.emit("conversation-loaded", {
                    conversationId: conversation._id,
                    title: conversation.title,
                    messages: conversation.messages
                });

                // Sidebar ke liye all conversations bhejo
                const allConversations = await ConversationModel.find({ userId })
                    .sort({ createdAt: -1 })
                    .select("title createdAt")
                    .lean();

                socket.emit("conversations-list", allConversations.map(c => ({
                    id: c._id,
                    title: c.title,
                    createdAt: c.createdAt
                })));

            } catch (err) {
                socket.emit("error", { message: err.message });
            }
        });

        // User ne prompt bheja
        socket.on("prompt", async ({ text }) => {
            if (!socket.conversationId) {
                socket.emit("error", { message: "Conversation not initialized" });
                return;
            }

            try {
                // User ka message save karo
                await ConversationModel.updateOne(
                    { _id: socket.conversationId },
                    {
                        $push: {
                            messages: {
                                text,
                                fromUser: true,
                                timestamp: new Date()
                            }
                        }
                    }
                );

                console.log("User message saved:", text);

                // Progress bhejo
                socket.emit("progress", { percent: 30, message: "Generating image..." });

            } catch (err) {
                console.error("Error saving prompt:", err);
                socket.emit("error", { message: "Failed to save message" });
            }
        });

        // AI ne image generate kar di
        // generation-done event
        socket.on("generation-done", async ({ imageUrl, prompt }) => {
            if (!socket.conversationId) return;

            try {
                const update = {
                    $push: {
                        messages: {
                            text: prompt || "Generated image",
                            image: imageUrl,    // ← Yeh bilkul sahi hai
                            fromUser: false,
                            timestamp: new Date()
                        }
                    }
                };

                await ConversationModel.updateOne(
                    { _id: socket.conversationId },
                    update
                );

                // Auto title
                if (prompt) {
                    const shortTitle = prompt.length > 40 ? prompt.slice(0, 37) + "..." : prompt;
                    await ConversationModel.findByIdAndUpdate(socket.conversationId, {
                        title: shortTitle
                    });
                }

                socket.emit("progress", { percent: 100 });
                // Image wapas bhejo taake doosre tabs mein bhi dikhe
                socket.emit("image", { imageUrl });

            } catch (err) {
                console.error("DB Save Error:", err);
                socket.emit("error", { message: "Failed to save image" });
            }
        });

        // Add this event in your socket connection
        socket.on("delete-message", async ({ conversationId, messageIndex }) => {
            if (!conversationId || !socket.conversationId) return;

            try {
                // Remove message at index
                await ConversationModel.updateOne(
                    { _id: socket.conversationId },
                    {
                        $unset: { [`messages.${messageIndex}`]: 1 }
                    }
                );

                await ConversationModel.updateOne(
                    { _id: socket.conversationId },
                    { $pull: { messages: null } }
                );

                // Notify all clients
                io.to(socket.conversationId).emit("message-deleted", { messageIndex });

            } catch (err) {
                console.error("Delete failed:", err);
            }
        });

        // Rename conversation (YEH GALTI THI!)
        socket.on("rename-conversation", async ({ conversationId, title }) => {
            try {
                await ConversationModel.findByIdAndUpdate(conversationId, { title });

                // Sabko batao ke list refresh ho jaye
                io.emit("conversations-updated"); // Yeh event frontend listen kar raha hai
                console.log("Chat renamed:", conversationId, "→", title);
            } catch (err) {
                console.error("Rename failed:", err);
            }
        });

        // Delete conversation
        socket.on("delete-conversation", async ({ conversationId }) => {
            try {
                await ConversationModel.findByIdAndDelete(conversationId);

                // Sab clients ko batao
                io.emit("conversation-deleted", { deletedId: conversationId });
                io.emit("conversations-updated"); // List refresh kar do

                console.log("Conversation deleted:", conversationId);
            } catch (err) {
                console.error("Delete conversation failed:", err);
            }
        });

        // Add this anywhere in io.on("connection")
        socket.on("request-conversations", async () => {
            if (!socket.userId) return;
            const list = await ConversationModel.find({ userId: socket.userId })
                .sort({ createdAt: -1 })
                .select("title createdAt")
                .lean();
            socket.emit("conversations-list", list.map(c => ({
                id: c._id,
                title: c.title,
                createdAt: c.createdAt
            })));
        });

        socket.on("disconnect", () => {
            userToConversationMap.delete(socket.id);
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) throw new Error("Socket not initialized!");
    return io;
};