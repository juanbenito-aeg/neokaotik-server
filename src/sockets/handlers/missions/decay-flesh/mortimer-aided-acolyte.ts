import { Types } from "mongoose";
import { AidType } from "../../../../constants/general";
import playerDb from "../../../../db/player.db";
import playerServices from "../../../../services/player.services";
import { getNonAcolytePlayersSocketId } from "../../../../helpers/socket.helpers";
import io from "../../../../config/sockets";
import { SocketServerToClientEvents } from "../../../../constants/socket";

async function handleMortimerAidedAcolyte(
  acolyteId: Types.ObjectId,
  aidType: AidType,
  diseaseId?: Types.ObjectId
) {
  let updatedFields;
  const fieldToFilterBy = { _id: acolyteId };

  if (aidType === AidType.POULTICE) {
    const changeToApply = { "attributes.resistance": 100 };

    const updatedAcolyte = (await playerDb.updatePlayerByField(
      fieldToFilterBy,
      changeToApply
    ))!;

    console.log("Mortimer has successfully restored the acolyte's resistance.");

    await playerServices.applyAttributeModifiers(updatedAcolyte);

    updatedFields = updatedAcolyte.attributes;
  } else if (aidType === AidType.ETHAZIUM) {
    const changeToApply = { isCursed: false };

    const updatedAcolyte = (await playerDb.updatePlayerByField(
      fieldToFilterBy,
      changeToApply
    ))!;

    console.log("Mortimer has removed the curse from the acolyte.");

    await playerServices.applyAttributeModifiers(updatedAcolyte);

    updatedFields = {
      isCursed: false,
      attributes: updatedAcolyte.attributes,
    };
  } else {
    const acolyte = (await playerDb.getPlayerByField({ _id: acolyteId }))!;

    const updatedDiseases = acolyte.diseases!.filter(
      (disease) => !disease.equals(diseaseId)
    );

    const updatedAcolyte = (await playerDb.updatePlayerByField(
      fieldToFilterBy,
      { diseases: updatedDiseases }
    ))!;

    console.log(
      `Mortimer has removed disease ${diseaseId} from acolyte ${updatedAcolyte.nickname}.`
    );

    await playerServices.applyAttributeModifiers(updatedAcolyte);

    updatedFields = {
      diseases: updatedDiseases,
      attributes: updatedAcolyte.attributes,
    };
  }

  const acolyte = (await playerDb.getPlayerByField({ _id: acolyteId }))!;

  const acolyteSocketId: string = acolyte.socketId;

  const nonAcolytePlayersSocketIds = await getNonAcolytePlayersSocketId();

  const relevantSocketIds: string[] = [
    acolyteSocketId,
    ...nonAcolytePlayersSocketIds,
  ];

  io.to(relevantSocketIds).emit(
    SocketServerToClientEvents.CRON_TASK_EXECUTED,
    acolyteId,
    updatedFields
  );
}

export default handleMortimerAidedAcolyte;
