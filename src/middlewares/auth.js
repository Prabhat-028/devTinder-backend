const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const userAuth = async (req, res,next) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) {
            throw new Error("Token Not Valid");
            
        }

    const decodedObj = await jwt.verify(token, "rockySurface@123");

    const { _id } = decodedObj;
    const user = await userModel.findById(_id);
        if (!user) {
            throw new Error("Invalid Credentials");
        }

        req.user = user;
        console.log("user is ", user);
        next();
        
    } catch (error) {
        res.status(404).send("ERROR:"+error)
    }


}

module.exports = {
   
    userAuth,
};
