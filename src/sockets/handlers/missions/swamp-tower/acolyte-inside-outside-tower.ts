import playerDb from "../../../../db/player.db";

async function handleAcolyteInsideOutsideTower(
  socketId: string,
  isInTowerEntrance: boolean
) {
  const acolyte = await playerDb.getPlayerByField({ socketId });

  if (acolyte) {
    await playerDb.updatePlayerByField(
      { socketId },
      { is_in_tower_entrance: isInTowerEntrance }
    );

    console.log(
      `Updating the tower entrance status for the socket ID "${socketId}".`
    );
  }
}

export default handleAcolyteInsideOutsideTower;
