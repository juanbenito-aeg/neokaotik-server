import playerDb from "../db/player.db";
import { PlayerRole, Email } from "../constants/player";
import { Methods } from "../constants/general";
import { Fields } from "../interfaces/generics";
import externalApiService from "./external-api.services";
import IPlayer from "../interfaces/IPlayer";

const getUser = async (userEmail: string) => {
  try {
    console.log("Fetching user from MongoDB...");

    const player = await playerDb.getPlayerByField({ email: userEmail });
    return player;
  } catch (error) {
    throw error;
  }
};

const createUser = async (newUser: IPlayer) => {
  try {
    console.log("User not found in MongoDB.");
    console.log("Creating user...");

    const createdUser = await playerDb.createPlayer(newUser);
    return createdUser;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userEmail: string, changes: Fields) => {
  try {
    console.log("Updating user...");

    const updatedUser = await playerDb.updatePlayerByField(
      { email: userEmail },
      changes
    );
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (userEmail: string, fcmToken: string) => {
  try {
    const kaotikaPlayer = await externalApiService.getKaotikaPlayer(userEmail);

    if (!kaotikaPlayer) {
      throw new Error(`User not found in Kaotika with email: ${userEmail}`);
    }

    const mongoUser = await getUser(userEmail);

    const putOrPost = [];

    if (!mongoUser) {
      const newDbUserAdditionalFields = getNewDbUserAdditionalFields(
        userEmail,
        fcmToken
      );

      const newUser = { ...kaotikaPlayer, ...newDbUserAdditionalFields };

      const createdUser = await createUser(newUser);

      putOrPost.push(Methods.POST);
      putOrPost.push(createdUser);

      return putOrPost;
    }

    const updatedUser = await updateUser(userEmail, {
      active: true,
      pushToken: fcmToken,
      ...kaotikaPlayer,
    });

    putOrPost.push(Methods.PUT);
    putOrPost.push(updatedUser);

    return putOrPost;
  } catch (error) {
    throw error;
  }
};

const getNewDbUserAdditionalFields = (userEmail: string, fcmToken: string) => {
  const newDbUserAdditionalFields = {
    active: false,
    rol: assignRoleByEmail(userEmail),
    socketId: "",
    pushToken: fcmToken,
  };

  switch (newDbUserAdditionalFields.rol) {
    case PlayerRole.ACOLYTE: {
      Object.assign(newDbUserAdditionalFields, {
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
      Object.assign(newDbUserAdditionalFields, { is_inside_hs: false });
      break;
    }
  }

  return newDbUserAdditionalFields;
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

const logedUser = async (userEmail: string, fcmToken: string) => {
  try {
    const kaotikaPlayer = await externalApiService.getKaotikaPlayer(userEmail);
    if (!kaotikaPlayer) {
      throw new Error(`User not found in Kaotika with email: ${userEmail}`);
    }

    const updatedUser = await updateUser(userEmail, {
      active: true,
      pushToken: fcmToken,
      ...kaotikaPlayer,
    });

    return updatedUser;
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

const userService = {
  getUser,
  createUser,
  updateUser,
  loginUser,
  logedUser,
  getAcolytes,
  getNonAcolytePlayers,
};

export default userService;
