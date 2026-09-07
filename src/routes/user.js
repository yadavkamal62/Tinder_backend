const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User =require('../models/user')

const userRouter = express.Router();

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId  toUserId").populate("toUserId","firstName");



    const hideUserFromFeed =new set();
    connectionRequests.forEach((req)=>{
        hideUserFromFeed.add(req.fromUserId);
        hideUserFromFeed.add(req.toUserId);
    })
   const user =await User.find({$and:[{_id:{$nin:Array.from(hideUserFromFeed)}},
    {_id:{$ne:loggedInUser._id}},

   ],})
   res.send(Users)


    return res.status(200).json(connectionRequests);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;