import { Fields } from "../interfaces/generics";
import Player from "../models/player.model";
import IPlayer from "../interfaces/IPlayer";

const getPlayerByField = async (
  fieldToFilterBy: Fields,
  fieldsToIncludeOrExclude = ""
) => {
  try {
    const player = await Player.findOne(
      fieldToFilterBy,
      fieldsToIncludeOrExclude
    );
    return player;
  } catch (error) {
    throw error;
  }
};

const createPlayer = async (newPlayer: IPlayer) => {
  try {
    const playerToInsert = new Player(newPlayer);
    const createdPlayer = await playerToInsert.save();
    return createdPlayer;
  } catch (error) {
    throw error;
  }
};

const updatePlayerByField = async (
  fieldToFilterBy: Fields,
  changesToApply: Fields
) => {
  try {
    const updatedPlayer = await Player.findOneAndUpdate(
      fieldToFilterBy,
      changesToApply,
      { new: true }
    );
    return updatedPlayer;
  } catch (error: any) {
    throw error;
  }
};

const updatePlayersByField = async (
  fieldToFilterBy: Fields,
  changesToApply: Fields
) => {
  try {
    await Player.updateMany(fieldToFilterBy, changesToApply);
  } catch (error: any) {
    throw error;
  }
};

const getAcolytes = async (fieldsToIncludeOrExclude = "") => {
  try {
    const acolytes = await Player.find(
      { rol: "acolyte" },
      fieldsToIncludeOrExclude
    );
    return acolytes;
  } catch (error: any) {
    throw error;
  }
};

const getNonAcolytePlayers = async () => {
  const nonAcolytePlayers = await Player.find({ rol: { $ne: "acolyte" } });
  return nonAcolytePlayers;
};

const playerDb = {
  getPlayerByField,
  createPlayer,
  updatePlayerByField,
  updatePlayersByField,
  getAcolytes,
  getNonAcolytePlayers,
};

export default playerDb;
