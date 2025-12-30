require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async function () {
    try {
        await mongoose.connect(process.env.DATABASE_API);
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection failed:", err.message);
    }
};

connectDB();
