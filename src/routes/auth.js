const express = require("express");
const userModel = require("../models/user");
const {validateSignupData} = require("../utils/validation");
const bcrypt = require("bcrypt");

const authRouter = express.Router();
authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const normalizedEmail = email.trim().toLowerCase();

        const user = await userModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = await user.getJWT();

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 8 * 8 * 24 * 60 * 60 * 1000,
        });

        res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
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
		const savedUser = await user.save();
		const token = await savedUser.getJWT();
		res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 8 * 24 * 60 * 60 * 1000),
        });

    res.json({message:"User saved successfully",data:savedUser});
  } catch (err) {
    console.error(err);
    res.status(400).send("ERROR: " + err.message);
  }
});  

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) ,});
    res.send("logout successfully");
})

module.exports = authRouter;