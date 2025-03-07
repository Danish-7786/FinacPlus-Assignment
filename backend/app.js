import express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors())

app.use(express.json({limit:"16kb"})) // use to accept data by form
app.use(express.urlencoded({extended:true,limit:"16kb"}))// use to accept params from url 
// extended true means you can accept objects inside object
app.use(express.static("public")) //use to sset public folder as public assests that anyone can use 

app.use(cookieParser()) // use to insert secure cookies


import userRouter from "./routes/user.routes.js"

app.use("/api/v1/users",userRouter);



// /api/v1/user is an industry standard where api 



export {app}