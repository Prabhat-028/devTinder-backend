const express = require("express");

const app = express();

app.use("/test",(req,res) => {
    res.send("Hello from the server for test page");
})

app.use("/hello", (req, res) => {
  res.send("Hello from the server for hello page");
});
app.use("/uooo", (req, res) => {
  res.send("Hello from the server fo ruooo page");
});   
app.use("/hd", (req, res) => {
  res.send("Hello from the server for hd page");
});

app.use("/", (req, res) => {
  res.send("Hello from the server for main page");
});

app.listen(1998, () => {
    console.log("server is successfully listening/running on port 1998");
});


