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

//using middleware to fetch data dynamically
app.use(express.json());


app.post("/signup", async (req, res) => {
    console.log(req.body);

    try {

        //  const userObj = {
        //    firstName: "Prabhat",
        //    lastName: "Singh",
        //    emailId: "epiejd1@gmail.com",
        //    password: "eeijfeaa@345",
        //    mobileNo: 7765834748,
        //    age: 12,
        //    gender: "male",
        //  };


         //creating a new instance of a user model
         const user = new userModel(req.body);


        await user.save();
        res.send("user saved successfully");
        
    } catch (err){
        res.status(400).send("this is not you it is done by us"+err);
    }
    

    
    
})

//get api call handler
app.get("/user", async (req, res) => {
    const userMobileNo = req.body.mobileNo;

    try {
        const user = await userModel.find({ mobileNo: userMobileNo });

        res.send(user);
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
})

app.listen(1998, () => {
    console.log("successfully listening to port 1998");
})
