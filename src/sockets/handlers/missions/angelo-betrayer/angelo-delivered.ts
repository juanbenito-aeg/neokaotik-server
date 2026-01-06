import io from "../../../../config/sockets";
import { AngeloLocation } from "../../../../constants/missions";
import { PlayerRole } from "../../../../constants/player";
import { SocketServerToClientEvents } from "../../../../constants/socket";
import playerDb from "../../../../db/player.db";
import { getNonAcolytePlayersSocketId } from "../../../../helpers/socket.helpers";

async function handleAngeloDelivered() {
  const angelo = (await playerDb.getPlayerByField({ rol: PlayerRole.ANGELO }))!;

  if (angelo.isCaptured || angelo.location === AngeloLocation.DUNGEON) return;

  const changesToApply = { isCaptured: true, location: AngeloLocation.DUNGEON };

  const updatedAngelo = (await playerDb.updatePlayerByField(
    { rol: PlayerRole.ANGELO },
    changesToApply
  ))!;

  const updatedFields = {
    isCaptured: updatedAngelo.isCaptured,
    location: updatedAngelo.location,
  };

  const acolytes = (await playerDb.getPlayersByFields({
    isBetrayer: false,
    rol: PlayerRole.ACOLYTE,
  }))!;

  const acolytesSocketIds = acolytes.map((acolyte) => acolyte.socketId);

  const nonAcolytePlayersSocketIds = await getNonAcolytePlayersSocketId();

  const relevantSocketIds: string[] = [
    ...acolytesSocketIds,
    ...nonAcolytePlayersSocketIds,
  ];

  io.to(relevantSocketIds).emit(
    SocketServerToClientEvents.ANGELO_DELIVERED,
    updatedFields
  );
}

export default handleAngeloDelivered;
