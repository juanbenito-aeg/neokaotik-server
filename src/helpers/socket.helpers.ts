import userDatabase from "../database/userDatabase";

async function getNonAcolytePlayersSocketId() {
  const nonAcolytePlayers = await userDatabase.getNonAcolytePlayers();

  const nonAcolytePlayersSocketId = nonAcolytePlayers.map(
    (nonAcolytePlayer) => nonAcolytePlayer.socketId
  );

  return nonAcolytePlayersSocketId;
}

export { getNonAcolytePlayersSocketId };
