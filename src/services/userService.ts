import playerDb from "../db/player.db";
import { Fields } from "../interfaces/generics";
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
  getAcolytes,
  getNonAcolytePlayers,
};

export default userService;
