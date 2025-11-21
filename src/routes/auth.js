const express = require("express");
const userModel = require("../models/user");
const {validateSignupData} = require("../utils/validation");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
    
  try {
    const user = await userModel.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token);
      res.send("login Successfull");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/signup", async (req, res) => {

    try {
        console.log(req.body);
    // ✅ Validate input first
    validateSignupData(req);

    const {
      firstName,
      lastName,
      mobileNo,
      emailId,
      skills,
      password,
      age,
      gender,
    } = req.body;

    //using bcrypt lib to create the password hash
    const passwordHash = await bcrypt.hash(password, 12);
    //   console.log(passwordHash);

    // ✅ Check skills constraint
    if (skills && skills.length > 10) {
      throw new Error("Skills list is too long: " + skills);
    }

    // ✅ Create new user instance
    const user = new userModel({
      firstName,
      lastName,
      mobileNo,
      emailId,
      skills,
      password: passwordHash,
      age,
      gender,
    });
    if (mobileNo.length > 10 || mobileNo.length < 10) {
      throw new Error("Please Enter Valid Moblie No");
    }

    // ✅ Optionally validate email (if you re-enable that check)
    // if (!isEmail(emailId)) {
    //     throw new Error("Email is not valid " + emailId);
    // }

    // ✅ Save user
    await user.save();

    res.send("User saved successfully");
  } catch (err) {
    console.error(err);
    res.status(400).send("ERROR: " + err.message);
  }
});  

module.exports = authRouter;