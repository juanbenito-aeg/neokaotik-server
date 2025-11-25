import { Types } from "mongoose";
import { Location } from "../../interfaces/geolocalization";
import userDatabase from "../../database/userDatabase";
import { io } from "../..";
import { SocketServerToClientEvents } from "../../constants";

async function handleAcolyteMoved(
  acolyteId: Types.ObjectId,
  acolyteLocation: Location
) {
  console.log(
    `Handling acolyte's (with _id "${acolyteId}") position change...`
  );

  const nonAcolytePlayersSocketId = await getNonAcolytePlayersSocketId();

  io.to(nonAcolytePlayersSocketId).emit(
    SocketServerToClientEvents.ACOLYTE_POSITION_CHANGED,
    acolyteId,
    acolyteLocation
  );

  console.log(
    `Non-acolyte players have been informed about acolyte's (with _id "${acolyteId}") position change.`
  );
}

async function getNonAcolytePlayersSocketId() {
  const nonAcolytePlayers = await userDatabase.getNonAcolytePlayers();

  const nonAcolytePlayersSocketId = nonAcolytePlayers.map(
    (nonAcolytePlayer) => nonAcolytePlayer.socketId
  );

  return nonAcolytePlayersSocketId;
}

export default handleAcolyteMoved;
