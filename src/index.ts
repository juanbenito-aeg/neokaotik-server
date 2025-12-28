import "./config/firebase-admin";
import "./config/server";
import "./config/sockets";
import "./config/mqtt";
import "./config/cron";
import mongoose from "mongoose";
import "dotenv/config";
import { httpServer } from "./config/server";

(async () => {
  await mongoose.connect(process.env.MONGODB_URI_PRODUCTION!);
  console.log("You are now connected to MongoDB.");

  const port = +(process.env.PORT || 3000);
  httpServer.listen(port, () => {
    console.log(`API is listening on port ${port}.`);
  });
})();
