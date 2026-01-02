import { Types } from "mongoose";
import playerDb from "../../../../db/player.db";
import playerServices from "../../../../services/player.services";
import { getNonAcolytePlayersSocketId } from "../../../../helpers/socket.helpers";
import io from "../../../../config/sockets";
import { SocketServerToClientEvents } from "../../../../constants/socket";

async function handleAcolyteCursed(acolyteId: Types.ObjectId) {
  const fieldToFilterBy = { _id: acolyteId };
  const changeToApply = { isCursed: true };

  const updatedAcolyte = (await playerDb.updatePlayerByField(
    fieldToFilterBy,
    changeToApply
  ))!;

  console.log(`${updatedAcolyte.nickname} has been cursed`);

  await playerServices.applyAttributeModifiers(updatedAcolyte);

  const updatedFields = {
    attributes: updatedAcolyte.attributes,
    isCursed: updatedAcolyte.isCursed,
  };

  const acolyteSocketId: string = updatedAcolyte.socketId;

  const nonAcolytePlayersSocketIds = await getNonAcolytePlayersSocketId();

  const relevantSocketIds = [acolyteSocketId, ...nonAcolytePlayersSocketIds];

  io.to(relevantSocketIds).emit(
    SocketServerToClientEvents.ACOLYTE_CURSED,
    acolyteId,
    updatedFields
  );
}

export default handleAcolyteCursed;
