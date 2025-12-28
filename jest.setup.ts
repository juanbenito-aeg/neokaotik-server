import mongoose from "mongoose";
import "dotenv/config";

jest.mock("mqtt", () => ({ connect: jest.fn(() => ({ on: jest.fn() })) }));

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST!);
});

afterAll(async () => {
  await mongoose.connection.close();
});
