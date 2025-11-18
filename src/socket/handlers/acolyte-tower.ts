import User from "../../database/userDatabase";

async function handleAcolyteTowerEntranceStatus(
  socketId: string,
  isInTowerEntrance: boolean
) {
  const acolyte = await User.getUserByField({ socketId });

  if (acolyte) {
    await User.updateUserByField(
      { socketId },
      { is_in_tower_entrance: isInTowerEntrance }
    );
    console.log(`Updating tower entrance status for socket ID: ${socketId}`);
  }
}

export { handleAcolyteTowerEntranceStatus };
