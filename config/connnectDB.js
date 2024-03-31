import mongoose from "mongoose";

export const connnectDB= async()=>{

try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to mongodb server');
} catch (error) {
    console.log('error connecting mongodb'+error);
}

}