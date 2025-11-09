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
//using middleware to fetch data dynamically
app.use(express.json());

app.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
    try {
        const user = await userModel.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.send("login Successfull");
        } else {
            throw new Error("Invalid Credentials");

        }

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }


})

app.post("/signup", async (req, res) => {
  console.log(req.body);

  try {
    // ✅ Validate input first
    validateSignupData(req);

      const {firstName,lastName,mobileNo, emailId, skills, password,age,gender } = req.body;
      const passwordHash = await bcrypt.hash(password, 12);
      console.log(passwordHash);

    // ✅ Check skills constraint
    if (skills && skills.length > 10) {
      throw new Error("Skills list is too long: " + skills);
    }

    // ✅ Create new user instance
    const user = new userModel(
        {   firstName,
            lastName,
            mobileNo,
            emailId,
            skills,
            password:passwordHash,
            age,
            gender
        }
      );
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
// app.post("/signup", async (req, res) => {
//     console.log(req.body);

//     try {

//         validateSignupData(req);
        
//         //  const userObj = {
//         //    firstName: "Prabhat",
//         //    lastName: "Singh",
//         //    emailId: "epiejd1@gmail.com",
//         //    password: "eeijfeaa@345",
//         //    mobileNo: 7765834748,
//         //    age: 12,
//         //    gender: "male",
//         //  };


//          //creating a new instance of a user model
        
//         const { user, emailId, skills } = new userModel(req.body);
        
//         //adding validator to skills so someone cannot send mallicilus skills or greater skill lenght
//         if (skills.length > 10) {
//             throw new Error("skills is to long "+ skills);
//         }
        
//         // //using validator library to validate the email
//         // if (!isEmail(emailId)) {
//         //     throw new Error("Email is not valid " + emailId);
//         // }

//         await user.save();
//         res.send("user saved successfully");
        
//     } catch (err){
//         res.status(400).send("ERROR : "+err.message);
//     }
    

    
    
// })

//get api call handler
// app.get("/user", async (req, res) => {
//     const userFirstName = req.body.firstName;

//     try {
//         const user = await userModel.find({ firstName: userFirstName });
        
//         //Handling if the user doesn't exist in the database
//         if ( !user || user.length == 0)
//             res.send("User not found");
//         else
//             res.send(user);
//     } catch (err) {
//         res.status(400).send("Something went wrong");
//     }
// })

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
