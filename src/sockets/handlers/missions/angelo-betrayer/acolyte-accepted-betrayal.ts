import { Types } from "mongoose";
import playerDb from "../../../../db/player.db";
import io from "../../../../config/sockets";
import { getNonAcolytePlayersSocketId } from "../../../../helpers/socket.helpers";
import { SocketServerToClientEvents } from "../../../../constants/socket";
import { PlayerRole } from "../../../../constants/player";

async function handleAcolyteAcceptedBetrayal(acolyteId: Types.ObjectId) {
  console.log(
    `The acolyte with the _id "${acolyteId}" accepted the betrayal offer.`,
  );

  const { socketId: acolyteSocketId, changeToApply: acolyteUpdatedField } =
    await turnAcolyteIntoBetrayer(acolyteId);

  const nonBetrayerAcolytesSocketIds = (await playerDb.getPlayersByFields(
    { isBetrayer: false, rol: PlayerRole.ACOLYTE },
    "socketId",
  ))!.map((nonBetrayerAcolyte) => nonBetrayerAcolyte.socketId);

  const nonAcolytePlayersSocketIds = await getNonAcolytePlayersSocketId();

  const relevantSocketIds = [
    acolyteSocketId,
    ...nonBetrayerAcolytesSocketIds,
    ...nonAcolytePlayersSocketIds,
  ];

  io.to(relevantSocketIds).emit(
    SocketServerToClientEvents.ACOLYTE_BECAME_BETRAYER,
    acolyteId,
    acolyteUpdatedField,
  );
}

async function turnAcolyteIntoBetrayer(acolyteId: Types.ObjectId) {
  const fieldToFilterBy = { _id: acolyteId };
  const fieldToInclude = "email";

  const { email } = (await playerDb.getPlayerByField(
    fieldToFilterBy,
    fieldToInclude,
  ))!;

  await fetch(`https://kaotika-server.fly.dev/players/loyalty/email/${email}`);

  const changeToApply = { isBetrayer: true };

  const { socketId } = (await playerDb.updatePlayerByField(
    fieldToFilterBy,
    changeToApply,
  ))!;

  return { changeToApply, socketId };
}

export default handleAcolyteAcceptedBetrayal;
