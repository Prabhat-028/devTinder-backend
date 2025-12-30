const express = require("express");
const mongoose = require("mongoose");
const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest");
const userModel = require("../models/user");
const sendEmail = require("../utils/sesSendEmail");
const requestRouter = express.Router();

requestRouter.post(
    "/request/send/:status/:userId",
    userAuth,
    async (req, res) => {
        try {
            const fromUserId = String(req.user._id);
            const toUserId = String(req.params.userId);
            const status = req.params.status;

            // validate toUserId format
            if (!mongoose.isValidObjectId(toUserId)) {
                return res.status(400).send("Invalid userId format");
            }

            // prevent sending to self (compare strings)
            if (toUserId === fromUserId) {
                return res.status(400).send("Can't send yourself a request");
            }

            const toUser = await userModel.findById(toUserId);
            if (!toUser) {
                return res.status(404).send("Enter Valid UserId");
            }

            const validStatus = ["interested", "ignore"];
            if (!validStatus.includes(status)) {
                return res
                    .status(400)
                    .json({ message: "Invalid Choice " + status });
            }

            // Use strings — Mongoose will cast them to ObjectId for queries & documents
            const isrequestPresent = await connectionRequestModel.findOne({
                $or: [
                    { fromUserId: fromUserId, toUserId: toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId },
                ],
            });

            if (isrequestPresent) {
                return res
                    .status(400)
                    .json({ message: "Connection already sent!!" });
            }

            const connectionData = new connectionRequestModel({
                fromUserId: fromUserId,
                toUserId: toUserId,
                status,
            });
            const data = await connectionData.save();
			console.log("before email");
			const emailres = await sendEmail.run();
			console.log("email response", emailres);

            res.status(201).send(data);
        } catch (error) {
            console.error("request/send error:", error);
            res.status(500).send("ERROR:" + error.message);
        }
    }
);

requestRouter.post(
    "/request/review/:status/:requestId",
    userAuth,
    async function (req, res) {
        try {
            const loggedInUserId = String(req.user._id);
            const { status, requestId } = req.params;

            const allowedStates = ["accepted", "rejected"];
            if (!allowedStates.includes(status)) {
                return res.status(400).json({ message: "Invalid Status" });
            }

            if (!mongoose.isValidObjectId(requestId)) {
                return res
                    .status(400)
                    .json({ message: "Invalid requestId format" });
            }

            // Find by id, then check toUserId and status explicitly.
            // This avoids calling mongoose.Types.ObjectId(...) incorrectly.
            // const connectionRequest = await connectionRequestModel.findById(
            //     requestId
            // );

			// atomically update and return the updated document

			// console.log(requestId, " ", loggedInUserId, " ", status);
			
            const updated = await connectionRequestModel.findOneAndUpdate(
                {
                    _id: requestId,
                    toUserId: loggedInUserId,
                    status: "interested",
                },
                { $set: { status } },
                { new: true } // return the updated document
            );

            if (!updated) {
                return res
                    .status(404)
                    .json({ message: "Connection request not found" });
            }

            res.json({
                message: "connection request " + status,
                data: updated,
            });
        } catch (error) {
            console.error("request/review error:", error);
            res.status(500).json({ message: "ERROR: " + error.message });
        }
    }
);

module.exports = requestRouter;
