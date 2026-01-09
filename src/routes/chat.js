const express = require("express");
const { Chat } = require("../models/chat");
const chatRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;

        // ✅ FIX 1: extract the actual value
        const { targetUserId } = req.params;

        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }, // ✅ OK now
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName",
        });

        if (!chat) {
            // ✅ FIX 2: participants must be an ARRAY
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });
        }

        await chat.save();
        res.json(chat);
    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = chatRouter;
