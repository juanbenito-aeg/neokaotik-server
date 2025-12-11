import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI_PRODUCTION!);

console.log("You are now connected to MongoDB.");
