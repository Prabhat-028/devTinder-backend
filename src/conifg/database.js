
const mongoose = require("mongoose");


const connectDB = async function () {
  try {
      await mongoose.connect(
        "mongodb+srv://rockPrabhat_:jOKJ54uPIQW1d23t@cluster0.5sffhoa.mongodb.net/devTinder"
      );
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
};

connectDB();
