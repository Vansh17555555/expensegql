import mongoose from "mongoose";
export const connectDB=async()=>{
    try {
const conn=await mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.4")
console.log(`MongoDB connected: ${conn.connection.host}`);
}
catch(error){
    console.error(`Error: ${error.message}`);
    process.exit(1)
}}