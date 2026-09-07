const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
        },
        status: {
            type: String,
            require: true,
            enum: {
                values: ["ignore", "interested", "intrested", "accepted", "accepeted", "rejected"],
                message: "{VALUES} is incorrect status type",
            },
        },
    },
    {
        timestamps:true,
    },
);
// checking touserid !=fromuserid this is schema level validaton
// connectionRequestSchema.pre("save", function (next) {
//     const connectionRequest = this;
//     //check if the fromUser id is same toUserid
//     if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
//         throw new Error(" can't sent connection request to yourSelf")
//     }
//     next();

// });

connectionRequestSchema.index({fromUserId:1});

const ConnectionRequest = mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema,
);

module.exports = ConnectionRequest;
