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
        type: String
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
        type: String
    }
});

const userModel=mongoose.model("User", userSchema);

module.exports = userModel;