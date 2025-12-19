import playerDb from "../db/player.db";

async function getAcolytesSocketId() {
  const acolytes = await playerDb.getAcolytes("socketId");

  const acolytesSocketId = acolytes.map((acolyte) => acolyte.socketId);

  return acolytesSocketId;
}

async function getNonAcolytePlayersSocketId() {
  const nonAcolytePlayers = await playerDb.getNonAcolytePlayers();

  const nonAcolytePlayersSocketId = nonAcolytePlayers.map(
    (nonAcolytePlayer) => nonAcolytePlayer.socketId
  );

  return nonAcolytePlayersSocketId;
}

export { getAcolytesSocketId, getNonAcolytePlayersSocketId };
