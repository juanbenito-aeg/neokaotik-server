import { SocketServerToClientEvents } from "../../../../constants/socket";
import playerDb from "../../../../db/player.db";
import { PlayerRole } from "../../../../constants/player";
import io from "../../../../config/sockets";
import { getAcolytesSocketId } from "../../../../helpers/socket.helpers";

async function handleRequestedToShowArtifacts() {
  const acolyteSocketIds = await getAcolytesSocketId();

  const { socketId: mortimerSocketId } = (await playerDb.getPlayerByField(
    { rol: PlayerRole.MORTIMER },
    "socketId"
  ))!;

  const relevantSocketIds = [...acolyteSocketIds, mortimerSocketId];

  io.to(relevantSocketIds).emit(
    SocketServerToClientEvents.REQUESTED_TO_SHOW_ARTIFACTS
  );
}

export default handleRequestedToShowArtifacts;
