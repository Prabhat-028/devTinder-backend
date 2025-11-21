const express = require("express");
const {userAuth} = require("../middlewares/auth");

const profileRouter = express.Router();

//getting the cookies in request call
profileRouter.get("/profile", userAuth,async (req, res) => {
    try {
        console.log(req.cookies);
        const user = req.user;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("ERROR:" + err.message);
    }
    
}) 
module.exports = profileRouter;