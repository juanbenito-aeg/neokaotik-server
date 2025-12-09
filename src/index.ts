import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoutes";
import artifactRoutes from "./routes/artifactRoutes";
import mongoose from "mongoose";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import "dotenv/config";
import { createServer } from "node:http";
import { Server } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./interfaces/socket";
import { Environment } from "./constants/general";
import { MqttEvents } from "./constants/mqtt";
import { SocketGeneralEvents } from "./constants/socket";
import handleConnection from "./socket/handlers/connection";
import mqtt from "mqtt";
import { handleConnect, handleMessage } from "./mqtt/handlers/generics";

initializeApp({
  credential: applicationDefault(),
});

const app = express();

const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);

app.use(bodyParser.json());
app.use("/user", userRouter);
app.use("/api/artifacts", artifactRoutes);

io.on(SocketGeneralEvents.CONNECTION, handleConnection);

const client = mqtt.connect("mqtt://broker.hivemq.com");
client.on(MqttEvents.CONNECT, handleConnect);
client.on(MqttEvents.MESSAGE, handleMessage);

async function start() {
  try {
    const mongoDbUri =
      process.env.NODE_ENV === Environment.TEST
        ? process.env.MONGODB_URI_TEST
        : process.env.MONGODB_URI_PRODUCTION;
    await mongoose.connect(mongoDbUri!);

    // When running tests, do not explicitly listen on a port & let "supertest" choose the first available one
    // Doing so, each test suite will run on a different port & there will be no conflicts
    if (process.env.NODE_ENV !== Environment.TEST) {
      const PORT = +(process.env.PORT || 3000);
      httpServer.listen(PORT, () => {
        console.log(`API is listening on port ${PORT}.`);
      });
    }

    console.log("You are now connected to Mongo.");
  } catch (error: any) {
    console.log(`Error to connect to the database: ${error.message}`);
  }
}

start();

export { app, io, client };
