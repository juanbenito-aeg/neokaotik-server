import { Types } from "mongoose";
import playerDb from "../../../../db/player.db";
import { ROTTEN_SET_DECREPIT_BETRAYER } from "../../../../constants/missions";
import io from "../../../../config/sockets";
import { getNonAcolytePlayersSocketId } from "../../../../helpers/socket.helpers";
import { SocketServerToClientEvents } from "../../../../constants/socket";

async function handleAcolyteAcceptedBetrayal(acolyteId: Types.ObjectId) {
  console.log(
    `The acolyte with the _id "${acolyteId}" accepted the betrayal offer.`
  );

  const { socketId: acolyteSocketId, changesToApply: acolyteUpdatedFields } =
    await turnAcolyteIntoBetrayer(acolyteId);

  const nonAcolytePlayersSocketIds = await getNonAcolytePlayersSocketId();

  const relevantSocketIds = [acolyteSocketId, ...nonAcolytePlayersSocketIds];

  io.to(relevantSocketIds).emit(
    SocketServerToClientEvents.ACOLYTE_BECAME_BETRAYER,
    acolyteId,
    acolyteUpdatedFields
  );
}

async function turnAcolyteIntoBetrayer(acolyteId: Types.ObjectId) {
  const fieldToFilterBy = { _id: acolyteId };

  // Get the acolyte's current gold & inventory

  let { gold: currentGold, inventory: currentInventory } =
    (await playerDb.getPlayerByField(fieldToFilterBy, "gold inventory"))!;

  currentInventory = (currentInventory as any)._doc;

  // Define the new "isBetrayer", "gold" & "inventory" fields' values

  const isBetrayer = true;

  const gold = currentGold + 50000;

  const inventoryWithRottenSetDecrepitBetrayer = {
    ...currentInventory,
    weapons: [...currentInventory.weapons, ROTTEN_SET_DECREPIT_BETRAYER.weapon],
    armors: [
      ...currentInventory.armors,
      ROTTEN_SET_DECREPIT_BETRAYER.pieceArmor,
    ],
    boots: [...currentInventory.boots, ROTTEN_SET_DECREPIT_BETRAYER.pairBoots],
    helmets: [...currentInventory.helmets, ROTTEN_SET_DECREPIT_BETRAYER.helmet],
    shields: [...currentInventory.shields, ROTTEN_SET_DECREPIT_BETRAYER.shield],
  };

  const changesToApply = {
    isBetrayer,
    gold,
    inventory: inventoryWithRottenSetDecrepitBetrayer,
  };

  const { socketId } = (await playerDb.updatePlayerByField(
    fieldToFilterBy,
    changesToApply
  ))!;

  return { changesToApply, socketId };
}

export default handleAcolyteAcceptedBetrayal;
