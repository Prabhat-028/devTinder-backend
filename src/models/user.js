const mongoose = require("mongoose");
const { stringify } = require("postcss");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        unique: true,
        trim:true
    },
    password: {
        type: String
    },
    mobileNo: {
        type: Number
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        lowercase:true,
      validate(value) {
          if (!["male", "female", "others"].includes(value)) {
              throw new Error("Gender is not valid");
          }
      }
    }
},
{//adding timestamps for adding when user is registered on the application to the database dynamically
    timestamps: true
});

const userModel=mongoose.model("User", userSchema);

module.exports = userModel;