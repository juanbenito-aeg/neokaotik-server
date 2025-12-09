import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../index";
import { UserRole } from "../../constants/player";
import IPlayer from "../../interfaces/IPlayer";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST!);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /user/get-acolytes", () => {
  it("should return all users with the role 'acolyte'", async () => {
    const response = await request(app).get("/user/get-acolytes");

    expect(response.statusCode).toBe(200);

    const acolytes: IPlayer[] = response.body;

    expect(acolytes.length).toBeGreaterThan(0);

    acolytes.forEach((acolyte) => {
      expect(acolyte.rol).toBe(UserRole.ACOLYTE);
    });
  });
});

describe("PATCH /user/update/:userEmail", () => {
  const fieldToUpdate = "experience";
  const newValue = 61000;

  it("should update the user with the specified email", async () => {
    const response = await request(app)
      .patch("/user/update/juan.benito@ikasle.aeg.eus")
      .send({ [fieldToUpdate]: newValue });

    expect(response.statusCode).toBe(200);

    const user: IPlayer = response.body;

    expect(user[fieldToUpdate]).toEqual(newValue);
  });

  it("should answer with a 403 Forbidden error when no user with the specified email exists in the DB", async () => {
    const invalidEmail = "j.b@ikasle.aeg.eus";

    const response = await request(app)
      .patch(`/user/update/${invalidEmail}`)
      .send({ [fieldToUpdate]: newValue });

    expect(response.statusCode).toBe(403);

    const errorMessage = `Cannot find user with the email "${invalidEmail}".`;

    expect(response.body.data.error).toBe(errorMessage);
  });
});

describe("GET /user/non-acolyte-players", () => {
  it("should return all players that are not acolytes", async () => {
    const response = await request(app).get("/user/non-acolyte-players");

    const nonAcolytes: IPlayer[] = response.body;

    expect(response.statusCode).toBe(200);
    expect(nonAcolytes).not.toBeNull();
    expect(nonAcolytes.length).toBeGreaterThan(0);
  });
});

describe("GET /user/get/:userEmail", () => {
  it("should return player with the specified email", async () => {
    const email = "oskar.calvo@aeg.eus";
    const response = await request(app).get(`/user/get/${email}`);

    expect.objectContaining({ email: email });
    expect(response.statusCode).toBe(200);
  });

  it("should return an error if the email is invalid", async () => {
    const email = "p.j@km.es";
    const response = await request(app).get(`/user/get/${email}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.errorMessage).not.toBeNull();
  });
});
