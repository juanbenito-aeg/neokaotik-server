import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoutes";
import mongoose from "mongoose";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import "dotenv/config";
import { createServer } from "node:http";
import { Server } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./interfaces/socket";
import { SocketGeneralEvents, MqttEvents } from "./constants";
import handleConnection from "./socket/handlers/connection";
import mqtt from "mqtt";
import fs from "node:fs";
import { handleConnect, handleMessage } from "./mqtt/handlers/generics";

initializeApp({
  credential: applicationDefault(),
});

const app = express();

const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);

app.use(bodyParser.json());
app.use("/user", userRouter);

io.on(SocketGeneralEvents.CONNECTION, handleConnection);

// Securely connect to the broker
const options = {
  key: fs.readFileSync("confidential-data/node.key"),
  cert: fs.readFileSync("confidential-data/node.crt"),
  ca: fs.readFileSync("confidential-data/ca.crt"),
  rejectUnauthorized: true,
};
const client = mqtt.connect("mqtts://10.50.0.50:8883", options);

// Listen for the successful connection to the broker & incoming messages
client.on(MqttEvents.CONNECT, handleConnect);
client.on(MqttEvents.MESSAGE, handleMessage);

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_ROUTE!);

    const PORT = +(process.env.PORT || 3000);
    httpServer.listen(PORT, () => {
      console.log(`API is listening on port ${PORT}.`);
    });

    console.log("You are now connected to Mongo.");
  } catch (error: any) {
    console.log(`Error to connect to the database: ${error.message}`);
  }
}

start();

export { io, client };
