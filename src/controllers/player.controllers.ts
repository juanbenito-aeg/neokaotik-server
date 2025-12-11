import playerServices from "../services/player.services";
import { Request, Response } from "express";

const getPlayer = async (req: Request, res: Response) => {
  const {
    params: { playerEmail },
  } = req;

  if (!playerEmail) {
    return res.status(400).send({
      status: "FAILED",
      data: { error: "Parameter ':playerEmail' cannot be empty" },
    });
  }

  try {
    const player = await playerServices.getPlayer(playerEmail);
    if (!player) {
      return res.status(403).send({
        status: "FAILED",
        data: { error: `Can't find player with the Email: ${playerEmail}` },
      });
    }
    res.send({ player });
  } catch (error: any) {
    res.status(500).send({
      status: "FAILED",
      message: "Error fetching player from Mongo",
      data: { error: error?.message || error },
    });
  }
};

const updatePlayer = async (req: Request, res: Response) => {
  const {
    body,
    params: { playerEmail },
  } = req;

  if (!playerEmail) {
    return res.status(400).send({
      status: "FAILED",
      data: { error: "Parameter ':playerEmail' can not be empty" },
    });
  }

  try {
    const updatedPlayer = await playerServices.updatePlayer(playerEmail, body);

    if (!updatedPlayer) {
      return res.status(403).send({
        status: "FAILED",
        data: { error: `Cannot find player with the email "${playerEmail}".` },
      });
    }
    console.log("Player updated successfully.");
    res.send(updatedPlayer);
  } catch (error: any) {
    res.status(500).send({
      status: "FAILED",
      message: "Error updating player",
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

const playerController = {
  getPlayer,
  updatePlayer,
  getAcolytes,
  getNonAcolytePlayers,
};

export default playerController;
