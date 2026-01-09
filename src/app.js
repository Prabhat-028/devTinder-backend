
const express = require("express");
const app = express();
require("./conifg/database");
const userModel = require("./models/user");
const cookieParser = require("cookie-parser");
const { userRouter } = require("./routes/users");
const cors = require("cors");
require("./utils/cronjob");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const http = require("http");

//using middleware to fetch data dynamically
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Enable preflight for all routes from the allowed origin
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Explicitly echo the request origin and enable credentials
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigin = "http://localhost:5173";
    if (origin && origin === allowedOrigin) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Credentials", "true");
        res.header(
            "Access-Control-Allow-Methods",
            "GET,POST,PUT,PATCH,DELETE,OPTIONS"
        );
        res.header(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization, X-Requested-With"
        );
    }
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

const server = http.createServer(app);
const initializeSocket = require("./utils/socket");

initializeSocket(server);



server.listen(1998, () => {
    console.log("successfully listening to port 1998");
});
