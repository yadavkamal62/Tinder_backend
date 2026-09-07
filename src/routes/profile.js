const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const ConnectionRequest = require("../models/connectionRequest");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("something went wrong");
    }
});



profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("invalid edit request");
        }

        const loggedInUser = req.user;
        const updates = Object.keys(req.body);
        updates.forEach((field) => {
            loggedInUser[field] = req.body[field];
        });

        await loggedInUser.save();
        console.log(loggedInUser);
        // res.send(loggedInUser);
        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser,
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/updatePassword", userAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            throw new Error("Please provide currentPassword and newPassword");
        }

        const user = req.user;

        const isCurrentValid = await user.validatePassword(currentPassword);
        if (!isCurrentValid) {
            throw new Error("Current password is incorrect");
        }

        if (!validator.isStrongPassword(newPassword)) {
            throw new Error("New password is not strong enough");
        }

        const newHash = await bcrypt.hash(newPassword, 10);
        user.password = newHash;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = profileRouter;
