import User from "../database/userDatabase";
import USER_ROLES from "../roles/roles";
import { Methods } from "../constants";
import EMAIL from "../roles/emails";
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

    let putOrPost = [];

    if (!mongoUser) {
      const newUser = {
        active: false,
        rol: assignRoleByEmail(userEmail),
        socketId: "",
        isInside: false,
        card_id: "",
        pushToken: fcmToken,
        is_in_tower_entrance: false,
        is_inside_tower: false,
        ...kaotikaUser,
      };

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

const assignRoleByEmail = (email: string) => {
  if (email.includes(EMAIL.ACOLYTE)) {
    return USER_ROLES.ACOLYTE;
  } else if (email === EMAIL.ISTVAN) {
    return USER_ROLES.ISTVAN;
  } else if (email === EMAIL.MORTIMER) {
    return USER_ROLES.MORTIMER;
  } else if (email === EMAIL.VILLAIN) {
    return USER_ROLES.VILLAIN;
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
    const acolytes = User.getAcolytes();
    return acolytes;
  } catch (error: any) {
    throw error;
  }
};

const userService = {
  getUser,
  createUser,
  updateUser,
  getKaotikaUser,
  loginUser,
  logedUser,
  getAcolytes,
};

export default userService;
