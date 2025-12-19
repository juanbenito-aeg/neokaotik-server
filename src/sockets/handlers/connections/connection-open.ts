import { Socket } from "socket.io";
import playerDb from "../../../db/player.db";

async function handleConnectionOpen(socket: Socket, playerEmail: string) {
  console.log(
    `The player with the email "${playerEmail}" opened a connection.`
  );

  await playerDb.updatePlayerByField(
    { email: playerEmail },
    { socketId: socket.id }
  );
}

export default handleConnectionOpen;
