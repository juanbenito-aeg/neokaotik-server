import io from "../../../../config/sockets";
import { AngeloLocation } from "../../../../constants/missions";
import { PlayerRole } from "../../../../constants/player";
import { SocketServerToClientEvents } from "../../../../constants/socket";
import playerDb from "../../../../db/player.db";

async function handleAngeloSubdued() {
  console.log("Angelo was subdued.");

  await updateAngeloLocation();

  console.log("Angelo was taken to 'The Hall of Sages'.");

  io.emit(SocketServerToClientEvents.ANGELO_SUBDUED);
}

async function updateAngeloLocation() {
  const fieldToFilterBy = { rol: PlayerRole.ANGELO };
  const changeToApply = { location: AngeloLocation.HALL_SAGES };

  await playerDb.updatePlayerByField(fieldToFilterBy, changeToApply);
}

export default handleAngeloSubdued;
