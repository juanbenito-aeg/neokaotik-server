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

const getAcolytes = async () => {
  try {
    const acolytes = userModel.find({ rol: "acolyte" });
    return acolytes;
  } catch (error: any) {
    throw error;
  }
};

const userDatabase = {
  getUserByField,
  createUser,
  updateUserByField,
  getAcolytes,
};

export default userDatabase;
