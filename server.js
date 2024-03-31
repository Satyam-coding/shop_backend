import dotenv from "dotenv";
import express from "express";
import {connnectDB} from "./config/connnectDB.js";
import router from "./routes/user_routes.js";
import cors from "cors";
import { errorMiddleware } from "./middleware/validation.js";
dotenv.config();
// dotenv.config({path:'./config/config.env'});

const corsOptions ={
    origin:'http://localhost:5173',
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true,
}


const app=express();
app.use(express.json());

app.use(cors(corsOptions));

app.use(router);
app.use(errorMiddleware);


const PORT=process.env.PORT || 7000;

connnectDB();


app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});

