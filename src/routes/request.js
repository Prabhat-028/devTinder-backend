const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Mongoose } = require("mongoose");
const connectionRequest = require("../models/connectionRequest");
const userModel = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
		const status = req.params.status;

		if (!(toUserId === fromUserId)) {
			return res.status(400).send("can't send youself a request");
		}
		
		const toUser = await userModel.findById(toUserId);
		if (!toUser) {
			return res.status(400).send("Enter Valid UserId");  
		}

      const validStatus = ["interested", "ignore"];
      if (!validStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Choice " + status });
      }

      const isrequestPresent = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (isrequestPresent) {
        return res.status(400).json({
          message: "Connection already sent!!",
        });
      }
      const connectionData = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionData.save();

      res.send(data);
    } catch (error) {
      res.status(400).send("ERROR:" + error.message);
    }
  }
);

module.exports = requestRouter;
