const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {validateEditProfileData}=require("../utils/validation");
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const { isStrongPassword } = require("validator");

const profileRouter = express.Router();

//getting the cookies in request call
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        
        const user = req.user;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("ERROR:" + err.message);
    }
    
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try  {
        if (!validateEditProfileData(req)) {
            throw new Error("Edit Not Allowed in Certain Fields");
        }
        const user = req.user;
        const _id = user._id;
        const updatedUser = await userModel.findByIdAndUpdate(_id, req.body,{new:true});
        await updatedUser.save();
        res.json({
          message: `${updatedUser.firstName}, Your Profile Updated Successfully!!`,
          data: updatedUser,
        });
    } catch (err) {
        res.status(400).send("ERROR:" + err.message);
    }
}); 

profileRouter.patch("/profile/EditPassword", userAuth, async (req, res) => {

    try {
      const user = req.user;
      const { newPassword, currentPassword } = req.body;

        if (!isStrongPassword(newPassword)) {
            throw new Error("Password is Too Weak");
            
        }
        
      // Check inputs
      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .send("currentPassword and newPassword are required");
      }

      const isValidPassword = await user.validatePassword(currentPassword);
      if (!isValidPassword) {
        throw new Error("Invalid Password");
      }

      if (currentPassword === newPassword) {
        throw new Error("Please Use new Password");
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);

      user.password = passwordHash;
      await user.save();

      res.send("Password Updated Successfully");
    } catch (error) {
        res.status(400).send("ERROR:" + error.message);
    }
    

})

module.exports = profileRouter;