const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignore", "accepted", "rejected"],
        message: (props) => `${props.value} is incorrect status type `,
      },
    },
  },
  {
    timestamps: true,
  }
);
//checking if the user send connection to himself
connectionRequestSchema.pre("save", function () {
	if (connectionRequestSchema.toUserId.equals(connectionRequestSchema.fromUserId)) {
		throw new Error("Can't send yourself a request");
	}
	next();
})

const connectionRequestModel = new mongoose.model("connectionRequest", connectionRequestSchema);
module.exports = connectionRequestModel;