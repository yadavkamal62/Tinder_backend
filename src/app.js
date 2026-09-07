const express = require("express");
const connectDB = require("./config/database");

const { ReturnDocument } = require("mongodb");

const { Error } = require("mongoose");

const cookieParser = require("cookie-parser");
const cors =require("cors");


const jwt = require("jsonwebtoken");

const app = express();
app.use(cors({
    origin:"http://localhost:5173/login",
    credentials:true,
}));//middleware
app.use(express.json());//midelware
app.use(cookieParser());// midelware

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);



connectDB()
    .then(() => {
        console.log("database connection established ...........");
        app.listen(5555, () => {
            console.log("server is successfully listing on port 5555 ...........");
        });
    })
    .catch((err) => {
        console.log("database connction can't established");
    });
