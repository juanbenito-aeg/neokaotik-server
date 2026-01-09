import { Types } from "mongoose";
import playerDb from "../../../../db/player.db";
import playerServices from "../../../../services/player.services";
import { getNonAcolytePlayersSocketId } from "../../../../helpers/socket.helpers";
import io from "../../../../config/sockets";
import { SocketServerToClientEvents } from "../../../../constants/socket";

async function handleAcolyteRested(
  acolyteId: Types.ObjectId,
  acolyteSocketId: string
) {
  const fieldToFilterBy = { _id: acolyteId };
  const changeToApply = { "attributes.resistance": 100 };

  const updatedAcolyte = (await playerDb.updatePlayerByField(
    fieldToFilterBy,
    changeToApply
  ))!;

  console.log(
    `The acolyte with the "_id" "${acolyteId}" rested & restored their "resistance".`
  );

  await playerServices.applyAttributeModifiers(updatedAcolyte);

  const nonAcolytePlayersSocketIds = await getNonAcolytePlayersSocketId();

  const relevantSocketIds = [acolyteSocketId, ...nonAcolytePlayersSocketIds];

  io.to(relevantSocketIds).emit(
    SocketServerToClientEvents.ACOLYTE_RESISTANCE_RESTORED,
    acolyteId,
    updatedAcolyte.attributes
  );
}

export default handleAcolyteRested;
