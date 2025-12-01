import { Socket } from "socket.io";
import { SocketServerToClientEvents } from "../../constants";

function handleRequestedToShowArtifacts(socket: Socket) {
  socket.emit(SocketServerToClientEvents.REQUESTED_TO_SHOW_ARTIFACTS);
}

export default handleRequestedToShowArtifacts;
