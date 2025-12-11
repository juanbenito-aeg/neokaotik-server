import { SocketServerToClientEvents } from "../../../../constants/socket";
import playerDb from "../../../../database/userDatabase";
import { UserRole } from "../../../../constants/player";
import { io } from "../../../..";
import { getAcolytesSocketId } from "../../../../helpers/socket.helpers";

async function handleRequestedToShowArtifacts() {
  const acolyteSocketIds = await getAcolytesSocketId();

  const { socketId: mortimerSocketId } = (await playerDb.getUserByField(
    { rol: UserRole.MORTIMER },
    "socketId"
  ))!;

  const relevantSocketIds = [...acolyteSocketIds, mortimerSocketId];

  io.to(relevantSocketIds).emit(
    SocketServerToClientEvents.REQUESTED_TO_SHOW_ARTIFACTS
  );
}

export default handleRequestedToShowArtifacts;
