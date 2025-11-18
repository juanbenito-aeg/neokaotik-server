import { Socket } from "socket.io";
import User from "../../database/userDatabase";
import USER_ROLES from "../../roles/roles";
import { FieldsToUseInDisconnection } from "../../interfaces/socket";
import {
  SocketServerToClientEvents,
  SocketClientToServerEvents,
  SocketGeneralEvents,
} from "../../constants";
import { handleAccessToExitFromLab } from "./angelo-lab";
import { handleAcolyteTowerEntranceStatus } from "./acolyte-tower";
import { sendAcolyteEnteredExitedNotification } from "../../mqtt/handlers/tower-door";
import { HydratedDocument } from "mongoose";
import IPlayer from "../../interfaces/IPlayer";

function handleConnection(socket: Socket) {
  console.log("Client connected to the server socket.");

  socket.on(SocketClientToServerEvents.CONNECTION_OPEN, (userEmail: string) => {
    handleConnectionOpening(socket, userEmail);
  });

  socket.on(
    SocketClientToServerEvents.INSIDE_OUTSIDE_TOWER_ENTRANCE,
    async (isInTowerEntrance: boolean) => {
      handleAcolyteTowerEntranceStatus(socket.id, isInTowerEntrance);
    }
  );

  socket.on(
    SocketClientToServerEvents.ACCESS_TO_EXIT_FROM_LAB,
    (acolyteEmail: string, isInside: boolean) => {
      handleAccessToExitFromLab(socket.id, acolyteEmail, isInside);
    }
  );

  socket.on(SocketGeneralEvents.DISCONNECT, () => {
    handleDisconnection(socket);
  });
}

async function handleConnectionOpening(socket: Socket, userEmail: string) {
  console.log(`The user with the email "${userEmail}" opened a connection.`);

  await User.updateUserByField({ email: userEmail }, { socketId: socket.id });
}

async function handleDisconnection(socket: Socket) {
  console.log("Client disconnected from the server socket.");

  const fieldToFilterBy: FieldsToUseInDisconnection = {
    socketId: socket.id,
  };

  const changesToApply: FieldsToUseInDisconnection = {
    socketId: "",
  };

  const socketUser = await User.getUserByField(fieldToFilterBy);

  if (socketUser?.isInside) {
    changesToApply.isInside = false;

    await notifyMortimerAboutAcolyteDisconnection(socket, socketUser);
  } else if (socketUser?.is_in_tower_entrance) {
    changesToApply.is_in_tower_entrance = false;
  } else if (socketUser?.is_inside_tower) {
    changesToApply.is_inside_tower = false;
  }

  const updatedUser = (await User.updateUserByField(
    fieldToFilterBy,
    changesToApply
  ))!;

  if ("is_inside_tower" in changesToApply) {
    sendAcolyteEnteredExitedNotification(updatedUser);
  }
}

async function notifyMortimerAboutAcolyteDisconnection(
  socket: Socket,
  acolyte: HydratedDocument<IPlayer>
) {
  const mortimer = await User.getUserByField({
    rol: USER_ROLES.MORTIMER,
  });
  const mortimerSocketId = mortimer?.socketId;

  if (mortimerSocketId) {
    socket
      .to(mortimerSocketId)
      .emit(SocketServerToClientEvents.ACOLYTE_DISCONNECTED, acolyte.email);
  }
}

export default handleConnection;
