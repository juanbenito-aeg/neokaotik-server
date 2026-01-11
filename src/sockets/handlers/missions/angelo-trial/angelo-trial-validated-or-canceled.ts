import io from "../../../../config/sockets";
import {
  AngeloLocation,
  VoteAngeloTrial,
} from "../../../../constants/missions";
import { PlayerRole } from "../../../../constants/player";
import { SocketServerToClientEvents } from "../../../../constants/socket";
import playerDb from "../../../../db/player.db";
import {
  getAcolytesSocketId,
  getNonAcolytePlayersSocketId,
} from "../../../../helpers/socket.helpers";

async function handleAngeloTrialValidatedOrCanceled(isTrialValidated: boolean) {
  const angelo = (await playerDb.getPlayerByField({ rol: PlayerRole.ANGELO }))!;

  const acolytes = await playerDb.getPlayersByFields({
    isBetrayer: false,
    rol: PlayerRole.ACOLYTE,
  });

  const nonAcolytes = await playerDb.getPlayersByFields({
    rol: { $nin: [PlayerRole.ACOLYTE, PlayerRole.ANGELO, PlayerRole.MORTIMER] },
  });

  const players = [...acolytes, ...nonAcolytes];

  let relevantFields;
  let playersVotes;

  const acolytesSocketIds = acolytes.map((acolyte) => acolyte.socketId);

  const nonAcolytesSocketIds = await getNonAcolytePlayersSocketId();

  const relevantSocketIds = [...acolytesSocketIds, ...nonAcolytesSocketIds];

  if (!isTrialValidated) {
    const updatedAngelo = (await playerDb.updatePlayerByField(
      {
        _id: angelo._id,
      },
      { location: AngeloLocation.DUNGEON }
    ))!;

    relevantFields = {
      _id: updatedAngelo._id,
      location: updatedAngelo.location,
    };

    console.log(
      "Trial was canceled. Angelo has been sent to the Dungeon and all votes were reset"
    );
  } else {
    const votesCount = {
      innocent: 0,
      guilty: 0,
    };

    players.forEach((player) => {
      if (player.voteAngeloTrial === VoteAngeloTrial.INNOCENT) {
        votesCount.innocent++;
      } else if (player.voteAngeloTrial === VoteAngeloTrial.GUILTY) {
        votesCount.guilty++;
      }
    });

    console.log(
      `Votes count = Innocent: ${votesCount.innocent}, Guilty: ${votesCount.guilty}`
    );

    let updatedAngelo;

    if (votesCount.innocent === votesCount.guilty) {
      updatedAngelo = (await playerDb.updatePlayerByField(
        { _id: angelo._id },
        { location: AngeloLocation.DUNGEON }
      ))!;

      console.log(
        " Votes were evenly split. Angelo has been sent to the Dungeon."
      );
    } else if (votesCount.innocent > votesCount.guilty) {
      updatedAngelo = (await playerDb.updatePlayerByField(
        { _id: angelo._id },
        {
          location: AngeloLocation.INN_FORGOTTEN,
          isCaptured: false,
        }
      ))!;

      console.log(
        "Majority voted innocent. Angelo has been released to the Inn of the Forgotten."
      );
    } else {
      updatedAngelo = (await playerDb.updatePlayerByField(
        { _id: angelo._id },
        {
          location: AngeloLocation.DUNGEON,
          isGuilty: true,
          isCaptured: false,
        }
      ))!;

      console.log(
        " Majority voted guilty. Angelo has been sent to the Dungeon"
      );
    }

    relevantFields = {
      _id: updatedAngelo._id,
      location: updatedAngelo.location,
      isGuilty: updatedAngelo.isGuilty,
      isCaptured: updatedAngelo.isCaptured,
    };

    playersVotes = { votes: votesCount };
  }

  await playerDb.updatePlayersByField(
    {
      _id: { $in: players.map((player) => player._id) },
    },
    { voteAngeloTrial: "" }
  );

  io.to(relevantSocketIds).emit(
    SocketServerToClientEvents.ANGELO_TRIAL_FINISHED,
    relevantFields,
    playersVotes
  );
}

export default handleAngeloTrialValidatedOrCanceled;
