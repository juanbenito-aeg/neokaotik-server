import { Socket } from "socket.io";
import playerDb from "../../../database/userDatabase";

async function handleConnectionOpen(socket: Socket, playerEmail: string) {
  console.log(
    `The player with the email "${playerEmail}" opened a connection.`
  );

  await playerDb.updateUserByField(
    { email: playerEmail },
    { socketId: socket.id }
  );
}

export default handleConnectionOpen;
