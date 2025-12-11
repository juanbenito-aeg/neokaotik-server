import mongoose from "mongoose";
import "dotenv/config";

jest.mock("mqtt", () => ({
  __esModule: true,
  default: {
    connect: () => ({ on: () => {} }),
  },
}));

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST!);
});

afterAll(async () => {
  await mongoose.connection.close();
});
