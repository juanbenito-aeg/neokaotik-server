import { Request, Response, NextFunction } from "express";
import { jwtServices } from "../services/jwt.services";

function createJWT(req: Request, res: Response, next: NextFunction) {
  const playerEmail = res.locals.playerEmail;

  res.locals.accessToken = jwtServices.generateAccessToken(playerEmail);
  res.locals.refreshToken = jwtServices.generateRefreshToken(playerEmail);

  next();
}

const jwtMiddleware = { createJWT };

export { jwtMiddleware };
