import { Types } from "mongoose";
import playerDb from "../../../../db/player.db";
import playerServices from "../../../../services/player.services";
import { getNonAcolytePlayersSocketId } from "../../../../helpers/socket.helpers";
import io from "../../../../config/sockets";
import { SocketServerToClientEvents } from "../../../../constants/socket";
import { Fields } from "../../../../interfaces/generics";

async function handleAcolyteInfected(
  acolyteId: Types.ObjectId,
  diseaseId: Types.ObjectId
) {
  const fieldToFilterBy = { _id: acolyteId };

  const { diseases: affectedAcolyteDiseases } =
    (await playerDb.getPlayerByField(fieldToFilterBy, "diseases"))!;

  // Ensure the acolyte does not yet have the disease
  if (!affectedAcolyteDiseases!.includes(diseaseId)) {
    const updatedAcolyte = await applyDiseaseAndAttributeModifiers(
      fieldToFilterBy,
      diseaseId
    );

    console.log(
      `An acolyte ("_id" = "${acolyteId}") was infected with a disease ("_id" = "${diseaseId}").`
    );

    const nonAcolytePlayersSocketIds = await getNonAcolytePlayersSocketId();

    io.to([updatedAcolyte.socketId, ...nonAcolytePlayersSocketIds]).emit(
      SocketServerToClientEvents.ACOLYTE_INFECTED,
      acolyteId,
      {
        diseases: updatedAcolyte.diseases,
        attributes: updatedAcolyte.attributes,
      }
    );
  }
}

async function applyDiseaseAndAttributeModifiers(
  fieldToFilterBy: Fields,
  diseaseId: Types.ObjectId
) {
  const updatedAcolyte = (await playerDb.updatePlayerByField(fieldToFilterBy, {
    $addToSet: { diseases: diseaseId },
  }))!;

  await playerServices.applyAttributeModifiers(updatedAcolyte);

  return updatedAcolyte;
}

export { handleAcolyteInfected };
