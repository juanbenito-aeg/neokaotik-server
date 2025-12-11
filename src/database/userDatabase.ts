import { Fields } from "../interfaces/generics";
import Player from "../models/player.model";
import IPlayer from "../interfaces/IPlayer";

const getUserByField = async (
  fieldToFilterBy: Fields,
  fieldsToIncludeOrExclude = ""
) => {
  try {
    const user = await Player.findOne(
      fieldToFilterBy,
      fieldsToIncludeOrExclude
    );
    return user;
  } catch (error) {
    throw error;
  }
};

const createUser = async (newUser: IPlayer) => {
  try {
    const userToInsert = new Player(newUser);
    const createdUser = await userToInsert.save();
    return createdUser;
  } catch (error) {
    throw error;
  }
};

const updateUserByField = async (
  fieldToFilterBy: Fields,
  changesToApply: Fields
) => {
  try {
    const updatedUser = await Player.findOneAndUpdate(
      fieldToFilterBy,
      changesToApply,
      { new: true }
    );
    return updatedUser;
  } catch (error: any) {
    throw error;
  }
};

const updateUsersByField = async (
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

const userDatabase = {
  getUserByField,
  createUser,
  updateUserByField,
  updateUsersByField,
  getAcolytes,
  getNonAcolytePlayers,
};

export default userDatabase;
