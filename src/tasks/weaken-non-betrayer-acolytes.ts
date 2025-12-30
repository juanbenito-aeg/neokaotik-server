import { Types } from "mongoose";
import { PlayerRole } from "../constants/player";
import dieaseDb from "../db/diease.db";
import playerDb from "../db/player.db";
import playerServices from "../services/player.services";
import { handleCronTask } from "../sockets/handlers/missions/decay-flesh/cron-task";

async function weakenNonBetrayerAcolytes() {
  await decreaseResistanceBy10();

  await applyRandomDiseases();

  const acolyte = await playerDb.getPlayerByField({
    isBetrayer: false,
    rol: PlayerRole.ACOLYTE,
  });

  handleCronTask(acolyte!._id, {
    diseases: acolyte!.diseases,
    attributes: acolyte!.attributes,
  });

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

async function applyRandomDiseases() {
  const acolytes = await playerDb.getPlayersByFields({
    isBetrayer: false,
    rol: PlayerRole.ACOLYTE,
  });
  const diseases = await dieaseDb.getDiseases();

  for (const acolyte of acolytes) {
    if (acolyte.diseases!.length < 3) {
      const availableDiseases = diseases.filter(
        (disease) =>
          !acolyte.diseases!.find((id: Types.ObjectId) =>
            id.equals(disease._id)
          )
      );

      if (availableDiseases.length > 0) {
        const randomDisease =
          availableDiseases[
            Math.floor(Math.random() * availableDiseases.length)
          ];

        await playerDb.updatePlayerByField(
          {
            email: acolyte.email,
          },
          {
            $addToSet: { diseases: randomDisease!._id },
          }
        );

        await playerServices.applyAttributeModifiers(acolyte);
      }
    }
  }
}

export { weakenNonBetrayerAcolytes, decreaseResistanceBy10 };
