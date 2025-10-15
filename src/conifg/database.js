
const mongoose = require("mongoose");

const DATABASE_URL = process.env.DATABASE_URL;

const connectDB = async function () {
  try {
      await mongoose.connect(
        "mongodb+srv://rockPrabhat_:jOKJ54uPIQW1d23t@cluster0.5sffhoa.mongodb.net/nodeak"
      );
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
};

connectDB();
