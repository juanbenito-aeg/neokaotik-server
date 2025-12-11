import externalApiService from "./external-api.services";
import { PlayerRole, Email } from "../constants/player";
import userService from "./userService";
import { Methods } from "../constants/general";

const loginPlayer = async (playerEmail: string, fcmToken: string) => {
  try {
    const kaotikaPlayer = await externalApiService.getKaotikaPlayer(
      playerEmail
    );

    if (!kaotikaPlayer) {
      throw new Error(`User not found in Kaotika with email: ${playerEmail}`);
    }

    const mongoPlayer = await userService.getUser(playerEmail);

    const putOrPost = [];

    if (!mongoPlayer) {
      const newDbUserAdditionalFields = getNewDbPlayerAdditionalFields(
        playerEmail,
        fcmToken
      );

      const newPlayer = { ...kaotikaPlayer, ...newDbUserAdditionalFields };

      const createdUser = await userService.createUser(newPlayer);

      putOrPost.push(Methods.POST);
      putOrPost.push(createdUser);

      return putOrPost;
    }

    const updatedPlayer = await userService.updateUser(playerEmail, {
      active: true,
      pushToken: fcmToken,
      ...kaotikaPlayer,
    });

    putOrPost.push(Methods.PUT);
    putOrPost.push(updatedPlayer);

    return putOrPost;
  } catch (error) {
    throw error;
  }
};

const logedPlayer = async (playerEmail: string, fcmToken: string) => {
  try {
    const kaotikaPlayer = await externalApiService.getKaotikaPlayer(
      playerEmail
    );
    if (!kaotikaPlayer) {
      throw new Error(`User not found in Kaotika with email: ${playerEmail}`);
    }

    const updatedPlayer = await userService.updateUser(playerEmail, {
      active: true,
      pushToken: fcmToken,
      ...kaotikaPlayer,
    });

    return updatedPlayer;
  } catch (error) {
    throw error;
  }
};

const getNewDbPlayerAdditionalFields = (
  playerEmail: string,
  fcmToken: string
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
        isInside: false,
        is_in_tower_entrance: false,
        is_inside_tower: false,
        card_id: "",
        has_been_summoned_to_hos: false,
        found_artifacts: [],
        has_completed_artifacts_search: false,
        is_inside_hs: false,
      });
      break;
    }

    case PlayerRole.MORTIMER: {
      Object.assign(newDbPlayerAdditionalFields, { is_inside_hs: false });
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
  loginPlayer,
  logedPlayer,
};

export default authServices;
