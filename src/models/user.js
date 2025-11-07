const mongoose = require("mongoose");
const { stringify } = require("postcss");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    password: {
        type: String
    },
    mobileNo: {
        type: Number,
        validate (v) {
      return /^[0-9]{10,11}$/.test(v); // allows 10 or 11 digits
    },
    }, 
    age: {
        type: Number
    },
    skills: {
        type:[String]
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