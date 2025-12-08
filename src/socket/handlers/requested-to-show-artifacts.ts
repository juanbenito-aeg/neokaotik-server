import { SocketServerToClientEvents } from "../../constants/socket";
import User from "../../database/userDatabase";
import USER_ROLES from "../../roles/roles";
import { io } from "../..";

async function handleRequestedToShowArtifacts() {
  const acolytes = await User.getAcolytes();
  const mortimer = await User.getUserByField({ rol: USER_ROLES.MORTIMER });
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
