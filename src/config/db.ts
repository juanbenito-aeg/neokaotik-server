import { Environment } from "../constants/general";
import mongoose from "mongoose";

const mongoDbUri =
  process.env.NODE_ENV === Environment.TEST
    ? process.env.MONGODB_URI_TEST
    : process.env.MONGODB_URI_PRODUCTION;

mongoose.connect(mongoDbUri!);

console.log("You are now connected to MongoDB.");
