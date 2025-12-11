import { SocketServerToClientEvents } from "../../constants/socket";
import playerDb from "../../db/player.db";
import { PlayerRole } from "../../constants/player";
import { io } from "../..";

async function handleRequestedToShowArtifacts() {
  const acolytes = await playerDb.getAcolytes();
  const mortimer = await playerDb.getPlayerByField({
    rol: PlayerRole.MORTIMER,
  });
  let acolytesSocketId: string[] = [];
  acolytes.map((acolyte) => {
    acolytesSocketId.push(acolyte.socketId);
  });

  const collectedSocketsId: string[] = [
    mortimer!.socketId,
    ...acolytesSocketId,
  ];

  io.to(collectedSocketsId).emit(
    SocketServerToClientEvents.REQUESTED_TO_SHOW_ARTIFACTS
  );
}

export default handleRequestedToShowArtifacts;
