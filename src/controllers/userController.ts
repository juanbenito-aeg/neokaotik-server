import playerServices from "../services/player.services";
import authServices from "../services/auth.services";
import { Request, Response } from "express";

// TESTING
const getMongoUser = async (req: Request, res: Response) => {
  const userEmail = res.locals.userEmail;

  if (!userEmail) {
    return res.status(400).send({
      status: "FAILED",
      data: { error: "userEmail not available" },
    });
  }

  try {
    const user = await playerServices.getPlayer(userEmail);
    if (!user) {
      return res.status(403).send({
        status: "FAILED",
        data: { error: `Can't find user with the Email: ${userEmail}` },
      });
    }
    res.send({ user });
  } catch (error: any) {
    res.status(500).send({
      status: "FAILED",
      message: "Error fetching user from Mongo",
      data: { error: error?.message || error },
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  const {
    params: { userEmail },
  } = req;

  if (!userEmail) {
    return res.status(400).send({
      status: "FAILED",
      data: { error: "Parameter ':userEmail' cannot be empty" },
    });
  }

  try {
    const user = await playerServices.getPlayer(userEmail);
    if (!user) {
      return res.status(403).send({
        status: "FAILED",
        data: { error: `Can't find user with the Email: ${userEmail}` },
      });
    }
    res.send({ user });
  } catch (error: any) {
    res.status(500).send({
      status: "FAILED",
      message: "Error fetching user from Mongo",
      data: { error: error?.message || error },
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const {
    body,
    params: { userEmail },
  } = req;

  if (!userEmail) {
    return res.status(400).send({
      status: "FAILED",
      data: { error: "Parameter ':userEmail' can not be empty" },
    });
  }

  try {
    const updatedUser = await playerServices.updatePlayer(userEmail, body);

    if (!updatedUser) {
      return res.status(403).send({
        status: "FAILED",
        data: { error: `Cannot find user with the email "${userEmail}".` },
      });
    }
    console.log("User updated successfully.");
    res.send(updatedUser);
  } catch (error: any) {
    res.status(500).send({
      status: "FAILED",
      message: "Error updating user",
      data: { error: error?.message || error },
    });
  }
};

const getAcolytes = async (req: Request, res: Response) => {
  try {
    const acolytes = await playerServices.getAcolytes();
    if (acolytes.length === 0) {
      return res.status(404).send({ message: "Acolytes not found" });
    }
    res.send(acolytes);
  } catch (error: any) {
    res.status(500).send({
      status: "FAILED",
      message: "Error fetching acolytes",
      data: { error: error?.message || error },
    });
  }
};

const getNonAcolytePlayers = async (req: Request, res: Response) => {
  try {
    const nonAcolytePlayers = await playerServices.getNonAcolytePlayers();
    res.send(nonAcolytePlayers);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

const userController = {
  getMongoUser,
  getUser,
  updateUser,
  getAcolytes,
  getNonAcolytePlayers,
};

export default userController;
