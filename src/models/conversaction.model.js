// models/conversation.model.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    text: { type: String, default: "" },
    image: { type: String, default: "" }, // base64
    fromUser: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now }
});

// models/conversation.model.js
const ConversationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        default: "New Chat"
    },
    messages: [MessageSchema]
}, { timestamps: true });

// Index for faster query
ConversationSchema.index({ userId: 1, createdAt: -1 });

export const ConversationModel = mongoose.model("Conversation", ConversationSchema);
