const express = require("express");

const app = express();

app.get("/main/:username/:userid", (req, res) => {
    console.log(req.params);
    res.send("successfully on main page");
});
app.post("/ma", (req, res) => {
    res.send("dakad");
})
app.listen(1998, () => {
    console.log("server is successfully listening/running on port 1998");
});


