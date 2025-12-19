import mongoose from "mongoose";
import "dotenv/config";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST!);
});

afterAll(async () => {
  await mongoose.connection.close();
});
