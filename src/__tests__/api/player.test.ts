import request from "supertest";
import { app } from "../../config/server";
import IPlayer from "../../interfaces/IPlayer";
import { PlayerRole } from "../../constants/player";
import { Request, Response, NextFunction } from "express";

jest.mock("../../middleware/jwt.middleware", () => ({
  jwtMiddleware: {
    createJWT: jest.fn(),
    verifyJWT: jest.fn((req: Request, res: Response, next: NextFunction) => {
      next();
    }),
  },
}));

describe("GET /players/acolytes", () => {
  it("should return all players with the role 'acolyte'", async () => {
    const response = await request(app).get("/players/acolytes");

    expect(response.statusCode).toBe(200);

    const acolytes: IPlayer[] = response.body;

    expect(acolytes.length).toBeGreaterThan(0);

    acolytes.forEach((acolyte) => {
      expect(acolyte.rol).toBe(PlayerRole.ACOLYTE);
    });
  });
});

describe("PATCH /players/:email", () => {
  const fieldToUpdate = "experience";
  const newValue = 61000;

  it("should update the player with the specified email", async () => {
    const response = await request(app)
      .patch("/players/juan.benito@ikasle.aeg.eus")
      .send({ [fieldToUpdate]: newValue });

    expect(response.statusCode).toBe(200);

    const user: IPlayer = response.body;

    expect(user[fieldToUpdate]).toEqual(newValue);
  });

  it("should answer with a 403 Forbidden error when no player with the specified email exists in the DB", async () => {
    const invalidEmail = "j.b@ikasle.aeg.eus";

    const response = await request(app)
      .patch(`/players/${invalidEmail}`)
      .send({ [fieldToUpdate]: newValue });

    expect(response.statusCode).toBe(403);

    const errorMessage = `Cannot find player with the email "${invalidEmail}".`;

    expect(response.body.data.error).toBe(errorMessage);
  });
});

describe("GET /players/non-acolytes", () => {
  it("should return all players that are not acolytes", async () => {
    const response = await request(app).get("/players/non-acolytes");

    const nonAcolytes: IPlayer[] = response.body;

    expect(response.statusCode).toBe(200);
    expect(nonAcolytes).not.toBeNull();
    expect(nonAcolytes.length).toBeGreaterThan(0);
  });
});

describe("GET /players/:email", () => {
  it("should return player with the specified email", async () => {
    const email = "oskar.calvo@aeg.eus";
    const response = await request(app).get(`/players/${email}`);

    expect.objectContaining({ email: email });
    expect(response.statusCode).toBe(200);
  });

  it("should return an error if the email is invalid", async () => {
    const email = "p.j@km.es";
    const response = await request(app).get(`/players/${email}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.errorMessage).not.toBeNull();
  });
});
