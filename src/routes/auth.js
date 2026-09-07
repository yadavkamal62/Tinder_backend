const express = require("express");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // validation  data
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;

    // password validation
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("error saving the user: " + (err.message || err));
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    validateLoginData(req);

    const { email, password } = req.body;

    const user = await User.findOne({ email:email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // 3. Compare passwords
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // create a jwt tocken
      const token = await user.getJWT();

      res.cookie("token", token);
      // console.log(token);
      //add expire of cookies

      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  //

  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logout successful");
});
module.exports = authRouter;
