import express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


const corsOptions = {
  origin: [
    'https://finac-plus-assignment-cqis.vercel.app', 
    'http://localhost:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

app.use(express.json({limit:"16kb"}))
app.use(express.static("public")) 
app.use(cookieParser()) 

import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users",userRouter);

export {app}