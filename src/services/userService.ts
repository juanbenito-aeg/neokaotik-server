import User from "../database/userDatabase";
import { PlayerRole, Email } from "../constants/player";
import { Methods } from "../constants/general";
import { Fields } from "../interfaces/generics";
import IPlayer from "../interfaces/IPlayer";

const getUser = async (userEmail: string) => {
  try {
    console.log("Fetching user from MongoDB...");

    const user = await User.getUserByField({ email: userEmail });
    return user;
  } catch (error) {
    throw error;
  }
};

const getKaotikaUser = async (userEmail: string) => {
  try {
    console.log("Fetching user from Kaotika...");

    const response = await fetch(
      `https://kaotika-server.fly.dev/players/email/${userEmail}`
    );

    if (!response.ok) {
      throw new Error(`Kaotika API error: ${response.status}`);
    }

    const kaotikaUser: any = await response.json();
    const userData = kaotikaUser.data;
    return userData || null;
  } catch (error) {
    throw error;
  }
};

const createUser = async (newUser: IPlayer) => {
  try {
    console.log("User not found in MongoDB.");
    console.log("Creating user...");

    const createdUser = await User.createUser(newUser);
    return createdUser;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userEmail: string, changes: Fields) => {
  try {
    console.log("Updating user...");

    const updatedUser = await User.updateUserByField(
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
    const kaotikaUser = await getKaotikaUser(userEmail);

    if (!kaotikaUser) {
      throw new Error(`User not found in Kaotika with email: ${userEmail}`);
    }

    const mongoUser = await getUser(userEmail);

    const putOrPost = [];

    if (!mongoUser) {
      const newDbUserAdditionalFields = getNewDbUserAdditionalFields(
        userEmail,
        fcmToken
      );

      const newUser = { ...kaotikaUser, ...newDbUserAdditionalFields };

      const createdUser = await createUser(newUser);

      putOrPost.push(Methods.POST);
      putOrPost.push(createdUser);

      return putOrPost;
    }

    const updatedUser = await updateUser(userEmail, {
      active: true,
      pushToken: fcmToken,
      ...kaotikaUser,
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
    const kaotikaUser = await getKaotikaUser(userEmail);
    if (!kaotikaUser) {
      throw new Error(`User not found in Kaotika with email: ${userEmail}`);
    }

    const updatedUser = await updateUser(userEmail, {
      active: true,
      pushToken: fcmToken,
      ...kaotikaUser,
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const getAcolytes = async () => {
  try {
    const acolytes = await User.getAcolytes();
    return acolytes;
  } catch (error: any) {
    throw error;
  }
};

const getNonAcolytePlayers = async () => {
  const nonAcolytePlayers = await User.getNonAcolytePlayers();
  return nonAcolytePlayers;
};

const userService = {
  getUser,
  createUser,
  updateUser,
  getKaotikaUser,
  loginUser,
  logedUser,
  getAcolytes,
  getNonAcolytePlayers,
};

export default userService;
