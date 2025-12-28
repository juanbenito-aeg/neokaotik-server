import authServices from "../services/auth.services";
import { Request, Response } from "express";
import { Methods } from "../constants/general";

const logIn = async (req: Request, res: Response) => {
  const playerEmail = res.locals.playerEmail;
  const fcmToken = res.locals.fcmToken;

  console.log(`Logging in with email: ${playerEmail}.`);

  if (!playerEmail) {
    console.log(`Email not available: ${playerEmail}.`);

    return res.status(400).send({
      status: "FAILED",
      data: { error: "playerEmail not available" },
    });
  }

  try {
    const putOrPost = await authServices.logIn(playerEmail, fcmToken);

    const player = putOrPost[1];

    if (putOrPost[0] === Methods.POST) {
      console.log("Player created successfully.");

      return res.status(201).send({
        status: "OK",
        message: "Player created successfully",
        user: player,
      });
    } else {
      console.log("Player updated successfully.");

      return res.status(200).send({
        status: "OK",
        message: "Player updated successfully",
        user: player,
      });
    }
  } catch (error) {
    console.log(`Player not found in Kaotika with email: ${playerEmail}`);

    res.status(403).send({
      status: "FAILED",
      message: "Player not found on kaotika",
    });
  }
};

const accessLoggedIn = async (req: Request, res: Response) => {
  const playerEmail = res.locals.playerEmail;
  const fcmToken = res.locals.fcmToken;

  console.log(`Player with email: ${playerEmail} already logged in.`);

  if (!playerEmail) {
    console.log(`Email not available: ${playerEmail}.`);

    return res.status(400).send({
      status: "FAILED",
      data: { error: "playerEmail not available" },
    });
  }

  try {
    const updatedPlayer = await authServices.accessLoggedIn(
      playerEmail,
      fcmToken
    );

    console.log("Player updated successfully.");

    return res.status(200).send({
      status: "OK",
      message: "Player updated successfully",
      user: updatedPlayer,
    });
  } catch (error) {
    return res.status(400).send({
      status: "FAILED",
      data: { error: "playerEmail not available" },
    });
  }
};

const authControllers = {
  logIn,
  accessLoggedIn,
};

export default authControllers;
