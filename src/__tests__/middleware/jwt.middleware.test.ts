import { Request, Response } from "express";
import { jwtMiddleware } from "../../middleware/jwt.middleware";
import { MOCKED_PLAYER } from "../../__mocks__/mocked-player";
import * as jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({ sign: jest.fn() }));

describe("JWT Middleware", () => {
  const req = {} as Request;
  const res = {
    locals: { playerEmail: MOCKED_PLAYER.email },
  } as unknown as Response;
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("'createJWT'", () => {
    it("should generate access & refresh tokens using player's email", () => {
      jwtMiddleware.createJWT(req, res, next);

      const payload = { data: res.locals.playerEmail };

      expect(jwt.sign).toHaveBeenNthCalledWith(
        1,
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      expect(jwt.sign).toHaveBeenNthCalledWith(
        2,
        payload,
        process.env.REFRESH_TOKEN_SECRET
      );
    });
  });
});
