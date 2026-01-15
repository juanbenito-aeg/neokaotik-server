import { Request, Response, NextFunction } from "express";
import { jwtServices } from "../services/jwt.services";
import * as jwt from "jsonwebtoken";

function createJWT(req: Request, res: Response, next: NextFunction) {
  const playerEmail = res.locals.playerEmail;

  res.locals.accessToken = jwtServices.generateAccessToken(playerEmail);
  res.locals.refreshToken = jwtServices.generateRefreshToken(playerEmail);

  next();
}

function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const authenticationHeader = req.headers.authorization;

  const accessOrRefreshToken = authenticationHeader?.split(" ")[1];

  if (!accessOrRefreshToken) {
    console.log("No access/refresh token was provided.");
    return res.sendStatus(401);
  }

  const secretKey =
    req.path === "/refresh"
      ? process.env.REFRESH_TOKEN_SECRET!
      : process.env.ACCESS_TOKEN_SECRET!;

  try {
    const { data: playerEmail } = jwt.verify(
      accessOrRefreshToken,
      secretKey
    ) as jwt.JwtPayload;

    console.log("Access/Refresh token valid.");

    res.locals.playerEmail = playerEmail;

    next();
  } catch (error) {
    console.log("Access token is expired.");
    res.status(403).send("Access token is expired.");
  }
}

const jwtMiddleware = { createJWT, verifyJWT };

export { jwtMiddleware };
