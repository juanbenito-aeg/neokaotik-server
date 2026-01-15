import { Request, Response } from "express";

function refresh(req: Request, res: Response) {
  res.send({
    accessToken: res.locals.accessToken,
    refreshToken: res.locals.refreshToken,
  });
}

const jwtControllers = { refresh };

export { jwtControllers };
