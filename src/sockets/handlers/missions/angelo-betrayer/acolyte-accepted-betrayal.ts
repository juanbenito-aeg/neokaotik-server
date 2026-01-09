import { Types } from "mongoose";
import playerDb from "../../../../db/player.db";
import io from "../../../../config/sockets";
import { getNonAcolytePlayersSocketId } from "../../../../helpers/socket.helpers";
import { SocketServerToClientEvents } from "../../../../constants/socket";

async function handleAcolyteAcceptedBetrayal(acolyteId: Types.ObjectId) {
  console.log(
    `The acolyte with the _id "${acolyteId}" accepted the betrayal offer.`
  );

  const { socketId: acolyteSocketId, changeToApply: acolyteUpdatedField } =
    await turnAcolyteIntoBetrayer(acolyteId);

  const nonAcolytePlayersSocketIds = await getNonAcolytePlayersSocketId();

  const relevantSocketIds = [acolyteSocketId, ...nonAcolytePlayersSocketIds];

  io.to(relevantSocketIds).emit(
    SocketServerToClientEvents.ACOLYTE_BECAME_BETRAYER,
    acolyteId,
    acolyteUpdatedField
  );
}

async function turnAcolyteIntoBetrayer(acolyteId: Types.ObjectId) {
  const fieldToFilterBy = { _id: acolyteId };
  const changeToApply = { isBetrayer: true };

  const { socketId } = (await playerDb.updatePlayerByField(
    fieldToFilterBy,
    changeToApply
  ))!;

  return { changeToApply, socketId };
}

export default handleAcolyteAcceptedBetrayal;
