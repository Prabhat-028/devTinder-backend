const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { stringify } = require("postcss");
const bcrypt = require("bcrypt");

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

userSchema.methods.getJWT=async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "rockySurface@123", { expiresIn: "7d" });
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

const userModel=mongoose.model("User", userSchema);

module.exports = userModel;