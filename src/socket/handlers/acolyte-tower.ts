import User from "../../database/userDatabase";

async function handleAcolyteTowerEntranceStatus(
  socketId: string,
  isInTowerEntrance: boolean
) {
  console.log(`Updating tower entrance status for socket ID: ${socketId}`);

  const acolyte = await User.getUserByField({ socketId });

  if (acolyte) {
    await User.updateUserByField(
      { socketId },
      { is_in_tower_entrance: isInTowerEntrance }
    );
  } else {
    console.log(`User with socket ID ${socketId} not found.`);
  }
}

export { handleAcolyteTowerEntranceStatus };
