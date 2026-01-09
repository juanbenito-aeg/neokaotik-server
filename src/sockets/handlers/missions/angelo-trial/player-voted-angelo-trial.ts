import { VoteAngeloTrial } from "../../../../constants/missions";
import { PlayerRole } from "../../../../constants/player";
import playerDb from "../../../../db/player.db";
import { Fields } from "../../../../interfaces/generics";
import { SocketServerToClientEvents } from "../../../../constants/socket";
import io from "../../../../config/sockets";

async function handlePlayerVotedAngeloTrial(
  playerId: string,
  vote: VoteAngeloTrial
) {
  console.log(
    `The player with the "_id" "${playerId}" voted "${vote}" in Angelo's trial.`
  );

  // Update voter's "voteAngeloTrial" field

  let fieldToFilterBy: Fields = { _id: playerId };
  const changeToApply = { voteAngeloTrial: vote };

  await playerDb.updatePlayerByField(fieldToFilterBy, changeToApply);

  // Get Mortimer's socket ID

  fieldToFilterBy = { rol: PlayerRole.MORTIMER };
  const fieldToInclude = "socketId";

  const { socketId: mortimerSocketId } = (await playerDb.getPlayerByField(
    fieldToFilterBy,
    fieldToInclude
  ))!;

  io.to(mortimerSocketId).emit(
    SocketServerToClientEvents.PLAYER_VOTED_ANGELO_TRIAL,
    playerId,
    vote
  );
}

export { handlePlayerVotedAngeloTrial };
