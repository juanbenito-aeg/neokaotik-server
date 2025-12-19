import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../interfaces/socket";
import { httpServer } from "./server";
import { SocketGeneralEvents } from "../constants/socket";
import subscribeToEvents from "../sockets/subscriptions";

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);

io.on(SocketGeneralEvents.CONNECTION, subscribeToEvents);

export default io;
