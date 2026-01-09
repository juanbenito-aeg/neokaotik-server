import externalApiService from "./external-api.services";
import { PlayerRole, Email } from "../constants/player";
import playerServices from "./player.services";
import { Methods } from "../constants/general";
import IPlayer from "../interfaces/IPlayer";

const getKaotikaAndMongoPlayer = async (playerEmail: string) => {
  const kaotikaPlayer = await externalApiService.getKaotikaPlayer(playerEmail);

  if (!kaotikaPlayer) {
    throw new Error(`Player not found in Kaotika with email: ${playerEmail}.`);
  }

  const mongoPlayer = await playerServices.getPlayer(playerEmail);

  return { kaotikaPlayer, mongoPlayer };
};

const updatePlayerAndApplyAttributeModifiers = async (
  fcmToken: string,
  mongoPlayer: IPlayer,
  kaotikaPlayer: IPlayer
) => {
  const newAndOutOfSyncWithKaotikaFields =
    playerServices.getNewAndOutOfSyncWithKaotikaFields(fcmToken, mongoPlayer);

  const updatedPlayer = (await playerServices.updatePlayer(mongoPlayer.email, {
    ...kaotikaPlayer,
    ...newAndOutOfSyncWithKaotikaFields,
  }))!;

  if (!updatedPlayer.isBetrayer && updatedPlayer.rol === PlayerRole.ACOLYTE) {
    await playerServices.applyAttributeModifiers(updatedPlayer);
  }

  return updatedPlayer;
};

const logIn = async (playerEmail: string, fcmToken: string) => {
  try {
    const { kaotikaPlayer, mongoPlayer } = await getKaotikaAndMongoPlayer(
      playerEmail
    );

    const putOrPost = [];

    if (!mongoPlayer) {
      const newDbUserAdditionalFields = getNewDbPlayerAdditionalFields(
        playerEmail,
        fcmToken,
        kaotikaPlayer
      );

      const newPlayer = { ...kaotikaPlayer, ...newDbUserAdditionalFields };

      const createdPlayer = await playerServices.createPlayer(newPlayer);

      putOrPost.push(Methods.POST, createdPlayer);

      return putOrPost;
    }

    const updatedPlayer = await updatePlayerAndApplyAttributeModifiers(
      fcmToken,
      mongoPlayer,
      kaotikaPlayer
    );

    putOrPost.push(Methods.PUT, updatedPlayer);

    return putOrPost;
  } catch (error) {
    throw error;
  }
};

const accessLoggedIn = async (playerEmail: string, fcmToken: string) => {
  try {
    const { kaotikaPlayer, mongoPlayer } = await getKaotikaAndMongoPlayer(
      playerEmail
    );

    const updatedPlayer = await updatePlayerAndApplyAttributeModifiers(
      fcmToken,
      mongoPlayer!,
      kaotikaPlayer
    );

    return updatedPlayer;
  } catch (error) {
    throw error;
  }
};

const getNewDbPlayerAdditionalFields = (
  playerEmail: string,
  fcmToken: string,
  kaotikaPlayer: IPlayer
) => {
  const newDbPlayerAdditionalFields = {
    active: false,
    rol: assignRoleByEmail(playerEmail),
    socketId: "",
    pushToken: fcmToken,
  };

  switch (newDbPlayerAdditionalFields.rol) {
    case PlayerRole.ACOLYTE: {
      Object.assign(newDbPlayerAdditionalFields, {
        attributes: { ...kaotikaPlayer.attributes, resistance: 100 },
        isInside: false,
        is_in_tower_entrance: false,
        is_inside_tower: false,
        card_id: "",
        has_been_summoned_to_hos: false,
        found_artifacts: [],
        has_completed_artifacts_search: false,
        is_inside_hs: false,
        diseases: [],
        isCursed: false,
        voteAngeloTrial: "",
      });
      break;
    }

    case PlayerRole.MORTIMER: {
      Object.assign(newDbPlayerAdditionalFields, { is_inside_hs: false });
      break;
    }

    case PlayerRole.ISTVAN:
    case PlayerRole.VILLAIN: {
      Object.assign(newDbPlayerAdditionalFields, {
        is_inside_hs: false,
        voteAngeloTrial: "",
      });
      break;
    }
  }

  return newDbPlayerAdditionalFields;
};

const assignRoleByEmail = (email: string) => {
  if (email.includes(Email.ACOLYTE)) {
    return PlayerRole.ACOLYTE;
  } else if (email === Email.ISTVAN) {
    return PlayerRole.ISTVAN;
  } else if (email === Email.MORTIMER) {
    return PlayerRole.MORTIMER;
  } else if (email === Email.VILLAIN) {
    return PlayerRole.VILLAIN;
  }
};

const authServices = {
  logIn,
  accessLoggedIn,
};

export default authServices;
