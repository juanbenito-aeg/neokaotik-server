import userDatabase from "../database/userDatabase";

async function getAcolytesSocketId() {
  const acolytes = await userDatabase.getAcolytes("socketId");

  const acolytesSocketId = acolytes.map((acolyte) => acolyte.socketId);

  return acolytesSocketId;
}

async function getNonAcolytePlayersSocketId() {
  const nonAcolytePlayers = await userDatabase.getNonAcolytePlayers();

  const nonAcolytePlayersSocketId = nonAcolytePlayers.map(
    (nonAcolytePlayer) => nonAcolytePlayer.socketId
  );

  return nonAcolytePlayersSocketId;
}

export { getAcolytesSocketId, getNonAcolytePlayersSocketId };
