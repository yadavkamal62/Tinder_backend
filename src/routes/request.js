const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const mongoose = require("mongoose");
const User = require("../models/user");
const { isFloat } = require("validator");
// const connectionRequestSchema =require("../models/connectionRequest")


requestRouter.post(
    "/request/send/:status/:toUserId", userAuth,
    async (req, res, next) => {
        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId && req.params.toUserId.trim();
            if (!toUserId || !mongoose.Types.ObjectId.isValid(toUserId)) {
                return res.status(400).send("Invalid toUserId");
            }
            const status = req.params.status;
            const allowedStatus = ["ignore", "intrested"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({ message: "invalide status type:" + status })
            }
            // if there is cheack for an execting connection

            const exisitingConnectionRequest = await ConnectionRequest.findOne({
                $or: [
                    {
                        fromUserId,
                        toUserId,
                    },
                    {
                        fromUserId: toUserId, toUserId: fromUserId
                    },
                ],
            })
            if (exisitingConnectionRequest) {
                return res
                    .status(400)
                    .send({ message: "connection request is already existing" })
            }

            //checking of toUserid   is to userid exiting in my database or nat
            const toUser = await User.findById(toUserId);
            if (!toUser) {
                return res
                    .status(400)
                    .send({ message: "user not found" })
            }

            //validation for handle request to your self
            if (toUserId == fromUserId) {
                return res
                    .status(400)
                    .send({ message: "can't sent request to yourSelf" })
            }


            // creating a new instance of user object
            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });
            const data = await connectionRequest.save();
            res.json({
                message:
                    req.user.firstName + "is " + status + "in " + toUser.firstName, data
            });

        }
        catch (err) {
            res.status(400).send("Error:" + err.message);

        }

        requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
            try {
                //validation for 
                const loggedInUser = req.user;
                const allowedStatus = ["accepted,rejected"];
                if (allowedStatus.includes(status)) {
                    return res.status(400).json({ message: "status is not allowed!!" })
                }

            }
            catch (err) {
                res.status(400).send("Error:" + err.message);

            }
        })
    }
)
module.exports = requestRouter;