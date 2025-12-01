import { Fields } from "../interfaces/generics";
import userModel from "../models/userModel";
import IPlayer from "../interfaces/IPlayer";

const getUserByField = async (
  fieldToFilterBy: Fields,
  fieldsToIncludeOrExclude = ""
) => {
  try {
    const user = await userModel.findOne(
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
    const userToInsert = new userModel(newUser);
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
    const updatedUser = await userModel.findOneAndUpdate(
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
    await userModel.updateMany(fieldToFilterBy, changesToApply);
  } catch (error: any) {
    throw error;
  }
};

const getAcolytes = async (fieldsToIncludeOrExclude = "") => {
  try {
    const acolytes = await userModel.find(
      { rol: "acolyte" },
      fieldsToIncludeOrExclude
    );
    return acolytes;
  } catch (error: any) {
    throw error;
  }
};

const getNonAcolytePlayers = async () => {
  const nonAcolytePlayers = await userModel.find({ rol: { $ne: "acolyte" } });
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
