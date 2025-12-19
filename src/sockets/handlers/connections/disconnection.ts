import { Socket } from "socket.io";
import { FieldsToUseInDisconnection } from "../../../interfaces/socket";
import playerDb from "../../../db/player.db";
import { SocketServerToClientEvents } from "../../../constants/socket";
import { PlayerRole } from "../../../constants/player";
import { sendAcolyteEnteredExitedNotification } from "../../../mqtt/handlers/missions/swamp-tower/tower-door";
import { HydratedDocument, Types } from "mongoose";
import IPlayer from "../../../interfaces/IPlayer";
import { getNonAcolytePlayersSocketId } from "../../../helpers/socket.helpers";
import io from "../../../config/sockets";
import { Location } from "../../../interfaces/geolocalization";

async function handleDisconnection(socket: Socket) {
  console.log(
    `The client with the id "${socket.id}" disconnected from the server socket.`
  );

  const fieldToFilterBy: FieldsToUseInDisconnection = {
    socketId: socket.id,
  };

  const changesToApply: FieldsToUseInDisconnection = {
    socketId: "",
  };

  const socketUser = await playerDb.getPlayerByField(fieldToFilterBy);

  if (socketUser?.isInside) {
    changesToApply.isInside = false;

    await notifyMortimerAboutAcolyteDisconnection(socket, socketUser);
  } else if (socketUser?.is_in_tower_entrance) {
    changesToApply.is_in_tower_entrance = false;
  } else if (socketUser?.is_inside_tower) {
    changesToApply.is_inside_tower = false;
  } else if (socketUser?.is_inside_hs) {
    changesToApply.is_inside_hs = false;

    // Reflect acolytes' & Mortimer's app closing in others' screen when they are inside The Hall of Sages
    socket.broadcast.emit(
      SocketServerToClientEvents.PLAYER_ENTERED_EXITED_HS,
      socketUser._id,
      false
    );
  } else if (socketUser?.rol === PlayerRole.ACOLYTE) {
    await informNonAcolytesAboutAcolyteExitFromSwamp(socketUser._id);
  }

  const updatedPlayer = (await playerDb.updatePlayerByField(
    fieldToFilterBy,
    changesToApply
  ))!;

  if ("is_inside_tower" in changesToApply) {
    sendAcolyteEnteredExitedNotification(updatedPlayer);
  }
}

async function notifyMortimerAboutAcolyteDisconnection(
  socket: Socket,
  acolyte: HydratedDocument<IPlayer>
) {
  const mortimer = await playerDb.getPlayerByField({
    rol: PlayerRole.MORTIMER,
  });
  const mortimerSocketId = mortimer?.socketId;

  if (mortimerSocketId) {
    socket
      .to(mortimerSocketId)
      .emit(SocketServerToClientEvents.ACOLYTE_DISCONNECTED, acolyte.email);
  }
}

async function informNonAcolytesAboutAcolyteExitFromSwamp(
  exitingAcolyteId: Types.ObjectId
) {
  const nonAcolytePlayersSocketId = await getNonAcolytePlayersSocketId();

  const nullLocation: Location = {
    type: "Point",
    coordinates: [0, 0],
  };

  // Reflect acolyte's app closing when they are inside "The Swamp" screen in non-acolyte players' app
  io.to(nonAcolytePlayersSocketId).emit(
    SocketServerToClientEvents.ACOLYTE_POSITION_CHANGED,
    exitingAcolyteId,
    nullLocation
  );
}

export default handleDisconnection;
