const express = require("express");
const { adminAuth,testAuth } = require("./middlewares/auth");

const app = express();
//middleware to authenticate the admin if the admin is authorised then the next request handler function will be called other wise it will throw error in adminAuth file hence there is no need to use another error handler.
app.get("/admin", adminAuth, (req, res) => {
  res.send("admin is verified");
});
app.get("/main/:username/:userid", (req, res) => {
  console.log(req.params);
  res.send("successfully on main page");
});
app.post("/ma",testAuth, (req, res) => {
  res.send("dakad");
});
app.listen(1998, () => {
  console.log("server is successfully listening/running on port 1998");
});
