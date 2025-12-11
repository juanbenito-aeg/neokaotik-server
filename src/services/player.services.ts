import playerDb from "../db/player.db";
import { Fields } from "../interfaces/generics";
import IPlayer from "../interfaces/IPlayer";

const getPlayer = async (playerEmail: string) => {
  try {
    console.log("Fetching user from MongoDB...");

    const player = await playerDb.getPlayerByField({ email: playerEmail });
    return player;
  } catch (error) {
    throw error;
  }
};

const createPlayer = async (newPlayer: IPlayer) => {
  try {
    console.log("User not found in MongoDB.");
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

const playerServices = {
  getPlayer,
  createPlayer,
  updatePlayer,
  getAcolytes,
  getNonAcolytePlayers,
};

export default playerServices;
