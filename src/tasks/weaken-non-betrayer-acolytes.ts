import { PlayerRole } from "../constants/player";
import playerDb from "../db/player.db";

async function weakenNonBetrayerAcolytes() {
  await decreaseResistanceBy10();

  console.log("Non-betrayer acolytes were weakened by a scheduled task.");
}

async function decreaseResistanceBy10() {
  const fieldsToFilterBy = { isBetrayer: false, rol: PlayerRole.ACOLYTE };

  const changesToApply = [
    {
      $set: {
        "attributes.resistance": {
          $max: [0, { $subtract: ["$attributes.resistance", 10] }],
        },
      },
    },
  ];

  await playerDb.updatePlayersByField(fieldsToFilterBy, changesToApply);
}

export { weakenNonBetrayerAcolytes };
