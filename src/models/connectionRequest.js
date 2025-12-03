const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref:"User",
            required: true,
        },
        toUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref:"User",
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

//adding the compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//checking if the user send connection to himself
connectionRequestSchema.pre("save", function (next) {
    if (
        this.fromUserId &&
        this.toUserId &&
        this.fromUserId.equals(this.toUserId)
    ) {
        return next(new Error("Can't send a connection request to yourself"));
    }
    next();
});


const connectionRequestModel = new mongoose.model(
    "connectionRequest",
    connectionRequestSchema
);
module.exports = connectionRequestModel;
