import mongoose from "mongoose";

export const connectDB = async () => {
    const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1/recipesDB'
    try{
        await mongoose.connect(DB_URI);
    }catch(error){
        console.log(`Error connecting to DB: ${error.message}`, DB_URI);
        process.exit(1);
    }
}