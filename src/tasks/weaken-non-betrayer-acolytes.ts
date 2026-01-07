import { Types } from "mongoose";
import { PlayerRole } from "../constants/player";
import dieaseDb from "../db/diease.db";
import playerDb from "../db/player.db";
import playerServices from "../services/player.services";
import IPlayer from "../interfaces/IPlayer";
import io from "../config/sockets";
import { SocketServerToClientEvents } from "../constants/socket";
import { getNonAcolytePlayersSocketId } from "../helpers/socket.helpers";

async function weakenNonBetrayerAcolytes() {
  await decreaseResistanceBy10();

  const acolytes = await playerDb.getPlayersByFields({
    isBetrayer: false,
    rol: PlayerRole.ACOLYTE,
  });

  for (const acolyte of acolytes) {
    await applyRandomDiseases(acolyte);
    await playerServices.applyAttributeModifiers(acolyte);
    await emitCronTask(acolyte._id);
  }

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

async function applyRandomDiseases(acolyte: IPlayer) {
  const diseases = await dieaseDb.getDiseases();

  if (acolyte.diseases!.length < 3) {
    const availableDiseases = diseases.filter(
      (disease) =>
        !acolyte.diseases!.find((id: Types.ObjectId) => id.equals(disease._id))
    );

    if (availableDiseases.length > 0) {
      const randomDisease =
        availableDiseases[Math.floor(Math.random() * availableDiseases.length)];

      await playerDb.updatePlayerByField(
        {
          email: acolyte.email,
        },
        {
          $addToSet: { diseases: randomDisease!._id },
        }
      );
    }
  }
}

async function emitCronTask(acolyteId: Types.ObjectId) {
  const updatedAcolyte = (await playerDb.getPlayerByField({ _id: acolyteId }))!;

  const acolyteUpdatedFields = {
    diseases: updatedAcolyte.diseases,
    attributes: updatedAcolyte.attributes,
  };

  const acolyteSocketId: string = updatedAcolyte.socketId;

  const nonAcolytePlayersSocketIds = await getNonAcolytePlayersSocketId();

  const relevantSocketIds: string[] = [
    acolyteSocketId,
    ...nonAcolytePlayersSocketIds,
  ];

  io.to(relevantSocketIds).emit(
    SocketServerToClientEvents.CRON_TASK_EXECUTED,
    acolyteId,
    acolyteUpdatedFields
  );
}

export {
  weakenNonBetrayerAcolytes,
  decreaseResistanceBy10,
  applyRandomDiseases,
};
