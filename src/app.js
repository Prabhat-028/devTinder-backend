// const express = require("express");
// const { adminAuth,testAuth } = require("./middlewares/auth");

// const app = express();
// //middleware to authenticate the admin if the admin is authorised then the next request handler function will be called other wise it will throw error in adminAuth file hence there is no need to use another error handler.
// app.get("/admin", adminAuth, (req, res) => {
//   res.send("admin is verified");
// });
// app.get("/main/:username/:userid", (req, res) => {
//   console.log(req.params);
//   res.send("successfully on main page");
// });
// app.post("/ma",testAuth, (req, res) => {
//   res.send("dakad");
// });
// app.listen(1998, () => {
//   console.log("server is successfully listening/running on port 1998");
// });


const express = require("express");
const app = express();
require("./conifg/database")
const userModel = require("./models/user");
const { default: isEmail } = require("validator/lib/isEmail");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const { userRouter } = require("./routes/users");
const cors = require("cors");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

//using middleware to fetch data dynamically
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/",userRouter)

//get user by id
app.get("/user", async (req, res) => {
    const userId = req.body._id;

    try {
        const user = await userModel.findById({ _id: userId });
        if (!user || user.length == 0) {
            res.send("User not Found");
        }
        else {
            res.send(user);
        }
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
})

//creating delete api
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await userModel.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).send("User Not Found");
        }

        res.send("User Deleted Successfully");
    }
    catch (err) {
        res.status(500).send("something went wrong");
    }

})

//creating update or patch api
app.patch("/user", async (req, res) => {
    const userId = req.body._id;
    const data = req.body;
    console.log(data);
    try {
        const user = await userModel.findByIdAndUpdate(userId , data,{returnDocument :"after",
        runValidators :true});
        
        if (!user) {
            res.status(404).send("User not found");
        }
        res.send("User Updated Successfully");
    }
    catch (err) {
        res.status(500).send("Something Went Wrong");
    }
})


app.listen(1998, () => {
    console.log("successfully listening to port 1998");
})
