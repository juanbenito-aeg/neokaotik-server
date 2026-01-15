import { Request, Response } from "express";
import { jwtMiddleware } from "../../middleware/jwt.middleware";
import { MOCKED_PLAYER } from "../../__mocks__/mocked-player";
import * as jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({ sign: jest.fn(), verify: jest.fn() }));

describe("JWT Middleware", () => {
  const req = {
    headers: { authorization: "Bearer validToken" },
    path: "/protected",
  } as unknown as Request;
  const res = {
    locals: { playerEmail: MOCKED_PLAYER.email },
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
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

  describe("'verifyJWT'", () => {
    it("should call next() when a valid access token is provided", () => {
      (jwt.verify as unknown as jest.Mock).mockReturnValue({
        data: MOCKED_PLAYER.email,
      });

      jwtMiddleware.verifyJWT(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  it("should send 403 when token verification fails", () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    jwtMiddleware.verifyJWT(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith("Access token is expired.");
    expect(next).not.toHaveBeenCalled();
  });
});
