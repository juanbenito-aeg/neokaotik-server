import playerDB from "../../db/player.db";

async function handleAcolyteTowerEntranceStatus(
  socketId: string,
  isInTowerEntrance: boolean
) {
  const acolyte = await playerDB.getPlayerByField({ socketId });

  if (acolyte) {
    await playerDB.updatePlayerByField(
      { socketId },
      { is_in_tower_entrance: isInTowerEntrance }
    );
    console.log(`Updating tower entrance status for socket ID: ${socketId}`);
  }
}

export { handleAcolyteTowerEntranceStatus };
