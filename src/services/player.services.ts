import { PlayerRole } from "../constants/player";
import playerDb from "../db/player.db";
import { Fields } from "../interfaces/generics";
import IPlayer from "../interfaces/IPlayer";
import dieaseDb from "../db/diease.db";

const getPlayer = async (playerEmail: string) => {
  try {
    console.log("Fetching player from MongoDB...");

    const player = await playerDb.getPlayerByField({ email: playerEmail });
    return player;
  } catch (error) {
    throw error;
  }
};

const createPlayer = async (newPlayer: IPlayer) => {
  try {
    console.log("Player not found in MongoDB.");
    console.log("Creating user...");

    const createdPlayer = await playerDb.createPlayer(newPlayer);
    return createdPlayer;
  } catch (error) {
    throw error;
  }
};

const updatePlayer = async (playerEmail: string, changes: Fields) => {
  try {
    console.log("Updating player...");

    const updatedPlayer = await playerDb.updatePlayerByField(
      { email: playerEmail },
      changes
    );
    return updatedPlayer;
  } catch (error) {
    throw error;
  }
};

const getAcolytes = async () => {
  try {
    const acolytes = await playerDb.getAcolytes();
    return acolytes;
  } catch (error: any) {
    throw error;
  }
};

const getNonAcolytePlayers = async () => {
  const nonAcolytePlayers = await playerDb.getNonAcolytePlayers();
  return nonAcolytePlayers;
};

const getNewAndOutOfSyncWithKaotikaFields = (
  fcmToken: string,
  player: IPlayer
) => {
  const newAndOutOfSyncWithKaotikaFields = {
    active: true,
    pushToken: fcmToken,
  };

  if (player.rol === PlayerRole.ACOLYTE) {
    Object.assign(newAndOutOfSyncWithKaotikaFields, {
      isBetrayer: player.isBetrayer,
      gold: player.gold,
      inventory: player.inventory,
      attributes: player.attributes,
    });
  }

  return newAndOutOfSyncWithKaotikaFields;
};

async function applyAttributeModifiers(player: IPlayer) {
  applyEthaziumCurseModifier(player);

  modifyAttributesBasedOnResistance(player);

  await applyActiveDiseasesModifiers(player);

  roundDownAttributes(player);
}

function applyEthaziumCurseModifier(player: IPlayer) {
  // Apply the Ethazium curse modifier if applicable
  if (player.isCursed) {
    for (const attribute in player.attributes) {
      player.attributes[attribute as keyof typeof player.attributes] *= 1 - 0.4;
    }
  }
}

function modifyAttributesBasedOnResistance(player: IPlayer) {
  const resistance = player.attributes.resistance!;

  // For every point the “resistance” drops from 50 downwards, the “insanity” rises by 1
  player.attributes.insanity += resistance < 50 ? 50 - resistance : 0;

  // Apply the modifier based on the "resistance" to the corresponding attributes

  const attributesToApplyResistanceModifierTo = [
    "intelligence",
    "dexterity",
    "strength",
  ];

  attributesToApplyResistanceModifierTo.forEach((attribute) => {
    player.attributes[attribute as keyof typeof player.attributes] *=
      resistance / 100;
  });
}

async function applyActiveDiseasesModifiers(player: IPlayer) {
  const diseases = await dieaseDb.getDiseases();

  diseases.forEach((disease) => {
    player.diseases!.forEach((playerDisease) => {
      if (disease._id.equals(playerDisease._id)) {
        const attributeToModify = disease.penalty.slice(0, -5).toLowerCase();
        const attributeModifier = (+disease.penalty.slice(-4, -1) + 100) / 100;

        player.attributes[
          attributeToModify as keyof typeof player.attributes
        ] *= attributeModifier;
      }
    });
  });
}

function roundDownAttributes(player: IPlayer) {
  type Attribute = keyof typeof player.attributes;

  for (const attribute in player.attributes) {
    player.attributes[attribute as Attribute] = Math.floor(
      player.attributes[attribute as Attribute]!
    );
  }
}

const playerServices = {
  getPlayer,
  createPlayer,
  updatePlayer,
  getAcolytes,
  getNonAcolytePlayers,
  getNewAndOutOfSyncWithKaotikaFields,
  applyAttributeModifiers,
};

export default playerServices;
