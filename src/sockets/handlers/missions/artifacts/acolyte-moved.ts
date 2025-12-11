import { Types } from "mongoose";
import { Location } from "../../../../interfaces/geolocalization";
import { io } from "../../../..";
import { SocketServerToClientEvents } from "../../../../constants/socket";
import { getNonAcolytePlayersSocketId } from "../../../../helpers/socket.helpers";

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

export default handleAcolyteMoved;
