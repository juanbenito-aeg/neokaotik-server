import playerDb from "../../../../database/userDatabase";

async function handleAcolyteInsideOutsideTower(
  socketId: string,
  isInTowerEntrance: boolean
) {
  const acolyte = await playerDb.getUserByField({ socketId });

  if (acolyte) {
    await playerDb.updateUserByField(
      { socketId },
      { is_in_tower_entrance: isInTowerEntrance }
    );

    console.log(
      `Updating the tower entrance status for the socket ID "${socketId}".`
    );
  }
}

export default handleAcolyteInsideOutsideTower;
