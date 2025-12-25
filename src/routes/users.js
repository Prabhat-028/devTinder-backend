const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const userModel = require("../models/user");
const connectionRequestModel = require("../models/connectionRequest");
const USER_SAFE_DATA = [
    "firstName",
    "lastName",
    "gender",
    "skills",
	"photoURL",
	"age",
];

userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const loggedInUserId = user._id;
        //finding the user
        const User = await connectionRequestModel
            .find({ toUserId: loggedInUserId, status: "interested" }) //adding the original data of the sender with the api
            .populate("fromUserId", USER_SAFE_DATA);

        if (!user) {
            return res.status(400).json({ message: "NO Connection Request!!" });
        }
        res.json({
            message: "Data Fetched Successfully",
            data: User,
        });
    } catch (error) {
        throw new Error("ERROR:" + error.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        //finding the connection of the user which status is accepted
        const connectionRequest = await connectionRequestModel
            .find({
                $or: [
                    { toUserId: loggedInUser._id, status: "accepted" },
                    { fromUserId: loggedInUser._id, status: "accepted" },
                ],
            })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

        const user = connectionRequest.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({
            message: "successfully fetch the connections request",
            data: user,
        });
    } catch (error) {
        throw new Error("ERROR:" + error.message);
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
		const loggedInUser = req.user;
		const page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		limit = limit > 30 ? 10 : limit;
		const skip = (page - 1) * 10;

        const connectionRequest = await connectionRequestModel
            .find({
                $or: [
                    { toUserId: loggedInUser._id },
                    { fromUserId: loggedInUser._id },
                ],
            })
            .select("toUserId fromUserId");
        const hideUserFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
		});
		
		const feedUser = await userModel
			.find({
				$and: [
					{ _id: { $nin: Array.from(hideUserFromFeed) } },
					{ _id: { $ne: loggedInUser._id } },
				],
			})
			.select("-password -mobileNo -__v").skip(skip).limit(limit);// hide sensitive fields;
		
		
        res.json({
            message: "FEED USERS UPDATED SUCCESSFULLY",
            data: feedUser,
		});
		
    } catch (error) {
        throw new Error("ERROR:" + error.message);
    }
});

module.exports = { userRouter };
